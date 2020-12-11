import { pluralGenerator } from "@onigoetz/intl-formatters";

const pluralMemory = {};

function memoPluralGenerator(locale, type) {
  const key = `${locale}-${type}`;

  if (!pluralMemory.hasOwnProperty(key)) {
    pluralMemory[key] = pluralGenerator(locale, { type });
  }

  return pluralMemory[key];
}

export default (type, locale, value) => {
  return memoPluralGenerator(locale, type)(value);
};
