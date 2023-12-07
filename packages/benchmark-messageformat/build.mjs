import { Parcel } from "@parcel/core";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let bundler = new Parcel({
  entries: [
    "src/eo-locale-core.js",
    "src/ffz-icu-msgparser.js",
    "src/format-message.js",
    "src/globalize.js",
    "src/intl-messageformat.js",
    "src/messageformat-core.js",
    "src/onigoetz-messageformat-intl.mjs",
    "src/onigoetz-messageformat-make.mjs",
    "src/onigoetz-messageformat-flat-intl.mjs",
    "src/onigoetz-messageformat-flat-make.mjs",
    "src/onigoetz-messageformat-flat-phensley-plurals.mjs",
    "src/onigoetz-messageformat-initial-intl.mjs",
    "src/onigoetz-messageformat-initial-oni-make.mjs",
    "src/onigoetz-messageformat-tree-intl.mjs",
    "src/onigoetz-messageformat-phensley-plurals.mjs",
    "src/phensley-messageformat.js",
  ],
  defaultConfig: "@parcel/config-default",
  defaultTargetOptions: {
    shouldOptimize: false,
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
