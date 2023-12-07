import { dateFormatter, numberFormatter } from "@onigoetz/intl-formatters";
import * as makePlural from "make-plural";
import { createRenderer, parse } from "@onigoetz/messageformat-object-flat";

const renderer = createRenderer(
  { locale: "en" },
  (cldr, type) => {
    const selector = makePlural[cldr.locale];
    return (value) => selector(value, type === "ordinal");
  },
  (locale, options, value) => numberFormatter(locale, options)(value),
  (locale, options, value) => dateFormatter(locale, options)(value),
);

export default (string, options) => {
  return renderer(parse(string), options);
};
