import assert from "node:assert/strict";

import {
  dateFormatter,
  numberFormatter,
  pluralGenerator,
} from "@onigoetz/intl-formatters";
import makePlural from "@onigoetz/make-plural";
import { createRenderer, parse } from "@onigoetz/messageformat";

const parsed = parse("{test, plural, offset:3 one{one test} other {# test} }");

const render = createRenderer(
  "en",
  (locale, type) => pluralGenerator(locale, { type }),
  (locale, options, value) => numberFormatter(locale, options)(value),
  (locale, options, value) => dateFormatter(locale, options)(value),
);

assert.equal(render(parsed, { test: 4 }), "one test");
assert.equal(render(parsed, { test: 7 }), "4 test");
assert.equal(typeof makePlural, "function");

console.log("  esm: ok");
