// Verifies the `require(esm)` guarantee: these packages are ESM-only, but every
// Node version in the supported range (>=22.12) can require() them directly.
const assert = require("node:assert/strict");

const {
  dateFormatter,
  numberFormatter,
  pluralGenerator,
} = require("@onigoetz/intl-formatters");
const { createRenderer, parse } = require("@onigoetz/messageformat");

const parsed = parse("{test, plural, offset:3 one{one test} other {# test} }");

const render = createRenderer(
  "en",
  (locale, type) => pluralGenerator(locale, { type }),
  (locale, options, value) => numberFormatter(locale, options)(value),
  (locale, options, value) => dateFormatter(locale, options)(value),
);

assert.equal(render(parsed, { test: 4 }), "one test");
assert.equal(render(parsed, { test: 7 }), "4 test");

console.log("  cjs: ok");
