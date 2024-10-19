import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: [
      "default",
      [
        "vitest-sonar-reporter",
        {
          outputFile: "coverage/sonar-report.xml",
          onWritePath(path: string) {
            return `../${path}`;
          },
        },
      ],
    ],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
