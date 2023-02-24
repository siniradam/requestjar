const fs = require("fs");
const { parseArgs } = require("node:util");

//Do Not Edit =>
//Launch Parameters
const launchParams = require("./src/params");
const { values, tokens } = parseArgs(launchParams);
// <= Do Not Edit

//Server Stuff.
const express = require("express");
const https = require("https");
const { logArray, displayHelp, displayTips, homepage } = require("./src/utils");

const httpServerConfig = {
  port: 8080,
};

if (values.help) {
  displayHelp();
} else if (values.tips) {
  displayTips();
} else {
  startServer(values.secure);
}

function checkCerts() {
  if (!fs.existsSync("./certs/key.pem")) {
    console.error(
      `I can't find PEM file, if you haven't created a certificate please run these commands and move to ./certs folder.`
    );
    let commands = [
      "openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365",
      "openssl rsa -in keytmp.pem -out key.pem",
    ];
    logArray(commands, "code");
    return false;
  } else {
    return true;
  }
}

let viewers = {};

function startServer(isSecure) {
  const app = express();
  let isOk = true;

  if (isSecure) {
    isOk = checkCerts();
  }

  if (isOk) {
    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    //Live Data
    app.get("/live/:connectionId", (req, response) => {
      response.setHeader("Connection", "keep-alive");
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");

      let connectionId = req.params.connectionId;

      //Store Viewer Client references.
      viewers[connectionId] = response;

      //Send an initial message.
      setTimeout(
        () =>
          sendEvent(
            response,
            `{message:"Hello", time:"${Date.now()}", clientId:"${connectionId}"}`
          ),
        500
      );

      console.log("New viewer.", connectionId);

      //Cleanup.
      req.on("close", function () {
        delete viewers[connectionId];
        console.log("Viewer left.", connectionId);
      });
    });

    //Handle Requests
    app.all("*", function (req, res) {
      const { originalUrl, body, query, headers } = req;

      //Display requested URL
      console.log(originalUrl);

      //
      let date = new Date().toISOString();

      let requestedData = { originalUrl, query, body, headers };
      //
      if (Object.keys(body).length || Object.keys(query).length) {
        //Store in a file
        storeLog(date.replaceAll(":", "-"), requestedData);

        //Broadcast to watchers.
        publishEvent(requestedData);

        //Return a response to the requesting party/
        res.json({ received: date });
        //
      } else {
        res.send(homepage);
      }
    });

    if (isSecure) {
      const key = fs.readFileSync("./certs/key.pem");
      const cert = fs.readFileSync("./certs/cert.pem");
      const server = https.createServer({ key: key, cert: cert }, app);
      httpServerConfig.port++;

      //"192.168.4.128",
      server.listen(httpServerConfig.port, "0.0.0.0", () => {
        console.log("Running with HTTPS", httpServerConfig.port);
      });
    } else {
      app.listen(httpServerConfig.port, "0.0.0.0", () => {
        console.log("Running", httpServerConfig.port);
      });
    }
  }
}

function publishEvent(requestedData) {
  let viewerReferences = Object.keys(viewers);
  if (viewerReferences.length) {
    viewerReferences.forEach((refId) => {
      console.log("Publishing to:", refId);
      sendEvent(viewers[refId], JSON.stringify(requestedData));
    });
  }
}

function sendEvent(ref, event) {
  ref.write(`event: update\ndata: ${event}\n\n`);
}

function storeLog(filename, request) {
  if (!fs.existsSync("./logs/")) {
    fs.mkdirSync("logs");
  }

  fs.writeFile(
    `./logs/${filename}.json`,
    JSON.stringify(request, null, 2),
    () => {}
  );
}
