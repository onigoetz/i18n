import IntlMessageFormat from "intl-messageformat";

export default (string, options) => {
  const formatter = new IntlMessageFormat(string, "en");
  return formatter.format(options);
};
