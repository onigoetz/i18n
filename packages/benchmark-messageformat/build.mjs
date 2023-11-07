import { Parcel } from "@parcel/core";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let bundler = new Parcel({
  entries: [
    "src/ffz-icu-msgparser.js",
    "src/onigoetz-messageformat.mjs",
    "src/onigoetz-messageformat-memoized.js",
    "src/onigoetz-messageformat-phensley-plurals.mjs",
    "src/intl-messageformat.js",
    "src/messageformat.js",
    "src/phensley-messageformat.js",
    "src/format-message.js",
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
    console.log(
      "- ",
      bundle.filePath.replace(`${__dirname}/`, ""),
      `${bundle.stats.time}ms`
    );
  }
  console.log(`✨ Built ${bundles.length} bundles in ${buildTime}ms!`);
} catch (err) {
  console.log(err.diagnostics);
}
