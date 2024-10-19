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
| **@onigoetz/messageformat (+ @onigoetz/make-plural)** | 19,206,804 | ± 0.10% | 102          |
| @onigoetz/messageformat (+ @phensley/plurals)         | 19,192,893 | ± 0.08% | 99           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 19,095,730 | ± 0.35% | 97           |
| @onigoetz/messageformat (+ make-plural)               | 18,479,888 | ± 0.13% | 102          |
| format-message-parse                                  |  8,778,900 | ± 0.18% | 97           |
| @phensley/messageformat                               |  8,086,805 | ± 0.19% | 99           |
| @ffz/icu-msgparser (+ custom renderer)                |  5,719,901 | ± 0.36% | 101          |
| @messageformat/core                                   |  1,724,418 | ± 0.12% | 95           |
| intl-messageformat                                    |    244,193 | ± 0.54% | 96           |
| globalize                                             |     37,342 | ± 0.31% | 97           |

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

| Name                                                  |   ops/sec | MoE     | Runs sampled |
| ----------------------------------------------------- | --------: | ------- | ------------ |
| **@onigoetz/messageformat (+ make-plural)**           | 7,485,310 | ± 0.28% | 97           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 7,365,456 | ± 0.18% | 100          |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 6,748,444 | ± 0.45% | 97           |
| @onigoetz/messageformat (+ @phensley/plurals)         | 6,450,655 | ± 0.78% | 100          |
| format-message-parse                                  | 3,966,869 | ± 0.26% | 98           |
| @phensley/messageformat                               | 3,368,607 | ± 0.10% | 99           |
| @ffz/icu-msgparser (+ custom renderer)                | 3,346,844 | ± 0.13% | 101          |
| @messageformat/core                                   |   843,570 | ± 0.28% | 101          |
| intl-messageformat                                    |   213,755 | ± 0.63% | 92           |
| globalize                                             |    36,313 | ± 0.16% | 98           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**     | 987,936 | ± 0.16% | 98           |
| @onigoetz/messageformat (+ make-plural)               | 969,817 | ± 0.09% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 816,703 | ± 0.20% | 99           |
| @phensley/messageformat                               | 547,295 | ± 0.09% | 98           |
| @messageformat/core                                   | 185,577 | ± 0.11% | 94           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 154,576 | ± 0.06% | 101          |
| @ffz/icu-msgparser (+ custom renderer)                | 130,402 | ± 0.16% | 100          |
| format-message-parse                                  |  82,462 | ± 0.18% | 98           |
| intl-messageformat                                    |  48,205 | ± 2.25% | 88           |
| globalize                                             |  26,975 | ± 0.22% | 97           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**     | 181,594 | ± 0.09%  | 97           |
| @onigoetz/messageformat (+ make-plural)               | 180,194 | ± 0.09%  | 102          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 173,668 | ± 0.46%  | 97           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     |  90,012 | ± 0.65%  | 99           |
| @phensley/messageformat                               |  43,007 | ± 16.74% | 82           |
| @messageformat/core                                   |  31,066 | ± 0.07%  | 97           |
| @ffz/icu-msgparser (+ custom renderer)                |  28,826 | ± 1.91%  | 94           |
| intl-messageformat                                    |  17,029 | ± 0.86%  | 93           |
| format-message-parse                                  |  17,317 | ± 2.62%  | 95           |
| globalize                                             |   8,653 | ± 1.83%  | 97           |
