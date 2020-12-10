module.exports = {
  presets: [
    "@swissquote/crafty-runner-rollup",
    "@swissquote/crafty-preset-babel"
  ],
  js: {
    "onigoetz-make-plural": {
      source: "src/onigoetz-make-plural.js",
      format: "cjs"
    },
    "onigoetz-make-plural-memoized": {
      source: "src/onigoetz-make-plural-memoized.js",
      format: "cjs"
    },
    "phensley-plurals": {
      source: "src/phensley-plurals.js",
      format: "cjs"
    }
  },
  rollup(crafty, bundle, rollupConfig) {
    // We want commonjs output, which means default exports are going to be mapped to `module.exports`
    rollupConfig.output.exports = "auto";
    rollupConfig.input.plugins.terser.options.mangle = false;
  }
};
