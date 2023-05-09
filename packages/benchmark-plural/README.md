# plural benchmarks

In this benchmark we'll look at two metrics : Library size and speed.

When doing the other benchmark in this repository I saw that what was taking most of the time wasn't the 
parsing or rendering of messageformat but the different formatters and plurals generators.

I was curious about how different they were.

## Libraries size

Sources can be found in `src`, measure taken on 25/06/2020 With latest available versions

| Npm Package                | Version | Size | Comment                                                                              |
| -------------------------- | ------- | ---- | ------------------------------------------------------------------------------------ |
| @onigoetz/intl-formatters  | 0.1.0   | 0.5K | Embeds the formatters in the runtime                                                 |
| @onigoetz/make-plural      | 0.1.0   | 3.5K | Contains only the formatter for `en` in this example, have to be shipped separately. |
| @phensley/plurals          | 1.6.6   | 38K  | Contains all locales                                                                 |
| make-plural                | 7.3.0   | 18K  | Contains all locales                                                                 |

Raw results (09/05/2023)

```
- @phensley/plurals           x 5,595,292 ops/sec ±0.35% (94 runs sampled)
- make-plural                 x 3,734,005 ops/sec ±0.70% (95 runs sampled)
- @onigoetz/make-plural(memo) x 3,157,963 ops/sec ±3.35% (84 runs sampled)
- @onigoetz/intl              x 925,852 ops/sec ±0.58% (93 runs sampled)
- @onigoetz/make-plural       x 28,969 ops/sec ±1.05% (87 runs sampled)
Fastest is @phensley/plurals
```

`@onigoetz/intl` uses `Intl.PluralRules` that ships with most browsers and Node.js runtimes but as you can see it's much slower than other solutions.

`@phensley/plurals` and `make-plural` both ship a pre-compiled and pre-optimized set of rules for plurals
If you can live with the slightly larger build size, both of these are solid options.

`@onigoetz/make-plural` and its memoized version `@onigoetz/make-plural(memo)` are made for the cases when you need to pluralize text but don't know in advance in which languages you'll need to do.
If `Intl.PluralRules` is available and performance isn't too much of a concern go with it, otherwise you can use `@onigoetz/make-plural`
