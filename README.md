# @onigoetz/i18n

[![Latest version](https://img.shields.io/github/release/onigoetz/i18n.svg?style=flat-square)](https://github.com/onigoetz/i18n/releases)
![License](https://img.shields.io/github/license/onigoetz/i18n?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/onigoetz/i18n/node.js.yml?style=flat-square&logo=github)
[![Sonar Coverage](https://sonarcloud.io/api/project_badges/measure?project=onigoetz_i18n&metric=coverage)](https://sonarcloud.io/dashboard?id=onigoetz_i18n)
[![Sonar Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=onigoetz_i18n&metric=alert_status)](https://sonarcloud.io/dashboard?id=onigoetz_i18n)
[![NPM Downloads](https://img.shields.io/npm/dm/@onigoetz/messageformat?style=flat-square&logo=npm)](https://www.npmjs.com/package/@onigoetz/messageformat)

A suite of packages to ease your translation needs.

## Packages

- `@onigoetz/messageformat` a MessageFormat parsing and rendering library
- `@onigoetz/make-plural` a lighter fork of `make-plural` meant for browser usage
- `@onigoetz/intl-formatters` default formatters if you don't already have formatters for dates and numbers, uses the standard `Intl` API

## Features

- Small, Fast and no NPM dependencies
- TypeScript ❤️
- Fully tested
- Flexible; Use one package, or two, bring your own formatters, or use the embedded ones, use on Node.js, or in the browser. You choose !
- ICU MessageFormat compatible
- CLDR compatible

## Example

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

## Who is the audience for this library ?

This library is meant for applications starting with medium scale, where you might have multiple libraries and frameworks inside.
Since these libraries don't make any assumption about your stack, you can integrate them in any kind of application.

Most importantly, if you have an environment where pre-compiling translations isn't possible,
for example because your translation build process is separate from your app build process or you have a modular application / microfrontend.

This library is very interesting as a lightweight runtime because of its small footprint and performant parsing.

## Inspiration

This suite of packages certainly wouldn't exist without the previous work in the field.

This package forked [`make-plural`](https://www.npmjs.com/package/make-plural) at version 4 to make it smaller.
Took inspiration for the MessageFormat parser from [`@ffz/icu-msgparser`](https://www.npmjs.com/package/@ffz/icu-msgparser)
for its small size and [`@phensley/messageformat`](https://www.npmjs.com/package/@phensley/messageformat) for its parsing speed.
