import {
  CHAR_0,
  CHAR_9,
  CHAR_CLOSE,
  CHAR_ESCAPE,
  CHAR_MINUS,
  CHAR_OPEN,
  CHAR_SEP,
  CHAR_SUB_VAR,
} from "./chars.js";
import {
  Context,
  MessageOpType,
  PluralToken,
  SelectToken,
  SimpleToken,
  Submessages,
  TextToken,
  Token,
  VariableToken,
} from "./types.js";

const PLURAL = /^(?:(=\d+(\.\d+)?)|zero|one|two|few|many|other)$/;

/**
 * Writes a nice code frame to show where an error happened.
 *
 * @param context
 */
function codeFrame(context: Context) {
  const beforeLength = Math.max(0, context.i - 5);

  const before = context.msg.substring(beforeLength, beforeLength + 5);
  const current = context.msg[context.i];
  const after = context.msg.substring(context.i + 1, context.i + 6);

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

function peek(context: Context): number {
  return context.msg.charCodeAt(context.i + 1);
}

function get(context: Context): number {
  return context.msg.charCodeAt(context.i);
}

function isIdentifierChar(char: number): boolean {
  return (
    char !== CHAR_OPEN &&
    char !== CHAR_CLOSE &&
    char !== CHAR_SEP &&
    char !== CHAR_SUB_VAR &&
    char !== CHAR_ESCAPE &&
    !isWhitespaceChar(char)
  );
}

function readIdentifier(context: Context): string {
  const start = context.i;

  while (
    context.i < context.l &&
    isIdentifierChar(context.msg.charCodeAt(context.i))
  ) {
    ++context.i;
  }

  return context.msg.substring(start, context.i);
}

export function isWhitespaceChar(code: number): boolean {
  return (
    (code >= 0x09 && code <= 0x0d) ||
    code === 0x20 || // space
    code === 0x85 || // …
    code === 0xa0 || // NBSP
    code === 0x180e || // MONGOLIAN VOWEL SEPARATOR
    (code >= 0x2000 && code <= 0x200d) || // en Quad, Em Quad, en Space, Em Space, Three-Per-Em space, Four-Per-Em Space, Six-Per-Em Space, Figure Space, Punctuation Space, Thin Space, Hair Space, Zero Width Space, Zero Width Non-Joiner, Zero-width Joiner
    code === 0x2028 || // Line Separator
    code === 0x2029 || // Paragraph Separator
    code === 0x202f || // Narrow No-Break Space
    code === 0x205f || // Medium Mathematical Space
    code === 0x2060 || // Word Joiner
    code === 0x3000 || // Ideographic Space
    code === 0xfeff // Zero width no-break space
  );
}

/**
 * Eat all available spaces and advance the context
 * @param context
 */
function skipSpace(context: Context): void {
  while (
    context.i < context.l &&
    isWhitespaceChar(context.msg.charCodeAt(context.i))
  ) {
    ++context.i;
  }
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
function skipSeparator(char: number, context: Context) {
  if (char !== CHAR_SEP) {
    throw expected(
      `${String.fromCharCode(CHAR_SEP)} or ${String.fromCharCode(CHAR_CLOSE)}`,
      context,
    );
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
    const char = get(context);
    if (
      char === CHAR_OPEN ||
      char === CHAR_CLOSE ||
      (specialHash && char === CHAR_SUB_VAR)
    ) {
      break;
    }

    if (char === CHAR_ESCAPE) {
      ++context.i;
      let next = get(context);
      if (next === CHAR_ESCAPE) {
        // Escaped Escape Character
        out += String.fromCharCode(next);
        ++context.i;
      } else if (
        next === CHAR_OPEN ||
        next === CHAR_CLOSE ||
        (specialHash && next === CHAR_SUB_VAR)
      ) {
        // Special Character
        out += String.fromCharCode(next);
        while (++context.i < context.l) {
          next = get(context);
          if (next === CHAR_ESCAPE) {
            // Check for an escaped escape character, and don't
            // stop if we encounter one.
            next = peek(context);
            if (next === CHAR_ESCAPE) {
              out += String.fromCharCode(next);
              ++context.i;
            } else {
              ++context.i;
              break;
            }
          } else {
            out += String.fromCharCode(next);
          }
        }
      } else {
        out += String.fromCharCode(char);
      }
    } else {
      ++context.i;
      out += String.fromCharCode(char);
    }
  }

  return out;
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
  parent: VariableToken,
  specialHash: boolean,
): number {
  const startAt = context.nextIndex;
  skipSpace(context);
  if (get(context) !== CHAR_OPEN) {
    throw expected(String.fromCharCode(CHAR_OPEN), context);
  }

  ++context.i;

  // Eat the block until we reach its closing tag
  // eslint-disable-next-line @swissquote/swissquote/@typescript-eslint/no-use-before-define
  parseAST(context, parent, specialHash);

  if (get(context) !== CHAR_CLOSE) {
    throw expected(String.fromCharCode(CHAR_CLOSE), context);
  }

  ++context.i;
  skipSpace(context);

  add(context, { t: MessageOpType.END });

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
  parent: VariableToken,
  specialHash: boolean,
  isPlural: boolean,
): Submessages {
  const submessages: Submessages = {} as Submessages;

  // Continue until we reach the end of the string or a block closing
  while (context.i < context.l && get(context) !== CHAR_CLOSE) {
    const selector = readIdentifier(context);
    if (!selector) {
      throw expected("sub-message selector", context);
    }

    if (isPlural && !PLURAL.exec(selector)) {
      throw expected(
        "selector to be one of 'zero', 'one', 'two', 'few', 'many', 'other' or '=' followed by a digit",
        context,
      );
    }

    submessages[selector] = parseSubmessage(context, parent, specialHash);
  }

  if (!submessages.other) {
    throw expected("other sub-message", context);
  }

  return submessages;
}

function isDigit(char: number): boolean {
  return (char >= CHAR_0 && char <= CHAR_9) || char === CHAR_MINUS;
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

  if (context.msg.substring(context.i, context.i + 7) === "offset:") {
    context.i += 7;

    const start = context.i;
    while (
      context.i < context.l &&
      isDigit(context.msg.charCodeAt(context.i))
    ) {
      ++context.i;
    }

    const extracted = context.msg.substring(start, context.i);
    if (!extracted) {
      throw expected("offset number", context);
    }

    n = parseInt(extracted, 10);
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
  const char = get(context);
  if (char === CHAR_CLOSE) {
    throw expected("sub-messages", context);
  }

  skipSeparator(char, context);

  // Get offset if defined
  const offset = parseOffset(context);
  if (offset) {
    current.o = offset;
    skipSpace(context);
  }

  // Parse available options
  current.m = parseSubmessages(context, current, true, true);
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
  const char = get(context);
  if (char === CHAR_CLOSE) {
    throw expected("sub-messages", context);
  }

  skipSeparator(char, context);

  // Parse available options
  current.m = parseSubmessages(context, current, false, false);
  return current;
}

function parseSimple(context: Context, current: SimpleToken) {
  const char = get(context);
  if (char === CHAR_CLOSE) {
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
  current.s = [format.trimRight()];
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
  const id = readIdentifier(context);
  if (!id) {
    throw expected("placeholder id", context);
  }

  // Let's prepare a simple argument block
  const token: Token = { t: MessageOpType.ARG, v: id } as unknown as Token;

  skipSpace(context);

  // If we're at the end of the block this is a single argument
  const char = get(context);
  if (char === CHAR_CLOSE) {
    ++context.i;
    add(context, token);
    return;
  }

  skipSeparator(char, context);

  // Since we're still in the block, it must have a type
  const type = readIdentifier(context);
  if (!type) {
    throw expected("type", context);
  }

  skipSpace(context);

  // Some types has to be treated specially
  // The rest (date, number ...) will be handled as simple tags
  switch (type) {
    case "plural":
    case "selectordinal":
      token.t = MessageOpType.PLURAL;
      (token as PluralToken).c = type === "plural";
      add(context, token);
      parsePlural(context, token as PluralToken);
      (token as PluralToken).j = context.nextIndex;
      break;

    case "select":
      token.t = MessageOpType.SELECT;
      add(context, token);
      parseSelect(context, token as SelectToken);
      (token as SelectToken).j = context.nextIndex;
      break;

    default:
      token.t = MessageOpType.SIMPLE;
      (token as SimpleToken).f = type;
      parseSimple(context, token as SimpleToken);
      add(context, token);
      break;
  }

  skipSpace(context);

  // At this stage, we have to be at the end of the current block
  if (get(context) !== CHAR_CLOSE) {
    throw expected(String.fromCharCode(CHAR_CLOSE), context);
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
  parent: VariableToken,
  specialHash: boolean,
): Token[] {
  while (context.i < context.l) {
    const start = context.i;
    const char = get(context);

    if (char === CHAR_CLOSE) {
      if (!parent) {
        throw unexpected(String.fromCharCode(char), context.i);
      }
      break;
    }

    // If we're in a 'plural' or 'selectordinal', '#' refers to the parent variable, (plus or minus its offset)
    if (specialHash && char === CHAR_SUB_VAR) {
      ++context.i;
      // We can safely cast here as `specialHash` is only true if we are in a Plural or SelectOrdinal
      // and both have an offset
      add(context, {
        t: MessageOpType.ARG,
        v: parent.v,
        o: (parent as PluralToken).o,
      });
    } else if (char === CHAR_OPEN) {
      // If we see a block start, we send it to `parseElement` and add it to the array if an element was found
      parseElement(context);
    } else {
      // Otherwise it's probably just text, which we add if it was found
      const text = parseText(context, specialHash);
      if (text) {
        add(context, { t: MessageOpType.TEXT, v: text } as TextToken);
      }
    }

    // Infinite Loop Protection
    if (context.i === start) {
      throw unexpected(String.fromCharCode(char), context.i);
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
