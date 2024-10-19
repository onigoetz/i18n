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
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 1.0.0-rc.2 | 8K   |             |
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
> - October 19, 2024

## Simple String

```javascript
const input = [`Hello, world!`, {}];

// Renders: `Hello, world!`
```

| Name                                                  |    ops/sec | MoE     | Runs sampled |
| ----------------------------------------------------- | ---------: | ------- | ------------ |
| **@onigoetz/messageformat (+ @onigoetz/make-plural)** | 18,624,709 | ± 0.64% | 93           |
| @onigoetz/messageformat (+ @phensley/plurals)         | 18,440,109 | ± 1.91% | 97           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 18,181,841 | ± 1.13% | 92           |
| @onigoetz/messageformat (+ make-plural)               | 17,425,302 | ± 3.11% | 91           |
| format-message-parse                                  |  8,697,924 | ± 0.26% | 100          |
| @phensley/messageformat                               |  7,948,798 | ± 0.35% | 100          |
| @ffz/icu-msgparser (+ custom renderer)                |  5,693,123 | ± 0.28% | 97           |
| @messageformat/core                                   |  1,635,413 | ± 2.11% | 96           |
| intl-messageformat                                    |    189,554 | ± 9.22% | 79           |
| globalize                                             |     34,190 | ± 5.54% | 93           |

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
| **@onigoetz/messageformat (+ @onigoetz/intl-formatters)** | 7,561,041 | ± 0.19% | 93           |
| @onigoetz/messageformat (+ make-plural)                   | 7,431,574 | ± 0.14% | 100          |
| @onigoetz/messageformat (+ @onigoetz/make-plural)         | 7,349,978 | ± 0.37% | 98           |
| @onigoetz/messageformat (+ @phensley/plurals)             | 6,904,747 | ± 0.51% | 97           |
| format-message-parse                                      | 4,019,700 | ± 0.21% | 100          |
| @ffz/icu-msgparser (+ custom renderer)                    | 3,378,807 | ± 0.27% | 97           |
| @phensley/messageformat                                   | 3,359,162 | ± 0.16% | 99           |
| @messageformat/core                                       |   853,873 | ± 1.96% | 89           |
| intl-messageformat                                        |   217,803 | ± 0.61% | 96           |
| globalize                                                 |    36,601 | ± 0.17% | 98           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**     | 982,506 | ± 0.19% | 99           |
| @onigoetz/messageformat (+ make-plural)               | 960,514 | ± 0.14% | 95           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 806,120 | ± 0.08% | 101          |
| @phensley/messageformat                               | 547,569 | ± 0.35% | 100          |
| @messageformat/core                                   | 183,629 | ± 0.18% | 94           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 154,218 | ± 0.07% | 100          |
| @ffz/icu-msgparser (+ custom renderer)                | 129,434 | ± 0.08% | 97           |
| format-message-parse                                  |  82,619 | ± 0.16% | 99           |
| intl-messageformat                                    |  48,941 | ± 2.50% | 91           |
| globalize                                             |  27,024 | ± 0.30% | 95           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**     | 180,818 | ± 0.33% | 100          |
| @onigoetz/messageformat (+ make-plural)               | 178,976 | ± 0.22% | 99           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 172,978 | ± 0.25% | 97           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     |  89,534 | ± 0.15% | 99           |
| @phensley/messageformat                               |  53,231 | ± 0.07% | 101          |
| @messageformat/core                                   |  30,664 | ± 0.20% | 96           |
| @ffz/icu-msgparser (+ custom renderer)                |  29,430 | ± 1.11% | 95           |
| intl-messageformat                                    |  17,116 | ± 1.02% | 95           |
| format-message-parse                                  |  17,090 | ± 2.95% | 95           |
| globalize                                             |   8,766 | ± 0.08% | 100          |
