#!/usr/bin/env node
// Verifies what actually reaches npm, rather than what the workspace looks like.
//
// This exists because every package once shipped an empty tarball for a whole
// RC cycle with green CI: `dist` was gitignored and no `files` field overrode
// it, so npm published sources and no build output. Unit tests never caught it
// because they run against src, and a workspace link resolves through `source`
// and succeeds even when the tarball is empty. The only way to see what a
// consumer sees is to pack, install the tarball, and import it.
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const packages = [
  "i18n-types",
  "make-plural",
  "messageformat",
  "intl-formatters",
];

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });

console.log("\n=== publint + attw");
for (const pkg of packages) {
  console.log(`\n--- ${pkg}`);
  run("yarn", ["publint", `packages/${pkg}`], root);
  // `esm-only` stops attw flagging CJSResolvesToESM: these packages are
  // deliberately ESM-only, and every Node version in the supported range
  // (>=22.12) can require() them via require(esm). The cjs.cjs fixture below
  // is what actually proves that, rather than taking it on trust.
  run("yarn", ["attw", "--pack", `packages/${pkg}`, "--profile", "esm-only"], root);
}

console.log("\n=== pack");
const work = mkdtempSync(join(tmpdir(), "i18n-verify-"));
const tarballs = packages.map((pkg) => {
  const out = execFileSync(
    "npm",
    ["pack", "--pack-destination", work, "--silent"],
    { cwd: join(root, "packages", pkg), encoding: "utf8" },
  );
  return join(work, out.trim().split("\n").pop());
});

console.log("\n=== install tarballs into a clean fixture");
const fixture = join(work, "fixture");
mkdirSync(fixture);
writeFileSync(
  join(fixture, "package.json"),
  `${JSON.stringify({ name: "fixture", private: true, version: "0.0.0" }, null, 2)}\n`,
);
cpSync(join(root, "scripts", "fixtures"), fixture, { recursive: true });
run("npm", ["install", "--no-audit", "--no-fund", ...tarballs], fixture);

console.log("\n=== run fixtures");
run("node", ["esm.mjs"], fixture);
run("node", ["cjs.cjs"], fixture);

console.log(`\nPackaging verified for all ${packages.length} packages.\n`);
