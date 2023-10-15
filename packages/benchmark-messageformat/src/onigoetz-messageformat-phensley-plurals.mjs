import { parse, createRenderer } from "@onigoetz/messageformat";
import { pluralRules } from "@phensley/plurals";
import { dateFormatter, numberFormatter } from "@onigoetz/intl-formatters";

const pluralMemory = new Map();
function pluralFactory(cldr, type) {
  const key = `${cldr.locale}-${type}`;

  if (!pluralMemory.has(key)) {
    const rules = pluralRules.get(cldr.locale);
    pluralMemory.set(key, val => rules[type](val));
  }

  return pluralMemory.get(key);
}

const renderer = createRenderer(
  { locale: "en" },
  pluralFactory,
  (locale, options, value) => numberFormatter(locale, options)(value),
  (locale, options, value) => dateFormatter(locale, options)(value)
);

export default (string, options) => {
  return renderer(parse(string), options);
};
