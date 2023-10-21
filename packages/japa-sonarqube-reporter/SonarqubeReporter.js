import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { BaseReporter } from "@japa/runner/core";

class Test {
  title;
  duration;
  status;

  constructor(title, duration, status) {
    this.title = title;
    this.duration = duration;
    this.status = status;
  }

  toXML() {
    // TODO :: escape title
    const start = `    <testCase name="${this.title}" duration="${this.duration}"`;

    if (this.status === "success") {
      return start + " />";
    }

    return `${start}>\n      <${this.status} />\n    </testCase>`;
  }
}

class File {
  name;
  tests = [];

  constructor(name) {
    this.name = name;
  }

  addTest(test) {
    this.tests.push(test);
  }

  toXML() {
    return `  <file path="${this.name}">\n${this.tests
      .map((t) => t.toXML())
      .join("\n")}\n  </file>`;
  }
}

export default class SonarqubeReporter extends BaseReporter {
  options = {};
  testFiles = {};

  constructor(options) {
    super();
    this.options = { file: "coverage/sonar-report.xml", ...options };
  }

  onTestEnd(payload) {
    const fileName = payload.meta.fileName;

    if (!this.testFiles.hasOwnProperty(fileName)) {
      this.testFiles[fileName] = new File(fileName);
    }

    this.testFiles[fileName].addTest(
      new Test(
        this.testTitle(payload),
        payload.duration,
        this.testStatus(payload)
      )
    );
  }

  testTitle(payload) {
    let prefix = "";
    if (payload.meta.suite.name !== "default") {
      prefix += `${payload.meta.suite.name} - `;
    }

    if (payload.meta.group) {
      prefix += `${payload.meta.group.options.title} - `;
    }

    return prefix + payload.title.toString();
  }

  testStatus(payload) {
    if (payload.isTodo) {
      return "skipped";
    }
    if (payload.isFailing) {
      return "failure";
    }
    if (payload.hasError) {
      return "error";
    }
    if (payload.isSkipped) {
      return "skipped";
    }
    return "success";
  }

  getReportPath() {
    const filePath = this.options.file;
    if (path.isAbsolute(filePath)) {
      return filePath;
    }

    return path.join(process.cwd(), filePath);
  }

  async writeReport(destination, content) {

    const dir = path.dirname(destination);
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true  });
    }

    await fs.writeFile(destination, content);
  }

  async end() {
    const files = Object.values(this.testFiles)
      .map((file) => file.toXML())
      .join("\n");
    const result = `<testExecutions version="1">\n${files}\n</testExecutions>`;

    const reportPath = this.getReportPath();

    await this.writeReport(reportPath, result);

    console.log("Execution report written to", reportPath);
  }
}

export function sonarqubeReporter() {
  return {
    name: "sonarqube",
    handler: (...args) => new SonarqubeReporter().boot(...args),
  };
}
