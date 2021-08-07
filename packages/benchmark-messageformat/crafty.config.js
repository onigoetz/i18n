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
    "onigoetz-messageformat-memoized": {
      source: "src/onigoetz-messageformat-memoized.js",
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
    // We want commonjs output, which means default exports are going to be mapped to `module.exports`
    rollupConfig.output.exports = "auto";
    rollupConfig.input.plugins.terser.options.mangle = false;

    // TODO :: fix this in Crafty
    rollupConfig.input.plugins.babel.weight = 80;
  }
};
