import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    "make-plural",
    "onigoetz-intl",
    "onigoetz-make-plural-memo",
    "onigoetz-make-plural",
    "phensley-plurals",
  ].map((source) => ({
    source: {
      entry: {
        [source]: `./src/${source}.js`,
      },
    },
    format: "cjs",
    output: {
      target: "node",
    },
  })),
});
