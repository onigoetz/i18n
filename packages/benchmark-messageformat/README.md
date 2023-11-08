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
| globalize                                         | 1.7.0   | 208K | Uses peg.js |

__Notes:__
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
> - Node.js v20.9.0
> - Apple M2 CPU
> - November 8, 2023

## Simple String
```javascript
const input = [`Hello, world!`, {}];
  
// Renders: `Hello, world!`
```

| Name | ops/sec | MoE | Runs sampled |
| ---- | -------:| --- | ----------- |
| __@onigoetz/messageformat (+ @onigoetz/intl)__ | 8,931,306 | ± 0.21% | 101 |
| @onigoetz/messageformat (+ @phensley/plurals) | 8,864,387 | ± 0.18% | 100 |
| format-message-parse | 7,802,495 | ± 0.27% | 99 |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 7,794,521 | ± 0.22% | 100 |
| @ffz/icu-msgparser (+ custom renderer) | 5,656,945 | ± 0.30% | 99 |
| @phensley/messageformat | 5,560,901 | ± 0.59% | 98 |
| @messageformat/core | 1,183,394 | ± 0.40% | 99 |
| intl-messageformat | 228,133 | ± 0.91% | 91 |
| globalize | 37,145 | ± 0.40% | 94 |

## With one variable
```javascript
const input = [`Hello, {name}!`, {
  "name": "John"
}];
  
// Renders: `Hello, John!`
```

| Name | ops/sec | MoE | Runs sampled |
| ---- | -------:| --- | ----------- |
| __@onigoetz/messageformat (+ @phensley/plurals)__ | 4,181,899 | ± 0.28% | 99 |
| @onigoetz/messageformat (+ @onigoetz/intl) | 4,113,443 | ± 1.15% | 91 |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 3,874,205 | ± 2.09% | 89 |
| format-message-parse | 3,687,949 | ± 0.29% | 100 |
| @ffz/icu-msgparser (+ custom renderer) | 3,276,239 | ± 0.61% | 96 |
| @phensley/messageformat | 2,837,812 | ± 0.25% | 101 |
| @messageformat/core | 707,087 | ± 0.22% | 91 |
| intl-messageformat | 200,359 | ± 1.01% | 93 |
| globalize | 36,318 | ± 0.27% | 95 |

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
| __@onigoetz/messageformat (+ @phensley/plurals)__ | 590,769 | ± 0.08% | 95 |
| @onigoetz/messageformat (+ @onigoetz/intl) | 523,642 | ± 0.26% | 100 |
| @phensley/messageformat | 520,757 | ± 0.14% | 100 |
| @messageformat/core | 170,850 | ± 0.13% | 93 |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 139,840 | ± 0.14% | 96 |
| @ffz/icu-msgparser (+ custom renderer) | 130,186 | ± 0.08% | 99 |
| format-message-parse | 81,207 | ± 0.19% | 99 |
| intl-messageformat | 47,014 | ± 2.04% | 88 |
| globalize | 27,173 | ± 0.64% | 95 |

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
| __@onigoetz/messageformat (+ @phensley/plurals)__ | 92,894 | ± 0.07% | 100 |
| @onigoetz/messageformat (+ @onigoetz/intl) | 90,918 | ± 0.17% | 100 |
| @onigoetz/messageformat (+ @onigoetz/make-plural) | 61,149 | ± 0.17% | 99 |
| @phensley/messageformat | 52,854 | ± 0.06% | 100 |
| @messageformat/core | 30,248 | ± 0.25% | 95 |
| @ffz/icu-msgparser (+ custom renderer) | 29,312 | ± 0.79% | 99 |
| intl-messageformat | 16,569 | ± 0.96% | 94 |
| format-message-parse | 16,799 | ± 2.54% | 96 |
| globalize | 8,764 | ± 0.18% | 100 |
