import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    "eo-locale-core",
    "ffz-icu-msgparser",
    "format-message",
    "globalize",
    "intl-messageformat",
    "messageformat-core",
    "onigoetz-messageformat-intl",
    "onigoetz-messageformat-make",
    "onigoetz-messageformat-oni-make",
    "onigoetz-messageformat-phensley-plurals",
    "phensley-messageformat"
  ].map((source) => ({
    source: {
      entry: {
        [source]: `./src/${source}.js`,
      },
    },
    format: "cjs",
    output: {
      target: "node",
      minify: true,
    },
  })),
});
