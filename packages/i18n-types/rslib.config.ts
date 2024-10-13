import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: { index: "./index.ts" },
  },
  lib: [
    {
      dts: {
        bundle: false,
        distPath: './dist/types',
      },
      format: "esm",
      output: {
        distPath: {
          root: "./dist/esm",
          css: ".",
          cssAsync: ".",
        },
      },
    },
    {
      dts: false,
      format: "cjs",
      output: {
        distPath: {
          root: "./dist/cjs",
          css: ".",
          cssAsync: ".",
        },
      },
    },
  ],
});
