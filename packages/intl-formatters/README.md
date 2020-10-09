This package provides simple implementations for Messageformat using the Intl API.

## Features

- **Numbers and currencies**: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Intl/NumberFormat
- **Dates**: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Intl/DateTimeFormat
- **Relative Time**: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Intl/RelativeTimeFormat
- **Plurals**: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Intl/PluralRules

## How to use

These formatters are best used in conjunction with `@onigoetz/messageformat`.
However they are fully Typed and you may use them for any other use.

```typescript
import { parse, createRenderer } from "@onigoetz/messageformat";
import {
  dateFormatter,
  numberFormatter,
  pluralGenerator,
} from "@onigoetz/intl-formatters";

// Parse the MessageFormat to a renderable format
const parsed = parse("{test, plural, offset:3 one{one test} other {# test} }");

// Create a localized renderer
const render = createRenderer(
  "en",
  (locale: T, type) => pluralGenerator(locale, { type }),
  (locale: T, options, value: number) =>
    numberFormatter(locale, options)(value),
  (locale: T, options, value: Date) => dateFormatter(locale, options)(value)
);

render(parsed, { test: 4 }); // => "one test"
render(parsed, { test: 7 }); // => "4 test"
```

### For NodeJS

If you do some generation using NodeJS and wish to use locales other than `en`.
I strongly suggest you look at the following page : https://nodejs.org/api/intl.html#intl_providing_icu_data_at_runtime
This page explains how to make sure you have all the right locales loaded to make your formatting.

## Browser Support

### Intl Base API (Dates, Numbers, Currencies, Relative Time)

[!['Can I use' table](https://caniuse.bitsofco.de/static/v1/mdn-javascript__builtins__Intl-1602274285145.jpg)](https://caniuse.com/mdn-javascript_builtins_intl)

## Plurals

[!['Can I use' table](https://caniuse.bitsofco.de/image/intl-pluralrules.png)](https://caniuse.com/intl-pluralrules)
