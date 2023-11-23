// Load Globalize and ALL plugins
//import * as Cldr from "cldrjs";
import * as Globalize from "globalize/dist/globalize";

import "globalize/dist/globalize/message";
import "globalize/dist/globalize/number";
import "globalize/dist/globalize/plural";
import "globalize/dist/globalize/currency";
import "globalize/dist/globalize/date";
//import "globalize/dist/globalize/relative-time";
//import "globalize/dist/globalize/unit";

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
