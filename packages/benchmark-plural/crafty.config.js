module.exports = {
  presets: [
    "@swissquote/crafty-runner-rollup",
    "@swissquote/crafty-preset-babel"
  ],
  js: {
    "onigoetz-intl": {
      source: "src/onigoetz-intl.js",
      format: "cjs"
    },
    "onigoetz-intl-memo": {
      source: "src/onigoetz-intl-memo.js",
      format: "cjs"
    },
    "onigoetz-make-plural": {
      source: "src/onigoetz-make-plural.js",
      format: "cjs"
    },
    "onigoetz-make-plural-memo": {
      source: "src/onigoetz-make-plural-memo.js",
      format: "cjs"
    },
    "make-plural": {
      source: "src/make-plural.js",
      format: "cjs"
    },
    "phensley-plurals": {
      source: "src/phensley-plurals.js",
      format: "cjs"
    },
    "phensley-plurals-memo": {
      source: "src/phensley-plurals-memo.js",
      format: "cjs"
    }
  },
  rollup(crafty, bundle, rollupConfig) {
    // We want commonjs output, which means default exports are going to be mapped to `module.exports`
    rollupConfig.output.exports = "auto";
    rollupConfig.input.plugins.terser.options.mangle = false;
  }
};
