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
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 1.0.0-rc.2 | 8.1K |             |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 1.0.0-rc.2 | 11K  |             |
| format-message-parse                                  | 6.2.4      | 22K  | Uses peg.js |
| @onigoetz/messageformat (+ make-plural)               | 1.0.0-rc.2 | 23K  |             |
| @onigoetz/messageformat (+ @phensley/plurals)         | 1.0.0-rc.2 | 41K  |             |
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
> - October 18, 2024

## Simple String

```javascript
const input = [`Hello, world!`, {}];

// Renders: `Hello, world!`
```

| Name                                                  |   ops/sec | MoE     | Runs sampled |
| ----------------------------------------------------- | --------: | ------- | ------------ |
| **format-message-parse**                              | 8,895,545 | ± 0.23% | 94           |
| @onigoetz/messageformat (+ @phensley/plurals)         | 8,596,907 | ± 0.16% | 99           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 8,583,838 | ± 0.14% | 101          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 8,396,261 | ± 2.03% | 94           |
| @onigoetz/messageformat (+ make-plural)               | 8,222,727 | ± 1.48% | 97           |
| @phensley/messageformat                               | 8,079,695 | ± 0.22% | 99           |
| @ffz/icu-msgparser (+ custom renderer)                | 5,662,192 | ± 0.16% | 97           |
| @messageformat/core                                   | 1,715,496 | ± 0.13% | 97           |
| intl-messageformat                                    |   240,408 | ± 0.63% | 93           |
| globalize                                             |    37,391 | ± 0.31% | 96           |

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
| **@onigoetz/messageformat (+ @onigoetz/intl-formatters)** | 6,414,862 | ± 0.11% | 98           |
| @onigoetz/messageformat (+ make-plural)                   | 6,380,084 | ± 0.31% | 98           |
| @onigoetz/messageformat (+ @phensley/plurals)             | 6,233,602 | ± 0.22% | 98           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)         | 6,228,841 | ± 0.20% | 100          |
| format-message-parse                                      | 3,978,459 | ± 0.19% | 99           |
| @phensley/messageformat                                   | 3,399,981 | ± 0.13% | 99           |
| @ffz/icu-msgparser (+ custom renderer)                    | 3,361,547 | ± 0.27% | 100          |
| @messageformat/core                                       |   880,358 | ± 0.26% | 100          |
| intl-messageformat                                        |   216,110 | ± 0.54% | 95           |
| globalize                                                 |    36,506 | ± 0.32% | 97           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**     | 940,533 | ± 0.19% | 98           |
| @onigoetz/messageformat (+ make-plural)               | 919,852 | ± 0.14% | 98           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 772,695 | ± 0.25% | 98           |
| @phensley/messageformat                               | 551,128 | ± 0.13% | 96           |
| @messageformat/core                                   | 185,781 | ± 0.11% | 98           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 152,541 | ± 0.10% | 100          |
| @ffz/icu-msgparser (+ custom renderer)                | 130,129 | ± 0.10% | 97           |
| format-message-parse                                  |  81,703 | ± 0.28% | 97           |
| intl-messageformat                                    |  48,687 | ± 2.22% | 92           |
| globalize                                             |  27,151 | ± 0.17% | 97           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**     | 140,415 | ± 0.07%  | 99           |
| @onigoetz/messageformat (+ make-plural)               | 136,452 | ± 0.11%  | 98           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 135,955 | ± 0.11%  | 99           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     |  79,580 | ± 0.07%  | 98           |
| @phensley/messageformat                               |  53,396 | ± 0.16%  | 101          |
| @ffz/icu-msgparser (+ custom renderer)                |  29,484 | ± 0.72%  | 95           |
| @messageformat/core                                   |  29,510 | ± 0.93%  | 95           |
| intl-messageformat                                    |  15,706 | ± 1.99%  | 89           |
| format-message-parse                                  |  15,356 | ± 12.31% | 85           |
| globalize                                             |   8,250 | ± 1.98%  | 91           |
