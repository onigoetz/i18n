// Load Globalize and ALL plugins
const Globalize = require("globalize");

// Load the required CLDR data
Globalize.load(require("test-cldr-data/for-globalize.json"));

export default (string, options) => {
  Globalize.loadMessages({
    en: {
      hello: string,
    },
  });

  const instance = Globalize("en");

  return instance.formatMessage("hello", options);
};
