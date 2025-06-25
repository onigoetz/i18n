import {
  buildMessageMatcher,
  DefaultMessageArgConverter,
  MessageEngine,
  parseMessagePattern,
} from "@phensley/messageformat";
import { pluralRules } from "@phensley/plurals";

const FORMATTERS = {
  number: (args, _options) => args[0],
};

const FORMATTER_NAMES = Object.keys(FORMATTERS);

const MATCHER = buildMessageMatcher(FORMATTER_NAMES);

const CONVERTER = new DefaultMessageArgConverter();

function parse(message) {
  return parseMessagePattern(message, MATCHER);
}

function plurals(language, region) {
  return pluralRules.get(language, region);
}

export default (message, named) => {
  const engine = new MessageEngine(
    plurals("en"),
    CONVERTER,
    FORMATTERS,
    parse(message),
  );
  return engine.evaluate([], named);
};
