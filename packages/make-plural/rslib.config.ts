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
  ],
});
