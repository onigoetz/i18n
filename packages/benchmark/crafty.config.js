module.exports = {
  presets: [
    "@swissquote/crafty-runner-rollup",
    "@swissquote/crafty-preset-babel"
  ],
  js: {
    "ffz-icu-msgparser": {
      source: "src/ffz-icu-msgparser.js",
      format: "cjs"
    },
    "onigoetz-messageformat": {
      source: "src/onigoetz-messageformat.js",
      format: "cjs"
    },
    "intl-messageformat": {
      source: "src/intl-messageformat.js",
      format: "cjs"
    },
    messageformat: {
      source: "src/messageformat.js",
      format: "cjs"
    },
    "phensley-messageformat": {
      source: "src/phensley-messageformat.js",
      format: "cjs"
    },
    "format-message": {
      source: "src/format-message.js",
      format: "cjs"
    }
  },
  rollup(crafty, bundle, rollupConfig) {
    // Disable minification for profiling
    //delete rollupConfig.input.plugins.uglify;
  }
};
