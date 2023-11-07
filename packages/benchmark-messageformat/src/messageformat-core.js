import MessageFormat from "@messageformat/core";

const mf = new MessageFormat("en");

export default (string, options) => mf.compile(string)(options);
