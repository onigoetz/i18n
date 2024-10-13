import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      dts: {
        bundle: false,
        distPath: './dist/types',
      },
      format: "esm",
      output: {
        distPath: {
          root: "./dist/esm"
        },
      },
    },
    {
      dts: false,
      format: "cjs",
      output: {
        distPath: {
          root: "./dist/cjs"
        },
      },
    },
  ],
});
