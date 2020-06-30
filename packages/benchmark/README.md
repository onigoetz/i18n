# MessageFormat parse and render benchmark

In this benchmark we'll look at two metrics : Library size and parsing/rendering speed.

Like any synthetic benchmark these should be taken with a pinch of salt.
I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less.

Feel free to make a PR to help make these comparisons as fair as possible.

As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization.

## Libraries size

Sources can be found in `src`, measure taken on 25/06/2020 With latest available versions

| Npm Package             | Version | Size   | Size w/o formatters | Comment                                                 |
| ----------------------- | ------- | ------ | ------------------- | ------------------------------------------------------- |
| @eo-locale/core         | 1.3.9   | 4.17K  | 4.17K               | Can't parse the test messages, excluded from benchmark. |
| @onigoetz/messageformat | 0.1.0   | 6.78K  | 3.79K               |                                                         |
| @ffz/icu-msgparser      | 1.0.2   | 8.79K  | 6.5K                |                                                         |
| format-message-parse    | 6.2.3   | 20.02K | 7.67K               | Uses peg.js                                             |
| intl-messageformat      | 8.3.26  | 30.43K | 23.03K              | Uses peg.js                                             |
| @phensley/messageformat | 1.2.1   | 36.74K | 6.52K               |                                                         |
| messageformat           | 2.3.0   | 48.13K | -                   | Uses peg.js                                             |

In the case of `@ffz/icu-msgparser`. The source largely inspired `@onigoetz/messageformat` and
since it provided no renderer by default, I put an early version of `@onigoetz/messageformat`'s renderer.

The Size w/o formatters column counts only the parser and renderer, without any plural generator or date/number formatter
I added this number as a comparison if you want to use `@onigoetz/messageformat` only for variable subsitution.
Or if in your application you already have formatters for dates/numbers and plurals or just want to use the `Intl` implementation those come at virtually no cost.

## Benchmark

Since each application has different translation needs, I tried to make a somewhat representative representation of what translation strings look like.
From the simple string to the complex nested plural in a select, there are four different tests.

### String

```javascript
const message = `Hello, world!`;
const variables = {};

// Renders : Hello, world!
```

- @onigoetz/messageformat x 4,774,848 ops/sec ±0.89% (95 runs sampled)
- @phensley/messageformat x 4,627,431 ops/sec ±0.98% (94 runs sampled)
- format-message-parse x 3,260,997 ops/sec ±1.02% (93 runs sampled)
- @ffz/icu-msgparser x 1,713,669 ops/sec ±0.51% (92 runs sampled)
- intl-messageformat x 242,485 ops/sec ±0.84% (96 runs sampled)
- messageformat x 179,338 ops/sec ±0.83% (95 runs sampled)

### Message with one variable

```javascript
const message = `Hello, {name}!`;
const variables = { name: "John" };

// Renders : Hello, John!
```

- @phensley/messageformat x 1,974,226 ops/sec ±0.43% (92 runs sampled)
- format-message-parse x 1,755,942 ops/sec ±0.40% (91 runs sampled)
- @onigoetz/messageformat x 1,336,063 ops/sec ±0.64% (95 runs sampled)
- @ffz/icu-msgparser x 1,130,630 ops/sec ±0.63% (93 runs sampled)
- intl-messageformat x 192,164 ops/sec ±0.91% (91 runs sampled)
- messageformat x 176,353 ops/sec ±0.51% (94 runs sampled)

### Let's get more creative

```javascript
const message = `Yo, {firstName} {lastName} has {numBooks, number, integer} {numBooks, plural, one {book} other {books}}.`;
const variables = {
  firstName: "John",
  lastName: "Constantine",
  numBooks: 5
};

// Renders:  Yo, John Constantine has 5 books.
```

- @phensley/messageformat x 339,807 ops/sec ±0.54% (97 runs sampled)
- @onigoetz/messageformat x 219,020 ops/sec ±0.56% (98 runs sampled)
- @ffz/icu-msgparser x 31,838 ops/sec ±1.73% (93 runs sampled)
- format-message-parse x 19,524 ops/sec ±6.78% (88 runs sampled)
- intl-messageformat x 11,761 ops/sec ±3.13% (89 runs sampled)
- messageformat x 16,437 ops/sec ±3.16% (92 runs sampled)

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
  guest: "John Constantine"
};

// Renders : Lucifer invites John Constantine and 2 other people to his party.
```

- @onigoetz/messageformat x 47,196 ops/sec ±0.72% (93 runs sampled)
- @phensley/messageformat x 35,166 ops/sec ±0.45% (93 runs sampled)
- @ffz/icu-msgparser x 26,775 ops/sec ±2.18% (96 runs sampled)
- format-message-parse x 9,455 ops/sec ±3.99% (89 runs sampled)
- intl-messageformat x 4,038 ops/sec ±11.59% (85 runs sampled)
- messageformat x 6,053 ops/sec ±0.95% (93 runs sampled)
