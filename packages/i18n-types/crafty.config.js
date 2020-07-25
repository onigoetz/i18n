const path = require("path");

const MODULES = path.join(__dirname, "..", "..", "node_modules");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-jest",
    "@swissquote/crafty-preset-typescript",
    "@swissquote/crafty-runner-gulp"
  ],
  destination_js: "dist",
  js: {
    "sq-i18n-types": {
      runner: "gulp/typescript",
      source: "index.ts"
    }
  },
  /**
   * Represents the extension point for Webpack configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} bundle - The bundle that is being prepared for build (name, input, source, destination)
   * @param {WebpackChain} chain - The current Webpack configuration using `webpack-chain`
   */
  webpack(crafty, bundle, chain) {
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);
  },
  /**
   * Represents the extension point for rollup configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {Object} options - The Jest configuration object
   */
  jest(crafty, options) {
    options.moduleDirectories.push(MODULES);
  }
};
