# plural benchmarks

In this benchmark we'll look at two metrics : Library size and speed.

When doing the other benchmark in this repository I saw that what was taking most of the time wasn't the 
parsing or rendering of messageformat but the different formatters and plurals generators.

I was curious about how different they were.

## Libraries size

Sources can be found in `src`, measure taken on 25/06/2020 With latest available versions

| Npm Package                | Version | Size | Comment                                                                              |
| -------------------------- | ------- | ---- | ------------------------------------------------------------------------------------ |
| @onigoetz/intl-formatters  | 0.1.0   | 0.3K | Embeds the formatters in the runtime                                                 |
| @onigoetz/make-plural      | 0.1.0   | 3.8K | Contains only the formatter for `en` in this example, have to be shipped separately. |
| @phensley/plurals          | 1.2.2   | 37K  | Contains all locales                                                                 |
| make-plural                | 4.3.0   | 23K  | Contains all locales                                                                 |

Raw results (11/12/2020)

```
- @phensley/plurals          x 6,462,507 ops/sec ±1.01% (89 runs sampled)
- make-plural                x 4,378,805 ops/sec ±0.36% (93 runs sampled)
- @phensley/plurals-memo     x 3,997,334 ops/sec ±1.75% (89 runs sampled)
- @onigoetz/make-plural-memo x 3,179,610 ops/sec ±0.81% (93 runs sampled)
- @onigoetz/intl-memo        x 1,120,271 ops/sec ±4.28% (93 runs sampled)
- @onigoetz/make-plural      x 29,593 ops/sec ±0.97% (92 runs sampled)
- @onigoetz/intl             x 28,386 ops/sec ±5.11% (82 runs sampled)
```

As you can see, using a pre-built, pre-optimized runtime gets way better results than generating on-the-fly, however `make-plural`

