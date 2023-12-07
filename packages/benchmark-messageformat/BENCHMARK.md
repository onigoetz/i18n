> Benchmarks run on
>
> - Node.js v20.9.0
> - Apple M2 CPU
> - November 30, 2023

## Simple String

```javascript
const input = [`Hello, world!`, {}];

// Renders: `Hello, world!`
```

| Name                                                          |   ops/sec | MoE     | Runs sampled |
| ------------------------------------------------------------- | --------: | ------- | ------------ |
| **@onigoetz/messageformat (+ @phensley/plurals) flat**        | 9,503,245 | ± 0.08% | 98           |
| @onigoetz/messageformat (+ make-plural) flat                  | 9,377,270 | ± 0.29% | 94           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) initial | 8,515,639 | ± 0.28% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) tree    | 8,486,898 | ± 0.06% | 101          |
| @onigoetz/messageformat (+ @onigoetz/make-plural) initial     | 8,483,479 | ± 0.37% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) flat    | 8,150,771 | ± 0.32% | 101          |
| format-message-parse                                          | 7,863,913 | ± 0.21% | 99           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)             | 7,394,770 | ± 0.13% | 99           |
| @onigoetz/messageformat (+ @phensley/plurals)                 | 7,394,738 | ± 0.27% | 101          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters)         | 6,723,058 | ± 0.06% | 101          |
| @ffz/icu-msgparser (+ custom renderer)                        | 5,784,724 | ± 0.16% | 99           |
| @phensley/messageformat                                       | 5,670,504 | ± 0.25% | 101          |
| @messageformat/core                                           | 1,210,809 | ± 0.09% | 98           |
| intl-messageformat                                            |   224,386 | ± 1.37% | 87           |
| globalize                                                     |    37,425 | ± 0.34% | 96           |

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

| Name                                                          |   ops/sec | MoE     | Runs sampled |
| ------------------------------------------------------------- | --------: | ------- | ------------ |
| **@onigoetz/messageformat (+ @phensley/plurals) flat**        | 4,358,399 | ± 0.08% | 101          |
| @onigoetz/messageformat (+ make-plural) flat                  | 4,349,667 | ± 0.10% | 102          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) flat    | 4,194,955 | ± 0.18% | 100          |
| format-message-parse                                          | 3,751,998 | ± 0.10% | 101          |
| @ffz/icu-msgparser (+ custom renderer)                        | 3,330,476 | ± 0.17% | 100          |
| @onigoetz/messageformat (+ @onigoetz/make-plural)             | 3,153,342 | ± 0.10% | 98           |
| @onigoetz/messageformat (+ @phensley/plurals)                 | 3,152,152 | ± 0.14% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters)         | 3,048,466 | ± 0.09% | 97           |
| @phensley/messageformat                                       | 2,813,988 | ± 0.24% | 97           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) tree    | 2,360,004 | ± 0.18% | 101          |
| @onigoetz/messageformat (+ @onigoetz/make-plural) initial     | 2,356,194 | ± 0.11% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) initial | 2,327,448 | ± 0.26% | 98           |
| @messageformat/core                                           |   719,582 | ± 0.34% | 101          |
| intl-messageformat                                            |   200,393 | ± 1.25% | 90           |
| globalize                                                     |    36,693 | ± 0.26% | 99           |

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

| Name                                                          | ops/sec | MoE     | Runs sampled |
| ------------------------------------------------------------- | ------: | ------- | ------------ |
| **@onigoetz/messageformat (+ make-plural) flat**              | 611,965 | ± 0.32% | 99           |
| @onigoetz/messageformat (+ @phensley/plurals) flat            | 597,195 | ± 0.32% | 88           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) flat    | 540,343 | ± 0.06% | 99           |
| @phensley/messageformat                                       | 520,533 | ± 0.37% | 96           |
| @onigoetz/messageformat (+ @phensley/plurals)                 | 468,277 | ± 0.15% | 97           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters)         | 429,185 | ± 0.23% | 102          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) initial | 401,907 | ± 0.32% | 100          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) tree    | 398,929 | ± 0.25% | 99           |
| @messageformat/core                                           | 172,258 | ± 0.07% | 101          |
| @ffz/icu-msgparser (+ custom renderer)                        | 129,557 | ± 0.06% | 101          |
| @onigoetz/messageformat (+ @onigoetz/make-plural)             | 129,797 | ± 0.28% | 101          |
| @onigoetz/messageformat (+ @onigoetz/make-plural) initial     | 126,746 | ± 0.28% | 100          |
| format-message-parse                                          |  81,703 | ± 0.21% | 98           |
| intl-messageformat                                            |  46,788 | ± 2.27% | 86           |
| globalize                                                     |  27,273 | ± 0.27% | 93           |

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

| Name                                                          | ops/sec | MoE     | Runs sampled |
| ------------------------------------------------------------- | ------: | ------- | ------------ |
| **@onigoetz/messageformat (+ make-plural) flat**              |  94,703 | ± 0.07% | 100          |
| @onigoetz/messageformat (+ @phensley/plurals) flat            |  94,569 | ± 0.06% | 98           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) flat    |  92,344 | ± 0.19% | 101          |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) tree    |  78,801 | ± 0.06% | 99           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters) initial |  78,696 | ± 0.31% | 100          |
| @onigoetz/messageformat (+ @phensley/plurals)                 |  78,229 | ± 0.16% | 95           |
| @onigoetz/messageformat (+ @onigoetz/intl-formatters)         |  77,001 | ± 0.15% | 102          |
| @onigoetz/messageformat (+ @onigoetz/make-plural) initial     |  55,007 | ± 0.15% | 97           |
| @onigoetz/messageformat (+ @onigoetz/make-plural)             |  54,376 | ± 0.18% | 100          |
| @phensley/messageformat                                       |  52,925 | ± 0.16% | 102          |
| @messageformat/core                                           |  30,446 | ± 0.06% | 98           |
| @ffz/icu-msgparser (+ custom renderer)                        |  29,422 | ± 1.13% | 100          |
| intl-messageformat                                            |  16,666 | ± 1.01% | 92           |
| format-message-parse                                          |  17,022 | ± 3.18% | 93           |
| globalize                                                     |   8,765 | ± 0.24% | 100          |
