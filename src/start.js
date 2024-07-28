const { logArray } = require("./utils");

const info = ["Thanks for trying RequestJar", "Starting in Http Mode:"];
logArray(info, "info");
logArray(["npm run serve"], "code");
logArray(["Start in Https Mode:"], "info");
logArray(["npm run serves"], "code");

const moreinfo = ["For more info and tips", "you can use these commands"];
logArray(moreinfo, "info");
logArray(["npm run help", "npm run tips"], "code");
