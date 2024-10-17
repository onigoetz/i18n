# plural benchmarks

In this benchmark we'll look at two metrics : Library size and speed.

When doing the other benchmark in this repository I saw that what was taking most of the time wasn't the
parsing or rendering of messageformat but the different formatters and plurals generators.

I was curious about how different they were.

## Libraries size

Sources can be found in `src`, measure taken on 25/06/2020 With latest available versions

| Npm Package               | Version    | Size | Comment                                                                              |
| ------------------------- | ---------- | ---- | ------------------------------------------------------------------------------------ |
| @onigoetz/intl-formatters | 1.0.0-rc.2 | 2.6K | Embeds the formatters in the runtime                                                 |
| @onigoetz/make-plural     | 1.0.0-rc.2 | 3.6K | Contains only the formatter for `en` in this example, have to be shipped separately. |
| make-plural               | 7.4.0      | 16K  | Contains all locales                                                                 |
| @phensley/plurals         | 1.9.0      | 33K  | Contains all locales                                                                 |

> Benchmarks run on
>
> - Node.js v20.9.0
> - Apple M2 CPU
> - October 17, 2024

## Ordinal

```javascript
const input = [`ordinal`, `en`, 2];

// Renders: `two`
```

| Name                        |    ops/sec | MoE     | Runs sampled |
| --------------------------- | ---------: | ------- | ------------ |
| **make-plural**             | 14,325,529 | ± 0.55% | 99           |
| @phensley/plurals           | 13,854,078 | ± 0.62% | 95           |
| @onigoetz/make-plural(memo) | 11,552,355 | ± 0.76% | 95           |
| @onigoetz/intl              |  2,131,691 | ± 0.81% | 94           |
| @onigoetz/make-plural       |     54,598 | ± 2.94% | 98           |


## Choosing a library for your use case

- If you know which languages you need in advance: `@phensley/plurals` and `make-plural` both ship a pre-compiled and pre-optimized set of rules for plurals. They're the fastest options and will be the smallest if your build system can perform Tree Shaking.
- If you do not know the languages in advance.
   - And speed is a concern: `@onigoetz/make-plural` and its memoized alternative `@onigoetz/make-plural(memo)` should do the trick. you will need to ship the pluralization rules one way or another to the function.
   - And speed is not a concern: `@onigoetz/intl` uses `Intl.PluralRules` that ships with most browsers and Node.js runtimes but as you can see it's much slower than other solutions.
