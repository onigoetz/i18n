import * as makePlural from "make-plural";

export default (type, locale, value) => {
  return makePlural[locale](value, type === "ordinal");
};
