# MessageFormat parse and render benchmark

In this benchmark we'll look at two metrics : Library size and parsing/rendering speed.

Like any synthetic benchmark these should be taken with a pinch of salt.
I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less.

Feel free to make a PR to help make these comparisons as fair as possible.

As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization.

## Libraries size

Sources can be found in `src`, measure taken on 07/12/2023 with latest available versions

| Npm Package                                           | Version    | Size | Comment     |
| ----------------------------------------------------- | ---------- | ---- | ----------- |
| @ffz/icu-msgparser (+ custom renderer)                | 2.0.0      | 9.4K |             |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 1.0.0-rc.2 | 7.9K |             |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 1.0.0-rc.2 | 11K  |             |
| format-message-parse                                  | 6.2.4      | 22K  | Uses peg.js |
| @onigoetz/messageformat (+ make-plural)               | 1.0.0-rc.2 | 23K  |             |
| @onigoetz/messageformat (+ @phensley/plurals)         | 1.0.0-rc.2 | 40K  |             |
| intl-messageformat                                    | 10.5.14    | 55K  | Uses peg.js |
| @phensley/messageformat                               | 1.9.0      | 54K  |             |
| @messageformat/core                                   | 3.4.0      | 74K  | Uses peg.js |
| globalize                                             | 1.7.0      | 158K | Uses peg.js |

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
> - Node.js v20.9.0
> - Apple M2 CPU
> - October 17, 2024

## Simple String

```javascript
const input = [`Hello, world!`, {}];

// Renders: `Hello, world!`
```

| Name                                                  |   ops/sec | MoE     | Runs sampled |
| ----------------------------------------------------- | --------: | ------- | ------------ |
| **format-message-parse**                              | 8,586,016 | ± 0.16% | 97           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 8,321,701 | ± 0.78% | 95           |
| @phensley/messageformat                               | 7,906,469 | ± 0.25% | 98           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 8,041,469 | ± 2.71% | 90           |
| @onigoetz/messageformat (+ @phensley/plurals)         | 8,137,500 | ± 5.18% | 97           |
| @onigoetz/messageformat (+ make-plural)               | 7,854,733 | ± 1.93% | 97           |
| @ffz/icu-msgparser (+ custom renderer)                | 5,668,605 | ± 0.34% | 97           |
| @messageformat/core                                   | 1,684,757 | ± 0.25% | 99           |
| intl-messageformat                                    |   235,223 | ± 0.63% | 93           |
| globalize                                             |    36,694 | ± 0.81% | 98           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**         | 4,339,447 | ± 0.72% | 92           |
| **@onigoetz/messageformat (+ @onigoetz/intl-formatters)** | 4,307,751 | ± 1.23% | 96           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)         | 4,277,114 | ± 0.64% | 100          |
| @onigoetz/messageformat (+ make-plural)                   | 4,258,599 | ± 0.54% | 99           |
| format-message-parse                                      | 3,828,913 | ± 1.50% | 98           |
| @ffz/icu-msgparser (+ custom renderer)                    | 3,265,017 | ± 0.34% | 101          |
| @phensley/messageformat                                   | 3,182,662 | ± 0.75% | 99           |
| @messageformat/core                                       |   845,946 | ± 0.17% | 100          |
| intl-messageformat                                        |   206,447 | ± 1.45% | 95           |
| globalize                                                 |    36,014 | ± 0.23% | 95           |

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
| **@onigoetz/messageformat (+ make-plural)**           | 618,628 | ± 0.20% | 100          |
| @onigoetz/messageformat (+ @phensley/plurals)         | 614,416 | ± 0.56% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 546,253 | ± 0.88% | 99           |
| @phensley/messageformat                               | 540,674 | ± 0.22% | 98           |
| @messageformat/core                                   | 180,091 | ± 1.23% | 98           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 139,554 | ± 0.62% | 96           |
| @ffz/icu-msgparser (+ custom renderer)                | 127,049 | ± 0.83% | 99           |
| format-message-parse                                  |  81,202 | ± 0.25% | 98           |
| intl-messageformat                                    |  47,462 | ± 2.53% | 89           |
| globalize                                             |  26,501 | ± 1.10% | 97           |

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

| Name                                                  | ops/sec | MoE     | Runs sampled |
| ----------------------------------------------------- | ------: | ------- | ------------ |
| **@onigoetz/messageformat (+ @phensley/plurals)**     |  96,722 | ± 0.80% | 93           |
| @onigoetz/messageformat (+ make-plural)               |  95,344 | ± 2.71% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) |  92,448 | ± 1.42% | 93           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     |  62,556 | ± 0.74% | 96           |
| @phensley/messageformat                               |  52,335 | ± 0.63% | 102          |
| @messageformat/core                                   |  30,852 | ± 0.13% | 97           |
| @ffz/icu-msgparser (+ custom renderer)                |  29,109 | ± 0.80% | 95           |
| intl-messageformat                                    |  16,495 | ± 1.59% | 95           |
| format-message-parse                                  |  16,293 | ± 3.06% | 93           |
| globalize                                             |   8,606 | ± 0.15% | 99           |
