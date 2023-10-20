const path = require("path");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-jest",
    "@swissquote/crafty-preset-typescript"
  ],
  /**
   * Represents the extension point for Jest configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} options - The Jest configuration object
   */
  jest(crafty, options) {
    options.reporters = ['default', 'jest-sonar'];
  }
};
