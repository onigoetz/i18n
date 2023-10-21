import { expect } from "@japa/expect";
import { configure, processCLIArgs, run } from "@japa/runner";
import { sonarqubeReporter } from "japa-sonarqube-reporter";
import { spec } from "@japa/runner/reporters";

processCLIArgs(process.argv.splice(2));

configure({
  files: ["src/*.test.ts"],
  plugins: [expect()],
  reporters: {
    activated: ["spec", "sonarqube"],
    list: [
      spec(),
      sonarqubeReporter(),
    ],
  },
});

run();
