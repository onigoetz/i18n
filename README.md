# @onigoetz/i18n

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
// Coming soon
```

## Who is the audience for this library ?

This library is meant for applications starting with medium scale, where you might have multiple libraries and frameworks inside.
Since these libraries don't make any assumption about your stack, you can integrate them in any kind of application.

Most importantly, if you have an environment where pre-compiling translations isn't possible,
for example because your translation build process is separate from your app build process or you have a modular application / microfrontend.

This library is very interesting as a lightweight runtime because of its small footprint and performant parsing.

## Inspiration

This suite of packages certainly wouldn't exist without the previous work in the field.

This package forked [https://www.npmjs.com/package/make-plural](`make-plural`) at version 4 to make it smaller.
Took inspiration for the MessageFormat parser from [https://www.npmjs.com/package/@ffz/icu-msgparser](`@ffz/icu-msgparser`) 
for its small size and [https://www.npmjs.com/package/@phensley/messageformat](`@phensley/messageformat`) for its parsing speed.
