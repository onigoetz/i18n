const path = require("path");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-runner-gulp"
  ],
  destination_js: "dist",
  js: {
    "sq-i18n-types": {
      runner: "gulp/typescript",
      source: "index.ts"
    }
  }
};
