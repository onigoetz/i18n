import { pluralRules } from "@phensley/plurals";

const pluralMemory = {};

function pluralGenerator(locale, type) {
  const key = `${locale}-${type}`;

  if (!pluralMemory.hasOwnProperty(key)) {
    const context = pluralRules.get(locale);
    pluralMemory[key] = context[type].bind(context);
  }

  return pluralMemory[key];
}

export default (type, locale, value) => {
  return pluralGenerator(locale, type)(value);
};
