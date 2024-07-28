const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";
const FgGray = "\x1b[90m";
const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";
const BgGray = "\x1b[100m";
const line = "_".repeat(Math.round(process.stdout.columns / 2));

exports.logArray = (msgArray, type) => {
  let colors = [];

  if (type == "code") {
    colors = [BgBlack, FgGreen];
  } else if (type == "info") {
    colors = [BgBlack, FgYellow];
  } else if (type == "tip") {
    colors = [BgBlack, FgCyan];
  }
  msgArray.forEach((msg) => {
    console.log(...colors, msg, Reset);
  });
  console.log("");
};

exports.displayHelp = () => {
  logTitle("Help");
  let info = ["Start HTTP: node .", "Start HTTPS: node . --secure"];
  this.logArray(info, "info");

  info = ["node . --tips", "Displays tips."];
  this.logArray(info, "info");
};

exports.displayTips = () => {
  //TIPS
  logTitle("Tips");
  let tips = [];
  tips = [
    "- If want your host accessible by your localnetwork,",
    "you may need to update your computer's firewall options.",
  ];
  this.logArray(tips, "tip");

  tips = [
    "- If you want your host accessible over the internet,",
    "you need to forward your ports to your local computer.",
    "Here is your local ip:",
  ];
  this.logArray(tips, "tip");

  tips = ["Here is your local ip(s):", getIP()];
  this.logArray(tips, "tip");

  logTitle("Tips - Dynamic DNS");
  tips = [
    "If you like to forward a DNS to your localhost you can try cloudlfare",
    "Beware, only some ports are supported by cloudflare.",
    "HTTP Ports: 80, 8080, 8880, 2052, 2082, 2086, 2095",
    "HTTPS Ports: 443, 2053, 2083, 2087, 2096, 8443",
  ];
  this.logArray(tips, "tip");

  logTitle("Tips - Afraid.org");
  tips = [
    "Another option for Dynamic DNS is afraid.org",
    "Create an account here https://freedns.afraid.org/signup/?plan=starter",
    "When you signup system will automatically capture your IP.",
  ];
  this.logArray(tips, "tip");

  tips = [
    "These are some other similar servies:",
    "https://www.dynu.com/",
    "https://www.duckdns.org/",
    "https://www.noip.com/ (Only 1 Free)",
    "https://dynv6.com/",
  ];
  this.logArray(tips, "tip");

  return;
  tips = [
    "Once you created your subdomain go here:",
    "https://freedns.afraid.org/dynamic/",
    "Click to Direct URL next to your subdomain.",
    "After this part: update.php?",
    "You'll see your key, copy it, and launch me like:",
    FgGreen + "node . --afraid MY_COPIED_KEY",
    "I'll update Afraid.org for you.",
  ];
  this.logArray(tips, "tip");

  //Dynu UPDATE URL
  //Non SSL: http://api.dynu.com/nic/update?hostname=example.dynu.com&password=PASSWORD
  //ohshift.mywire.org
};

function getIP() {
  //Shamelessly copied from:
  //https://stackoverflow.com/a/8440736/502649
  const { networkInterfaces } = require("os");

  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  return results;
}

function logTitle(...msg) {
  console.log(FgMagenta, ...msg, Reset);
  // console.log("_".repeat(msg[0].length + 2));
}

exports.afraidPing = (key) => {
  let url = `http://freedns.afraid.org/dynamic/update.php?${key}`;
};

const { js, css } = require("./page");

function randKey() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function cookieMonster(req, res, next) {
  const cookie = req.cookies["visitor-id"];
  const randomKey = randKey();
  if (cookie === undefined) {
    res.cookie("visitor-id", randomKey, { maxAge: 900000, httpOnly: true });
  }

  next();
}

exports.cookieMonster = cookieMonster;
