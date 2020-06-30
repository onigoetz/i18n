import { pluralRules } from "@phensley/plurals";
import {
  buildMessageMatcher,
  parseMessagePattern,
  DefaultMessageArgConverter,
  MessageEngine
} from "@phensley/messageformat";

const FORMATTERS = {
  foo: (args, options) =>
    options[0] === "upper" ? args[0].toUpperCase() : args[0].toLowerCase()
};

const FORMATTER_NAMES = Object.keys(FORMATTERS);

const MATCHER = buildMessageMatcher(FORMATTER_NAMES);

function parse(message) {
  return parseMessagePattern(message, MATCHER);
}

const CONVERTER = new DefaultMessageArgConverter();
const plurals = (language, region) => pluralRules.get(language, region);
const pluralFormatter = plurals("en");

export default (message, named) => {
  const engine = new MessageEngine(
    pluralFormatter,
    CONVERTER,
    FORMATTERS,
    parse(message)
  );
  return engine.evaluate([], named);
};
