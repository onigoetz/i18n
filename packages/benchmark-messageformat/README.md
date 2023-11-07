# MessageFormat parse and render benchmark

In this benchmark we'll look at two metrics : Library size and parsing/rendering speed.

Like any synthetic benchmark these should be taken with a pinch of salt.
I tried to compare apples with apples as much as possible, but some libraries do a bit more and some others do a bit less.

Feel free to make a PR to help make these comparisons as fair as possible.

As a final word, I made this comparison purely for fun and to learn a thing or two about performance optimization.

## Libraries size

Sources can be found in `src`, measure taken on 07/11/2023 With latest available versions

| Npm Package                        | Version | Size | Comment     |
| ---------------------------------- | ------- | ---- | ----------- |
| @ffz/icu-msgparser                 | 2.0.0   | 13K  |             |
| @onigoetz/messageformat            | 0.1.0   | 16K  |             |
| @onigoetz/messageformat (memoized) | 0.1.0   | 23K  |             |
| format-message-parse               | 6.2.4   | 28K  | Uses peg.js |
| @onigoetz/messageformat (@phensley/plurals) | 0.1.0   | 62K  |             |
| intl-messageformat                 | 10.5.4  | 71K  | Uses peg.js |
| @phensley/messageformat            | 1.2.6   | 81K  |             |
| @messageformat/core                | 3.2.0   | 96K  | Uses peg.js |

`@onigoetz/messageformat` is originally a fork of `@ffz/icu-msgparser` but it contained no renderer. So I put an early version of my own renderer in for comparison purposes.

> Special mention for `@eo-locale/core` Which provides a very small package,
> however it provides no package that runs on Node.js 10 and crashes on our test strings.

## Benchmark

Since each application has different translation needs, I tried to make a somewhat representative representation of what translation strings look like.
From the simple string to the complex nested plural in a select, there are four different tests.

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
| __@onigoetz/messageformat (@phensley/plurals)__ | 8,821,744 | ± 0.51% | 99 |
| @onigoetz/messageformat | 8,723,468 | ± 0.53% | 95 |
| format-message-parse | 7,816,226 | ± 0.26% | 99 |
| @onigoetz/messageformat (memoized) | 7,770,656 | ± 0.41% | 99 |
| @ffz/icu-msgparser | 5,762,734 | ± 0.17% | 97 |
| @phensley/messageformat | 5,489,417 | ± 0.44% | 99 |
| @messageformat/core | 1,192,907 | ± 0.14% | 98 |
| intl-messageformat | 224,986 | ± 1.77% | 86 |

## With one variable
```javascript
const input = [`Hello, {name}!`, {
  "name": "John"
}];
  
// Renders: `Hello, John!`
```

| Name | ops/sec | MoE | Runs sampled |
| ---- | -------:| --- | ----------- |
| @onigoetz/messageformat | 4,217,050 | ± 0.43% | 100 |
| @onigoetz/messageformat (@phensley/plurals) | 4,211,371 | ± 0.35% | 94 |
| @onigoetz/messageformat (memoized) | 4,063,960 | ± 0.08% | 103 |
| format-message-parse | 3,485,649 | ± 0.15% | 99 |
| @ffz/icu-msgparser | 3,381,008 | ± 0.10% | 100 |
| @phensley/messageformat | 2,789,067 | ± 0.18% | 101 |
| @messageformat/core | 710,608 | ± 0.09% | 95 |
| intl-messageformat | 199,823 | ± 1.04% | 93 |

## With number formatting and plurals
```javascript
const input = [`Yo, {firstName} {lastName} has {numBooks, number, integer} {numBooks, plural, one {book} other {books}}.`, {
  "firstName": "John",
  "lastName": "Constantine",
  "numBooks": 5
}];
  
// Renders: `Yo, John Constantine has 5 books.`
```

| Name | ops/sec | MoE | Runs sampled |
| ---- | -------:| --- | ----------- |
| __@phensley/messageformat__ | 434,546 | ± 0.07% | 100 |
| @messageformat/core | 130,397 | ± 0.09% | 96 |
| @ffz/icu-msgparser | 70,374 | ± 1.53% | 98 |
| @onigoetz/messageformat | 56,143 | ± 1.39% | 96 |
| @onigoetz/messageformat (@phensley/plurals) | 55,681 | ± 1.26% | 98 |
| format-message-parse | 38,069 | ± 2.86% | 96 |
| intl-messageformat | 26,878 | ± 3.67% | 90 |
| @onigoetz/messageformat (memoized) | 7,276 | ± 22.89% | 20 |

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
| @onigoetz/messageformat (@phensley/plurals) | 91,784 | ± 0.56% | 97 |
| @onigoetz/messageformat (memoized) | 92,364 | ± 1.41% | 97 |
| @onigoetz/messageformat | 90,122 | ± 1.20% | 94 |
| @phensley/messageformat | 50,998 | ± 1.19% | 95 |
| @ffz/icu-msgparser | 35,812 | ± 1.15% | 94 |
| @messageformat/core | 29,900 | ± 0.16% | 100 |
| format-message-parse | 16,528 | ± 3.61% | 94 |
| intl-messageformat | 16,098 | ± 2.28% | 90 |
