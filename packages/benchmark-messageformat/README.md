# MessageFormat parse and render benchmark

In this benchmark we'll look at two metrics : Library size and parsing/rendering speed.

Like any synthetic benchmark these should be taken with a pinch of salt.
I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less.

Feel free to make a PR to help make these comparisons as fair as possible.

As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization.

## Libraries size

Sources can be found in `src`, measure taken on 25/06/2020 With latest available versions

| Npm Package                        | Version | Size   | Comment     |
| ---------------------------------- | ------- | ------ | ----------- |
| @onigoetz/messageformat            | 0.1.0   | 13.34K |             |
| @ffz/icu-msgparser                 | 2.0.0   | 14.93K |             |
| @onigoetz/messageformat (memoized) | 0.1.0   | 15.62K |             |
| format-message-parse               | 6.2.3   | 27.54K | Uses peg.js |
| intl-messageformat                 | 9.8.2   | 47.22K | Uses peg.js |
| @phensley/messageformat            | 1.2.6   | 47.03K |             |
| messageformat                      | 2.3.0   | 48.89K | Uses peg.js |

In the case of `@ffz/icu-msgparser`. The source largely inspired `@onigoetz/messageformat` and
since it provided no renderer by default, I put an early version of `@onigoetz/messageformat`'s renderer.

The Size w/o formatters column counts only the parser and renderer, without any plural generator or date/number formatter
I added this number as a comparison if you want to use `@onigoetz/messageformat` only for variable subsitution.
Or if in your application you already have formatters for dates/numbers and plurals or just want to use the `Intl` implementation those come at virtually no cost.

> Special mention for `@eo-locale/core` Which provides a very small package,
> however it provides no package that runs on Node.js 10 and crashes on our test strings.

## Benchmark

Since each application has different translation needs, I tried to make a somewhat representative representation of what translation strings look like.
From the simple string to the complex nested plural in a select, there are four different tests.

### String

```javascript
const message = `Hello, world!`;
const variables = {};

// Renders : Hello, world!
```

- @onigoetz/messageformat x 4,608,460 ops/sec ±1.50% (92 runs sampled)
- @onigoetz/messageformat (memoized) x 4,536,394 ops/sec ±1.67% (85 runs sampled)
- @phensley/messageformat x 4,529,047 ops/sec ±0.72% (88 runs sampled)
- format-message-parse x 3,992,051 ops/sec ±0.23% (96 runs sampled)
- @ffz/icu-msgparser x 1,583,621 ops/sec ±0.46% (95 runs sampled)
- intl-messageformat x 454,716 ops/sec ±1.04% (85 runs sampled)
- messageformat x 185,259 ops/sec ±0.36% (90 runs sampled)

### Message with one variable

```javascript
const message = `Hello, {name}!`;
const variables = { name: "John" };

// Renders : Hello, John!
```

- format-message-parse x 1,941,376 ops/sec ±0.82% (95 runs sampled)
- @phensley/messageformat x 1,872,103 ops/sec ±0.49% (93 runs sampled)
- @onigoetz/messageformat (memoized) x 1,462,301 ops/sec ±0.86% (95 runs sampled)
- @onigoetz/messageformat x 1,379,505 ops/sec ±0.47% (95 runs sampled)
- @ffz/icu-msgparser x 1,009,608 ops/sec ±1.03% (95 runs sampled)
- intl-messageformat x 300,560 ops/sec ±1.85% (83 runs sampled)
- messageformat x 163,636 ops/sec ±1.40% (93 runs sampled)

### Let's get more creative

```javascript
const message = `Yo, {firstName} {lastName} has {numBooks, number, integer} {numBooks, plural, one {book} other {books}}.`;
const variables = {
  firstName: "John",
  lastName: "Constantine",
  numBooks: 5,
};

// Renders:  Yo, John Constantine has 5 books.
```

- @phensley/messageformat x 339,274 ops/sec ±0.54% (94 runs sampled)
- @ffz/icu-msgparser x 27,082 ops/sec ±1.78% (93 runs sampled)
- @onigoetz/messageformat x 17,177 ops/sec ±3.25% (87 runs sampled)
- format-message-parse x 16,956 ops/sec ±2.98% (90 runs sampled)
- messageformat x 14,239 ops/sec ±3.57% (88 runs sampled)
- intl-messageformat x 11,730 ops/sec ±4.34% (86 runs sampled)
- @onigoetz/messageformat (memoized) x 4,702 ops/sec ±16.39% (29 runs sampled)

### Overly complex message

```javascript
const message = `
{gender_of_host, select,
    female {
        {num_guests, plural, offset:1
            =0 {{host} does not give a party.}
            =1 {{host} invites {guest} to her party.}
            =2 {{host} invites {guest} and one other person to her party.}
            other {{host} invites {guest} and # other people to her party.}
        }
    }
    male {
        {num_guests, plural, offset:1
            =0 {{host} does not give a party.}
            =1 {{host} invites {guest} to his party.}
            =2 {{host} invites {guest} and one other person to his party.}
            other {{host} invites {guest} and # other people to his party.}
        }
    }
    other {
        {num_guests, plural, offset:1
            =0 {{host} does not give a party.}
            =1 {{host} invites {guest} to their party.}
            =2 {{host} invites {guest} and one other person to their party.}
            other {{host} invites {guest} and # other people to their party.}
        }
    }
}
`;
const variables = {
  gender_of_host: "male",
  num_guests: 3,
  host: "Lucifer",
  guest: "John Constantine",
};

// Renders : Lucifer invites John Constantine and 2 other people to his party.
```

- @onigoetz/messageformat (memoized) x 58,697 ops/sec ±2.56% (90 runs sampled)
- @onigoetz/messageformat x 33,817 ops/sec ±0.80% (94 runs sampled)
- @phensley/messageformat x 35,552 ops/sec ±0.27% (98 runs sampled)
- @ffz/icu-msgparser x 14,154 ops/sec ±1.00% (96 runs sampled)
- format-message-parse x 7,711 ops/sec ±4.12% (93 runs sampled)
- intl-messageformat x 7,040 ops/sec ±4.26% (83 runs sampled)
- messageformat x 6,428 ops/sec ±0.20% (97 runs sampled)
