import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      dts: {
        // Bundled so the emitted declarations inline the types from
        // @onigoetz/i18n-types instead of referencing it by name, which keeps
        // this package free of runtime dependencies.
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
