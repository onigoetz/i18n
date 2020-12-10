import { pluralRules } from "@phensley/plurals";

export default (type, locale, value) => {
  return pluralRules.get(locale)[type](value);
};
