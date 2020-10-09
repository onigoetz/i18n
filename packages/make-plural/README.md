This package is a fork of [https://www.npmjs.com/package/make-plural](`make-plural`) version 4.

It provided a compiler for CLDR plurals, but it also contained a lot of methods to test them.
I stripped the test methods and kept the conversion code to make it smaller.

## Usage

```javascript
import makePlural from "@onigoetz/make-plural";

// Original CLDR data
const pluralRules = {
  "plurals-type-cardinal": {
    en: {
      "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
      "pluralRule-count-other":
        " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"
    }
  },
  "plurals-type-ordinal": {
    en: {
      "pluralRule-count-one":
        "n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …",
      "pluralRule-count-two":
        "n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, …",
      "pluralRule-count-few":
        "n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, …",
      "pluralRule-count-other":
        " @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, …"
    }
  }
};

const pluralGenerator = makePlural(pluralRules["plurals-type-ordinal"]["en"]);

console.log(pluralGenerator(3)) // => few

```

## Size optimization

The original CLDR data is quite verbose and if you can preprocess it, a lot of data can be removed.
You can remove anything after `@decimal` or `@integer` and the `other` rule, you can go from :

```json
{
  "plurals-type-cardinal": {
    "en": {
      "pluralRule-count-one": "i = 1 and v = 0 @integer 1",
      "pluralRule-count-other":
        " @integer 0, 2~16, 100, 1000, 10000, 100000, 1000000, … @decimal 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, …"
    }
  },
  "plurals-type-ordinal": {
    "en": {
      "pluralRule-count-one":
        "n % 10 = 1 and n % 100 != 11 @integer 1, 21, 31, 41, 51, 61, 71, 81, 101, 1001, …",
      "pluralRule-count-two":
        "n % 10 = 2 and n % 100 != 12 @integer 2, 22, 32, 42, 52, 62, 72, 82, 102, 1002, …",
      "pluralRule-count-few":
        "n % 10 = 3 and n % 100 != 13 @integer 3, 23, 33, 43, 53, 63, 73, 83, 103, 1003, …",
      "pluralRule-count-other":
        " @integer 0, 4~18, 100, 1000, 10000, 100000, 1000000, …"
    }
  }
}
```

to :

```json
{
  "plurals-type-cardinal": {
    "en": {
      "pluralRule-count-one": "i = 1 and v = 0"
    }
  },
  "plurals-type-ordinal": {
    "en": {
      "pluralRule-count-one": "n % 10 = 1 and n % 100 != 11",
      "pluralRule-count-two": "n % 10 = 2 and n % 100 != 12",
      "pluralRule-count-few": "n % 10 = 3 and n % 100 != 13"
    }
  }
}
```

## Efficient pluralGenerator

If you need to create many plural generators, parsing the CLDR data many times isn't efficient.
You can create a small factory function like this:

```javascript
const pluralRules = {}; // CLDR data
const pluralMemory = {};

function pluralGenerator(locale, type) {
  const key = `${locale}-${type}`;

  if (!pluralMemory.hasOwnProperty(key)) {
    pluralMemory[key] = makePlural(
      pluralRules[`plurals-type-${type}`][locale]
    );
  }

  return pluralMemory[key];
}
```
