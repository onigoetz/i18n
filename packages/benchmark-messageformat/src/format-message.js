import parse from "format-message-parse";
import interpret from "format-message-interpret";

export default function(string, options) {
  const parsed = parse(string);
  return interpret(parsed, "en")(options);
}
