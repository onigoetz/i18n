# MessageFormat parse and render benchmark

In this benchmark we'll look at two metrics : Library size and parsing/rendering speed.

Like any synthetic benchmark these should be taken with a pinch of salt.
I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less.

Feel free to make a PR to help make these comparisons as fair as possible.

As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization.

## Libraries size

Sources can be found in `src`, measure taken on 07/12/2023 with latest available versions

| Npm Package                                           | Version | Size | Comment     |
| ----------------------------------------------------- | ------- | ---- | ----------- |
| @ffz/icu-msgparser (+ custom renderer)                | 2.0.0   | 10K  |             |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 0.1.0   | 11K  |             |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 0.1.0   | 13K  |             |
| format-message-parse                                  | 6.2.4   | 22K  | Uses peg.js |
| @onigoetz/messageformat (+ make-plural)               | 0.1.0   | 28K  |             |
| @onigoetz/messageformat (+ @phensley/plurals)         | 0.1.0   | 45K  |             |
| intl-messageformat                                    | 10.5.8  | 58K  | Uses peg.js |
| @phensley/messageformat                               | 1.8.0   | 62K  |             |
| @messageformat/core                                   | 3.3.0   | 74K  | Uses peg.js |
| globalize                                             | 1.7.0   | 157K | Uses peg.js |

**Notes:**

- `globalize` comes with a bundled version of `messageformat` 0.3.0 and `make-plural` 3.0.0. Also, it requires ICU data to know how to format numbers, currencies, timezones and more. It also comes with a compiler to remove the parts that aren't required, but for my use case I consider that we can't know in advance what is going to be formatted.
- `@ffz/icu-msgparser` is only a parser, I added a renderer to it but did not add any number/date formatter (hence the comparatively small size).
- `@eo-locale/core` was excluded from this list as it crashes on our valid test strings. It would be a strong contender as it has a very small footprint (6.7KB).

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
> - December 7, 2023

## Simple String

```javascript
const input = [`Hello, world!`, {}];

// Renders: `Hello, world!`
```

| Name                                                  |   ops/sec | MoE     | Runs sampled |
| ----------------------------------------------------- | --------: | ------- | ------------ |
| **@onigoetz/messageformat (+ @onigoetz/make-plural)** | 9,509,221 | ± 0.06% | 101          |
| @onigoetz/messageformat (+ @phensley/plurals)         | 9,495,148 | ± 0.08% | 98           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 9,391,095 | ± 0.15% | 95           |
| @onigoetz/messageformat (+ make-plural)               | 8,313,129 | ± 0.16% | 101          |
| format-message-parse                                  | 7,876,460 | ± 0.16% | 100          |
| @ffz/icu-msgparser (+ custom renderer)                | 5,778,380 | ± 0.06% | 101          |
| @phensley/messageformat                               | 5,507,993 | ± 0.20% | 99           |
| @messageformat/core                                   | 1,198,320 | ± 0.22% | 98           |
| intl-messageformat                                    |   226,912 | ± 0.92% | 88           |
| globalize                                             |    37,695 | ± 0.29% | 93           |

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
| **@onigoetz/messageformat (+ @onigoetz/intl-formatters)** | 4,418,002 | ± 0.09% | 99           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)         | 4,353,950 | ± 0.19% | 101          |
| @onigoetz/messageformat (+ @phensley/plurals)             | 4,343,249 | ± 0.18% | 100          |
| @onigoetz/messageformat (+ make-plural)                   | 4,242,189 | ± 0.07% | 102          |
| format-message-parse                                      | 3,423,637 | ± 0.16% | 100          |
| @ffz/icu-msgparser (+ custom renderer)                    | 3,365,181 | ± 0.20% | 102          |
| @phensley/messageformat                                   | 2,819,977 | ± 0.08% | 100          |
| @messageformat/core                                       |   713,582 | ± 0.20% | 98           |
| intl-messageformat                                        |   199,774 | ± 1.12% | 92           |
| globalize                                                 |    36,924 | ± 0.13% | 98           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**     | 611,423 | ± 0.06% | 98           |
| **@onigoetz/messageformat (+ make-plural)**           | 611,052 | ± 0.12% | 97           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) | 551,116 | ± 0.08% | 96           |
| @phensley/messageformat                               | 519,670 | ± 0.15% | 97           |
| @messageformat/core                                   | 170,824 | ± 0.13% | 95           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     | 140,027 | ± 0.20% | 101          |
| @ffz/icu-msgparser (+ custom renderer)                | 129,570 | ± 0.10% | 96           |
| format-message-parse                                  |  81,600 | ± 0.19% | 97           |
| intl-messageformat                                    |  46,911 | ± 1.88% | 92           |
| globalize                                             |  27,326 | ± 0.20% | 96           |

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
| **@onigoetz/messageformat (+ @phensley/plurals)**     |  94,310 | ± 0.06% | 98           |
| @onigoetz/messageformat (+ make-plural)               |  94,325 | ± 0.20% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) |  92,259 | ± 0.10% | 101          |
| @onigoetz/messageformat (+ @onigoetz/make-plural)     |  61,412 | ± 0.32% | 100          |
| @phensley/messageformat                               |  52,901 | ± 0.06% | 98           |
| @messageformat/core                                   |  30,031 | ± 0.08% | 98           |
| @ffz/icu-msgparser (+ custom renderer)                |  29,234 | ± 0.73% | 98           |
| format-message-parse                                  |  17,066 | ± 2.83% | 93           |
| intl-messageformat                                    |  16,619 | ± 0.93% | 94           |
| globalize                                             |   8,723 | ± 0.90% | 99           |
