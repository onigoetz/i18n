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
| @onigoetz/messageformat            | 0.1.0   | 8.4K   |             |
| @ffz/icu-msgparser                 | 1.0.2   | 9.38K  |             |
| @onigoetz/messageformat (memoized) | 0.1.0   | 10.15K |             |
| format-message-parse               | 6.2.3   | 20.64K | Uses peg.js |
| intl-messageformat                 | 9.3.12  | 36.35K | Uses peg.js |
| @phensley/messageformat            | 1.2.2   | 38.86K |             |
| messageformat                      | 2.3.0   | 48.93K | Uses peg.js |

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

- @onigoetz/messageformat x 4,885,039 ops/sec ±0.59% (89 runs sampled)
- @phensley/messageformat x 4,660,653 ops/sec ±0.29% (94 runs sampled)
- format-message-parse x 3,927,048 ops/sec ±0.44% (94 runs sampled)
- @ffz/icu-msgparser x 2,521,413 ops/sec ±0.65% (90 runs sampled)
- intl-messageformat x 219,748 ops/sec ±0.98% (91 runs sampled)
- messageformat x 201,673 ops/sec ±0.81% (91 runs sampled)

### Message with one variable

```javascript
const message = `Hello, {name}!`;
const variables = { name: "John" };

// Renders : Hello, John!
```

- @phensley/messageformat x 2,001,930 ops/sec ±0.53% (95 runs sampled)
- format-message-parse x 2,014,542 ops/sec ±0.33% (94 runs sampled)
- @onigoetz/messageformat x 1,566,114 ops/sec ±0.65% (96 runs sampled)
- @ffz/icu-msgparser x 1,474,988 ops/sec ±0.38% (98 runs sampled)
- messageformat x 188,468 ops/sec ±0.46% (94 runs sampled)
- intl-messageformat x 164,315 ops/sec ±1.15% (90 runs sampled)

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

- @phensley/messageformat x 342,004 ops/sec ±9.55% (95 runs sampled)
- @ffz/icu-msgparser x 28,776 ops/sec ±1.58% (96 runs sampled)
- @onigoetz/messageformat x 27,322 ops/sec ±1.45% (91 runs sampled)
- format-message-parse x 18,569 ops/sec ±2.19% (90 runs sampled)
- intl-messageformat x 10,473 ops/sec ±3.85% (87 runs sampled)
- messageformat x 15,739 ops/sec ±1.57% (90 runs sampled)

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

- @onigoetz/messageformat x 61,555 ops/sec ±1.86% (94 runs sampled)
- @phensley/messageformat x 36,332 ops/sec ±0.43% (93 runs sampled)
- @ffz/icu-msgparser x 32,669 ops/sec ±0.48% (94 runs sampled)
- format-message-parse x 8,308 ops/sec ±2.54% (91 runs sampled)
- intl-messageformat x 4,563 ops/sec ±2.81% (94 runs sampled)
- messageformat x 6,760 ops/sec ±0.71% (93 runs sampled)
