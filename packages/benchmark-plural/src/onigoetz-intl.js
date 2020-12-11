import { pluralGenerator } from "@onigoetz/intl-formatters";

export default (type, locale, value) => {
  return pluralGenerator(locale, { type })(value);
};
