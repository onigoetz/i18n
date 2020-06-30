import MessageFormat from "messageformat";

const mf = new MessageFormat("en");

export default (string, options) => mf.compile(string)(options);
