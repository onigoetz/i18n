import { Parcel } from "@parcel/core";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let bundler = new Parcel({
  entries: [
    "src/onigoetz-intl.js",
    "src/onigoetz-make-plural.js",
    "src/onigoetz-make-plural-memo.js",
    "src/make-plural.js",
    "src/phensley-plurals.js",
  ],
  defaultConfig: "@parcel/config-default",
  defaultTargetOptions: {
    shouldOptimize: true,
    shouldScopeHoist: false
  }
});

try {
  let { bundleGraph, buildTime } = await bundler.run();
  let bundles = bundleGraph.getBundles();
  for (const bundle of bundles) {
    console.log("- ", bundle.filePath.replace(`${__dirname}/`, ''), `${bundle.stats.time}ms`)
  }
  console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
} catch (err) {
  console.log(err.diagnostics);
}
