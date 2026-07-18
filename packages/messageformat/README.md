An ICU MessageFormat parser and renderer, with no runtime dependencies.

Parsing and rendering are two separate steps. `parse` turns a message into a flat
array of plain objects, and `createRenderer` builds a renderer that applies those
tokens to a set of variables. Because the parsed result is a plain array, it can be
cached or serialized — you can parse once at startup (or ahead of time) and render
many times.

This package deliberately contains no date or number formatting of its own. You pass
in the formatters you want, so it can sit on top of `Intl`, Globalize, or whatever
your application already uses. If you don't already have formatters,
[`@onigoetz/intl-formatters`](https://www.npmjs.com/package/@onigoetz/intl-formatters)
provides `Intl`-based ones.

## Usage

```typescript
import { parse, createRenderer } from "@onigoetz/messageformat";
import {
  dateFormatter,
  numberFormatter,
  pluralGenerator,
} from "@onigoetz/intl-formatters";

// Parse the message once; the result is cacheable
const parsed = parse("{test, plural, offset:3 one{one test} other {# test} }");

// Create a renderer bound to a locale and a set of formatters
const render = createRenderer(
  "en",
  (locale, type) => pluralGenerator(locale, { type }),
  (locale, options, value: number) => numberFormatter(locale, options)(value),
  (locale, options, value: Date) => dateFormatter(locale, options)(value)
);

render(parsed, { test: 4 }); // => "one test"
render(parsed, { test: 7 }); // => "4 test"
```

## Supported syntax

| Syntax | Example |
| --- | --- |
| Simple argument | `{name}` |
| Plural | `{count, plural, one {book} other {books}}` |
| Plural with offset | `{count, plural, offset:1 one {book} other {books}}` |
| Exact match | `{count, plural, =0 {none} other {#}}` |
| Ordinal | `{rank, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}` |
| Select | `{gender, select, female {her} other {their}}` |
| Number | `{price, number, percent}` |
| Date / time | `{when, date, short}`, `{when, time, full}`, `{when, datetime, long}` |

Inside a `plural` or `selectordinal` block, `#` renders the argument value minus the
offset. Plural selectors are `zero`, `one`, `two`, `few`, `many`, `other`, or an
exact `=N` match.

`number`, `date`, `time` and `datetime` are handed to the formatters you supplied.
Any other argument type is passed through as an unknown formatter and renders as an
empty string, rather than throwing.

## Module format

This package is ESM-only. It requires Node.js >= 22.12, where CommonJS consumers can
still load it with `require()` — no dynamic `import()` needed.
