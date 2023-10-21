import { BaseReporter } from "@japa/runner/core";
import { NamedReporterContract } from "@japa/core/types";

export interface SonarqubeReporterOptions {
    file?: string;
}

export default class SonarqubeReporter extends BaseReporter {
    constructor(options?: SonarqubeReporterOptions);
}

export function sonarqubeReporter(options?: SonarqubeReporterOptions): NamedReporterContract;