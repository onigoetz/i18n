const path = require("path");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-jest",
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-runner-gulp",
    "@swissquote/crafty-runner-rollup"
  ],
  destination_js: "dist",
  js: {
    "files": {
      runner: "gulp/typescript",
      source: ["src/*.ts", "!src/*.test.ts"]
    },
    "cjs": {
      runner: "rollup",
      format: "cjs",
      source: "src/index.ts"
    }
  },
  /**
   * Represents the extension point for rollup configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} options - The Jest configuration object
   */
  jest(crafty, options) {
    options.reporters = ['default', 'jest-sonar'];
  }
};
