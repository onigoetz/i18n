# MessageFormat parse and render benchmark

In this benchmark we'll look at two metrics : Library size and parsing/rendering speed.

Like any synthetic benchmark these should be taken with a pinch of salt.
I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less.

Feel free to make a PR to help make these comparisons as fair as possible.

As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization.

## Libraries size

Sources can be found in `src`, measure taken on 19/07/2026 with latest available versions

| Npm Package                                           | Version    | Size   | Comment     |
| ----------------------------------------------------- | ---------- | ------ | ----------- |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 1.0.0-rc.2 | 8.6K   |             |
| @ffz/icu-msgparser (+ custom renderer)                | 2.0.0      | 9.5K   |             |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 1.0.0-rc.2 | 11.4K  |             |
| format-message-parse                                  | 6.2.4      | 22.6K  | Uses peg.js |
| @onigoetz/messageformat (+ make-plural)               | 1.0.0-rc.2 | 24.7K  |             |
| intl-messageformat                                    | 11.2.11    | 38.9K  | Uses peg.js |
| @onigoetz/messageformat (+ @phensley/plurals)         | 1.0.0-rc.2 | 42.1K  |             |
| @phensley/messageformat                               | 1.14.0     | 56.1K  |             |
| @messageformat/core                                   | 3.4.0      | 76.6K  | Uses peg.js |
| globalize                                             | 1.7.1      | 160.8K | Uses peg.js |

**Notes:**

- `globalize` comes with a bundled version of `messageformat` 0.3.0 and `make-plural` 3.0.0. Also, it requires ICU data to know how to format numbers, currencies, timezones and more. It also comes with a compiler to remove the parts that aren't required, but for my use case I consider that we can't know in advance what is going to be formatted.
- `@ffz/icu-msgparser` is only a parser, I added a renderer to it but did not add any number/date formatter (hence the comparatively small size).
- `@eo-locale/core` was excluded from this list as it crashes on our valid test strings. It would be a strong contender as it has a very small footprint (4.6KB).

## Benchmark

To make the benchmark compareable I tried to apply the same rules to all libraries.
Each libraries must follow the same rules:

- Parse and format a string.
- Properly handles plurals.
- Do not perform any number or date formatting since not all libraries support them and it would give a serious boost to those.
- Give the same output as all other implementations.
- Compiled with the same tools and options.
- Use an identical method signature for all libraries.

The benchmark is applied to 4 different strings, which for the simple cases should be fairly common in applications and more advanced case are probably not as common but should still be performant.

> Benchmarks run on
>
> - Node.js v24.11.1
> - Apple M2 CPU
> - July 19, 2026

## Simple String

```javascript
const input = [`Hello, world!`, {}];

// Renders: `Hello, world!`
```

| Name                                                      |    ops/sec | MoE     | Runs sampled |
| --------------------------------------------------------- | ---------: | ------- | ------------ |
| **@onigoetz/messageformat (+ @onigoetz/make-plural)**     | 17,590,474 | ± 0.66% | 97           |
| **@onigoetz/messageformat (+ @onigoetz/intl-formatters)** | 17,486,794 | ± 0.99% | 99           |
| **@onigoetz/messageformat (+ @phensley/plurals)**         | 17,254,479 | ± 1.64% | 93           |
| @onigoetz/messageformat (+ make-plural)                   | 17,191,342 | ± 1.46% | 90           |
| format-message-parse                                      |  7,954,434 | ± 1.72% | 92           |
| @phensley/messageformat                                   |  7,946,222 | ± 1.66% | 96           |
| @ffz/icu-msgparser (+ custom renderer)                    |  5,901,498 | ± 0.92% | 97           |
| @messageformat/core                                       |  1,781,052 | ± 1.37% | 98           |
| intl-messageformat                                        |    305,089 | ± 2.04% | 88           |
| globalize                                                 |     36,857 | ± 1.69% | 93           |

## With one variable

```javascript
const input = [
  `Hello, {name}!`,
  {
    name: "John",
  },
];

// Renders: `Hello, John!`
```

| Name                                                      |   ops/sec | MoE     | Runs sampled |
| --------------------------------------------------------- | --------: | ------- | ------------ |
| **@onigoetz/messageformat (+ @onigoetz/make-plural)**     | 6,835,933 | ± 0.79% | 94           |
| **@onigoetz/messageformat (+ make-plural)**               | 6,844,375 | ± 0.93% | 99           |
| **@onigoetz/messageformat (+ @phensley/plurals)**         | 6,838,621 | ± 1.05% | 95           |
| **@onigoetz/messageformat (+ @onigoetz/intl-formatters)** | 6,826,379 | ± 1.21% | 95           |
| format-message-parse                                      | 3,919,461 | ± 1.13% | 96           |
| @ffz/icu-msgparser (+ custom renderer)                    | 3,271,084 | ± 0.90% | 93           |
| @phensley/messageformat                                   | 3,064,708 | ± 2.13% | 93           |
| @messageformat/core                                       |   875,587 | ± 1.04% | 94           |
| intl-messageformat                                        |   253,392 | ± 1.30% | 91           |
| globalize                                                 |    36,145 | ± 1.24% | 96           |

## With plurals

```javascript
const input = [
  `Yo, {firstName} {lastName} has {numBooks} {numBooks, plural, one {book} other {books}}.`,
  {
    firstName: "John",
    lastName: "Constantine",
    numBooks: 5,
  },
];

// Renders: `Yo, John Constantine has 5 books.`
```

| Name                                                  | ops/sec | MoE     | Runs sampled |
| ----------------------------------------------------- | ------: | ------- | ------------ |
| **@onigoetz/messageformat (+ make-plural)**           | 955,408 | ± 1.24% | 92           |
| @onigoetz/messageformat (+ @phensley/plurals)         | 939,039 | ± 1.53% | 97           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 789,906 | ± 1.12% | 97           |
| @phensley/messageformat                               | 526,661 | ± 0.52% | 98           |
| @messageformat/core                                   | 183,568 | ± 1.22% | 97           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 144,910 | ± 1.06% | 93           |
| @ffz/icu-msgparser (+ custom renderer)                | 123,744 | ± 0.78% | 97           |
| format-message-parse                                  |  86,564 | ± 1.42% | 91           |
| intl-messageformat                                    |  52,682 | ± 2.13% | 91           |
| globalize                                             |  26,716 | ± 1.74% | 93           |

## With select and plurals

```javascript
const input = [`
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
  `, {
  "gender_of_host": "male",
  "num_guests": 3,
  "host": "Lucifer",
  "guest": "John Constantine"
}];

// Renders: `

		  Lucifer invites John Constantine and 2 other people to his party.

  `
```

| Name                                                  | ops/sec | MoE      | Runs sampled |
| ----------------------------------------------------- | ------: | -------- | ------------ |
| **@onigoetz/messageformat (+ @phensley/plurals)**     | 177,525 | ± 0.96%  | 95           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 171,376 | ± 1.12%  | 93           |
| @onigoetz/messageformat (+ make-plural)               | 162,572 | ± 14.51% | 87           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     |  87,113 | ± 0.60%  | 98           |
| @phensley/messageformat                               |  48,158 | ± 5.95%  | 89           |
| @messageformat/core                                   |  27,419 | ± 1.37%  | 93           |
| @ffz/icu-msgparser (+ custom renderer)                |  24,636 | ± 4.05%  | 82           |
| format-message-parse                                  |  16,321 | ± 2.17%  | 88           |
| intl-messageformat                                    |  13,338 | ± 11.11% | 76           |
| globalize                                             |   6,816 | ± 1.80%  | 91           |
