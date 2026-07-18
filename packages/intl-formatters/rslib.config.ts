import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      dts: {
        // Bundled so the emitted declarations inline the types from
        // @onigoetz/i18n-types, which is only a devDependency here.
        bundle: true,
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
