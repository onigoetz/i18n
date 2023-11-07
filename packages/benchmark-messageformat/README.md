# MessageFormat parse and render benchmark

In this benchmark we'll look at two metrics : Library size and parsing/rendering speed.

Like any synthetic benchmark these should be taken with a pinch of salt.
I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less.

Feel free to make a PR to help make these comparisons as fair as possible.

As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization.

## Libraries size

Sources can be found in `src`, measure taken on 07/11/2023 with latest available versions

| Npm Package                                       | Version | Size | Comment     |
| ------------------------------------------------- | ------- | ---- | ----------- |
| @ffz/icu-msgparser (+ custom renderer)            | 2.0.0   | 13K  |             |
| @onigoetz/messageformat (+ @onigoetz/intl)        | 0.1.0   | 17K  |             |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 0.1.0   | 20K  |             |
| format-message-parse                              | 6.2.4   | 28K  | Uses peg.js |
| @onigoetz/messageformat (+ @phensley/plurals)     | 0.1.0   | 62K  |             |
| intl-messageformat                                | 10.5.4  | 71K  | Uses peg.js |
| @phensley/messageformat                           | 1.7.3   | 81K  |             |
| @messageformat/core                               | 3.2.0   | 96K  | Uses peg.js |

__Notes:__
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
> - Node.js v20.9.0
> - Apple M2 CPU
> - November 7, 2023

## Simple String
```javascript
const input = [`Hello, world!`, {}];
  
// Renders: `Hello, world!`
```

| Name | ops/sec | MoE | Runs sampled |
| ---- | -------:| --- | ----------- |
| __@onigoetz/messageformat (+ @onigoetz/intl)__ | 8,858,921 | ± 0.37% | 96 |
| @onigoetz/messageformat (+ @phensley/plurals) | 8,771,570 | ± 0.27% | 97 |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 7,731,610 | ± 0.26% | 99 |
| format-message-parse | 7,755,763 | ± 0.71% | 93 |
| @ffz/icu-msgparser (+ custom renderer) | 5,634,717 | ± 0.83% | 100 |
| @phensley/messageformat | 5,411,679 | ± 0.09% | 98 |
| @messageformat/core | 1,201,810 | ± 0.13% | 99 |
| intl-messageformat | 227,801 | ± 1.13% | 90 |

## With one variable
```javascript
const input = [`Hello, {name}!`, {
  "name": "John"
}];
  
// Renders: `Hello, John!`
```

| Name | ops/sec | MoE | Runs sampled |
| ---- | -------:| --- | ----------- |
| __@onigoetz/messageformat (+ @phensley/plurals)__ | 4,235,594 | ± 0.11% | 99 |
| @onigoetz/messageformat (+ @onigoetz/intl) | 4,218,973 | ± 0.18% | 99 |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 4,050,269 | ± 0.13% | 99 |
| format-message-parse | 3,483,847 | ± 0.15% | 100 |
| @ffz/icu-msgparser (+ custom renderer) | 3,310,961 | ± 3.14% | 94 |
| @phensley/messageformat | 2,753,537 | ± 0.27% | 98 |
| @messageformat/core | 697,507 | ± 0.17% | 98 |
| intl-messageformat | 204,849 | ± 0.89% | 96 |

## With plurals
```javascript
const input = [`Yo, {firstName} {lastName} has {numBooks} {numBooks, plural, one {book} other {books}}.`, {
  "firstName": "John",
  "lastName": "Constantine",
  "numBooks": 5
}];
  
// Renders: `Yo, John Constantine has 5 books.`
```

| Name | ops/sec | MoE | Runs sampled |
| ---- | -------:| --- | ----------- |
| __@onigoetz/messageformat (+ @phensley/plurals)__ | 591,221 | ± 0.15% | 100 |
| @onigoetz/messageformat (+ @onigoetz/intl) | 529,547 | ± 0.09% | 98 |
| @phensley/messageformat | 519,950 | ± 0.08% | 97 |
| @messageformat/core | 170,877 | ± 0.10% | 95 |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 139,906 | ± 0.08% | 98 |
| @ffz/icu-msgparser (+ custom renderer) | 129,603 | ± 0.16% | 100 |
| format-message-parse | 82,489 | ± 0.16% | 97 |
| intl-messageformat | 47,011 | ± 1.86% | 85 |

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

| Name | ops/sec | MoE | Runs sampled |
| ---- | -------:| --- | ----------- |
| __@onigoetz/messageformat (+ @phensley/plurals)__ | 93,573 | ± 0.14% | 97 |
| @onigoetz/messageformat (+ @onigoetz/intl) | 92,139 | ± 0.26% | 97 |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 61,462 | ± 0.08% | 98 |
| @phensley/messageformat | 52,596 | ± 0.07% | 101 |
| @messageformat/core | 30,348 | ± 0.07% | 99 |
| @ffz/icu-msgparser (+ custom renderer) | 29,229 | ± 1.05% | 99 |
| format-message-parse | 16,911 | ± 2.77% | 96 |
| intl-messageformat | 16,581 | ± 1.08% | 92 |
