import { parse, createRenderer } from "@onigoetz/messageformat";
import makePlural from "@onigoetz/make-plural";
import { dateFormatter , numberFormatter } from "@onigoetz/intl-formatters";
import memoize from "nano-memoize";

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

const memoizedPluralGenerator = memoize((cldr, type) =>
  makePlural(pluralRules[`plurals-type-${type}`][cldr.locale])
);
const memoizedNumberFormatter = memoize((locale, options) =>
  numberFormatter(locale, options)
);
const memoizedDateFormatter = memoize((locale, options) =>
  dateFormatter(locale, options)
);

const renderer = createRenderer(
  { locale: "en" },
  memoizedPluralGenerator,
  (locale, options, value) => memoizedNumberFormatter(locale, options)(value),
  (locale, options, value) => memoizedDateFormatter(locale, options)(value)
);

export default (string, options) => {
  return renderer(parse(string), options);
};
