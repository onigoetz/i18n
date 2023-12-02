import { dateFormatter, numberFormatter } from "@onigoetz/intl-formatters";
import { createRenderer, parse } from "@onigoetz/messageformat";
import { pluralRules } from "@phensley/plurals";

const renderer = createRenderer(
  { locale: "en" },
  (cldr, type) => {
    const rules = pluralRules.get(cldr.locale);

    // Creating a new function everytime comes with a performance cost
    // but just returning `rules[type]` fails
    return (val) => rules[type](val);
  },
  (locale, options, value) => numberFormatter(locale, options)(value),
  (locale, options, value) => dateFormatter(locale, options)(value),
);

export default (string, options) => {
  return renderer(parse(string), options);
};
