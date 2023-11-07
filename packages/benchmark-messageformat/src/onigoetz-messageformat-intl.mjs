import { dateFormatter, numberFormatter, pluralGenerator } from "@onigoetz/intl-formatters";
import { createRenderer, parse } from "@onigoetz/messageformat";

function pluralFactory(cldr, type) {
  return pluralGenerator(cldr.locale, {type});
}

const renderer = createRenderer(
  { locale: "en" },
  pluralFactory,
  (locale, options, value) => numberFormatter(locale, options)(value),
  (locale, options, value) => dateFormatter(locale, options)(value),
);

export default (string, options) => {
  return renderer(parse(string), options);
};
