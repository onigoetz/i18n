import interpret from "format-message-interpret";
import parse from "format-message-parse";

export default function (string, options) {
  const parsed = parse(string);
  return interpret(parsed, "en")(options);
}
