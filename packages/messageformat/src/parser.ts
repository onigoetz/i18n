import { compile, match } from "./matcher";
import {
  ArgToken,
  Context,
  MessageOpType,
  PluralToken,
  SelectToken,
  SimpleToken,
  Submessages,
  TextToken,
  Token,
  ValueToken,
} from "./types";

const OPEN = "{";
const CLOSE = "}";
const SEP = ",";
const SUB_VAR = "#";
const ESCAPE = "'";
const OFFSET = compile(/offset:-?\d+/.source);
const MULTI_SPACE = compile("\\s+");

// Matches [^[[:Pattern_Syntax:][:Pattern_White_Space:]]]+
// could be replaced in the future with [^\p{Pattern_Syntax}\p{Pattern_White_Space}]+ once crafty includes babel when compiling TypeScript
const IDENTIFIER = compile(
  // eslint-disable-next-line no-control-regex
  /[^\u0009-\u000d \u0085\u200e\u200f\u2028\u2029\u0021-\u002f\u003a-\u0040\u005b-\u005e\u0060\u007b-\u007e\u00a1-\u00a7\u00a9\u00ab\u00ac\u00ae\u00b0\u00b1\u00b6\u00bb\u00bf\u00d7\u00f7\u2010-\u2027\u2030-\u203e\u2041-\u2053\u2055-\u205e\u2190-\u245f\u2500-\u2775\u2794-\u2bff\u2e00-\u2e7f\u3001-\u3003\u3008-\u3020\u3030\ufd3e\ufd3f\ufe45\ufe46]+/
    .source,
);
const PLURAL = compile(/(=\d+(\.\d+)?)|zero|one|two|few|many|other/.source);

/**
 * Writes a nice code frame to show where an error happened.
 *
 * @param context
 */
function codeFrame(context: Context) {
  const beforeLength = Math.max(0, context.i - 5);

  const before = context.msg.substr(
    beforeLength,
    Math.min(context.i - beforeLength, 5),
  );
  const current = context.msg[context.i];
  const after = context.msg.substr(context.i + 1, 5);

  return `"…${before}[${current}]${after}…"`;
}

/**
 * Create an error to explain that something was unexpected
 *
 * @param char
 * @param index
 */
function unexpected(char: string, index: number): SyntaxError {
  return new SyntaxError(`unexpected ${char} at position ${index}`);
}

/**
 * Create an error to explain that something was expected
 *
 * @param char
 * @param context
 */
function expected(char: string, context: Context): SyntaxError {
  const index = context.i;
  const found = context.msg[index];

  return new SyntaxError(
    `expected ${char} at position ${index} but found ${
      found || "eof"
    }. ${codeFrame(context)}`,
  );
}

/**
 * Eat all available spaces and advance the context
 * @param context
 */
function skipSpace(context: Context): boolean {
  return match(MULTI_SPACE, context) !== undefined;
}

/**
 * Asserts there is a separator and eat the space after it
 *
 * ```
 * {numBooks, plural, one {book} other {books}}
 *          ^^      ^^
 * ```
 * @param char
 * @param context
 */
function skipSeparator(char: string, context: Context) {
  if (char !== SEP) {
    throw expected(`${SEP} or ${CLOSE}`, context);
  }
  ++context.i;
  skipSpace(context);
}

/**
 * Add a token and returns the next index
 * @param context
 * @param token
 * @returns
 */
function add(context: Context, token: Token): number {
  context.result.push(token);
  return ++context.nextIndex;
}

/**
 * Parse text, stop or not at separators, stop or not at spaces, stop or not at #
 * Could use some cleanup :/
 *
 * @param context
 * @param specialHash
 */
function parseText(context: Context, specialHash = false): string {
  let out = "";

  while (context.i < context.l) {
    const char = context.msg[context.i];
    if (char === OPEN || char === CLOSE || (specialHash && char === SUB_VAR)) {
      break;
    }

    if (char === ESCAPE) {
      let next = context.msg[++context.i];
      if (next === ESCAPE) {
        // Escaped Escape Character
        out += next;
        ++context.i;
      } else if (
        next === OPEN ||
        next === CLOSE ||
        (specialHash && next === SUB_VAR)
      ) {
        // Special Character
        out += next;
        while (++context.i < context.l) {
          next = context.msg[context.i];
          if (next === ESCAPE) {
            // Check for an escaped escape character, and don't
            // stop if we encounter one.
            next = context.msg[context.i + 1];
            if (next === ESCAPE) {
              out += next;
              ++context.i;
            } else {
              ++context.i;
              break;
            }
          } else {
            out += next;
          }
        }
      } else {
        out += char;
      }
    } else {
      ++context.i;
      out += char;
    }
  }

  return out;
}

function isNot(context: Context, char: string) {
  return context.msg[context.i] !== char;
}

/**
 * Parses a single sub-message block, including any trailing space
 *
 * ```
 * {numBooks, plural, one {book} other {books}}
 *                        ^^^^^^^
 * ```
 */
function parseSubmessage(
  context: Context,
  parent: ValueToken,
  specialHash: boolean,
): number {
  const startAt = context.nextIndex;
  skipSpace(context);
  if (isNot(context, OPEN)) {
    throw expected(OPEN, context);
  }

  ++context.i;

  // Eat the block until we reach its closing tag
  // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
  parseAST(context, parent, specialHash);

  if (isNot(context, CLOSE)) {
    throw expected(CLOSE, context);
  }

  ++context.i;
  skipSpace(context);

  add(context, [MessageOpType.END]);

  return startAt;
}

/**
 * Separates the sub messages of a plural, select or selectordinal blocks into separate tokens
 *
 * ```
 * {numBooks, plural, one {book} other {books}}
 *                    ^^^^^^^^^^^^^^^^^^^^^^^^
 * ```
 *
 * @param context
 * @param parent
 * @param specialHash only in the case of plurals or selectordinal, we give a special treatment to #
 * @param matcher The Regular Expression to use to find a sub message identifier
 */
function parseSubmessages(
  context: Context,
  parent: ValueToken,
  specialHash: boolean,
  matcher: RegExp,
): Submessages {
  const submessages: Submessages = {} as Submessages;

  // Continue until we reach the end of the string or a block closing
  while (context.i < context.l && context.msg[context.i] !== CLOSE) {
    const selector = match(matcher, context);
    if (!selector) {
      throw expected("sub-message selector", context);
    }

    submessages[selector] = parseSubmessage(context, parent, specialHash);
  }

  if (!submessages.other) {
    throw expected("other sub-message", context);
  }

  return submessages;
}

/**
 * Parse the offset part of a plural, if it is present
 *
 * ```
 * {numBooks, plural, offset:1 one {book} other {books}}
 *                    ^^^^^^^^
 * ```
 *
 * @param context
 */
function parseOffset(context: Context): number {
  let n = 0;
  const m = match(OFFSET, context);
  if (m) {
    // This must parse successfully since it is constrained by the regexp match
    n = parseInt(m.split(":")[1], 10);
  }
  return n;
}

/**
 * Parse the plural part of a block
 * ```
 * {numBooks, plural, one {book} other {books}}
 *                    ^^^^^^^^^^^^^^^^^^^^^^^^
 * ```
 *
 * Including an optional offset
 * ```
 * {numBooks, plural, offset:1 one {book} other {books}}
 *                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ```
 *
 * @param context
 * @param current The token we're preparing
 */
function parsePlural(context: Context, current: PluralToken) {
  const char = context.msg[context.i];
  if (char === CLOSE) {
    throw expected("sub-messages", context);
  }

  skipSeparator(char, context);

  // Get offset if defined
  const offset = parseOffset(context);
  if (offset) {
    current[2] = offset;
    skipSpace(context);
  }

  // Parse available options
  current[4] = parseSubmessages(context, current, true, PLURAL);
  return current;
}

/**
 * Parse the sub-message part of a select block
 * ```
 * {color, select, pink {Pink} other {Not Pink}}
 *                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * ```
 *
 * @param context
 * @param current The token we're preparing
 */
function parseSelect(context: Context, current: SelectToken) {
  const char = context.msg[context.i];
  if (char === CLOSE) {
    throw expected("sub-messages", context);
  }

  skipSeparator(char, context);

  // Parse available options
  current[2] = parseSubmessages(context, current, false, IDENTIFIER);
  return current;
}

function parseSimple(context: Context, current: SimpleToken) {
  const char = context.msg[context.i];
  if (char === CLOSE) {
    return current;
  }

  skipSeparator(char, context);

  // TODO :: handle multiple options
  const format = parseText(context, false);
  if (!format) {
    throw expected("format", context);
  }

  // Since we allow spaces mid-format, we should trim any
  // remaining spaces off the end.
  current[3] = [format.trimRight()];
  return current;
}

/**
 * Parses a block, can be of any type like `{name}` or `{numBooks, plural, one {book} other {books}}`
 *
 * @param context
 * @param parent
 */
function parseElement(context: Context) {
  ++context.i;
  skipSpace(context);

  // Get the variable this block refers to
  const id = match(IDENTIFIER, context);
  if (!id) {
    throw expected("placeholder id", context);
  }

  // Let's prepare a simple argument block
  const token: Token = [MessageOpType.ARG, id] as unknown as Token;

  skipSpace(context);

  // If we're at the end of the block this is a single argument
  const char = context.msg[context.i];
  if (char === CLOSE) {
    ++context.i;
    add(context, token);
    return;
  }

  skipSeparator(char, context);

  // Since we're still in the block, it must have a type
  const type = match(IDENTIFIER, context);
  if (!type) {
    throw expected("type", context);
  }

  skipSpace(context);

  // Some types has to be treated specially
  // The rest (date, number ...) will be handled as simple tags
  switch (type) {
    case "plural":
    case "selectordinal":
      token[0] = MessageOpType.PLURAL;
      (token as PluralToken)[3] = type === "plural";
      add(context, token);
      parsePlural(context, token as PluralToken);
      (token as PluralToken)[5] = context.nextIndex;
      break;

    case "select":
      token[0] = MessageOpType.SELECT;
      add(context, token);
      parseSelect(context, token as SelectToken);
      (token as SelectToken)[3] = context.nextIndex;
      break;

    default:
      token[0] = MessageOpType.SIMPLE;
      (token as SimpleToken)[2] = type;
      parseSimple(context, token as SimpleToken);
      add(context, token);
      break;
  }

  skipSpace(context);

  // At this stage, we have to be at the end of the current block
  if (isNot(context, CLOSE)) {
    throw expected(CLOSE, context);
  }

  ++context.i;
}

/**
 * Our main loop, will take a string and will dispatch its parsing to various utility functions
 * @param context
 * @param parent
 * @param specialHash
 */
function parseAST(
  context: Context,
  parent: ValueToken,
  specialHash: boolean,
): Token[] {
  while (context.i < context.l) {
    const start = context.i;
    const char = context.msg[start];

    if (char === CLOSE) {
      if (!parent) {
        throw unexpected(char, context.i);
      }
      break;
    }

    // If we're in a 'plural' or 'selectordinal', '#' refers to the parent variable, (plus or minus its offset)
    if (specialHash && char === SUB_VAR) {
      ++context.i;
      // We can safely cast here as `specialHash` is only true if we are in a Plural or SelectOrdinal
      // and both have an offset
      add(context, [
        MessageOpType.ARG,
        parent[1],
        (parent as PluralToken)[2],
      ] as ArgToken);
    } else if (char === OPEN) {
      // If we see a block start, we send it to `parseElement` and add it to the array if an element was found
      parseElement(context);
    } else {
      // Otherwise it's probably just text, which we add if it was found
      const text = parseText(context, specialHash);
      if (text) {
        add(context, [MessageOpType.TEXT, text] as TextToken);
      }
    }

    // Infinite Loop Protection
    if (context.i === start) {
      throw unexpected(char, context.i);
    }
  }

  return context.result;
}

/**
 * Parses a message, returns a renderable token (which most likely contains other tokens)
 * @param message
 */
export default function parse(message: string | number): Token[] {
  const msg = String(message);
  return parseAST(
    { msg, l: msg.length, i: 0, result: [], nextIndex: 0 },
    //eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/ban-ts-comment
    //@ts-ignore
    null,
    false,
  );
}
