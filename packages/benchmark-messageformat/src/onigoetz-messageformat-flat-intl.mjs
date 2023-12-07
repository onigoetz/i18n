import {
  dateFormatter,
  numberFormatter,
  pluralGenerator,
} from "@onigoetz/intl-formatters";
import { createRenderer, parse } from "@onigoetz/messageformat-object-flat";

const renderer = createRenderer(
  { locale: "en" },
  (cldr, type) => pluralGenerator(cldr.locale, { type }),
  (locale, options, value) => numberFormatter(locale, options)(value),
  (locale, options, value) => dateFormatter(locale, options)(value),
);

export default (string, options) => {
  return renderer(parse(string), options);
};
