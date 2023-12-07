import { Context } from "./types";

const hasStickyRegexp = (() => {
  try {
    const r = new RegExp(".", "y");
    return !!r;
  } catch (err) {
    /* istanbul ignore next */
    return false;
  }
})();

/**
 * Construct a regular expression for use in a StickyMatcher.
 * Construct a regular expression for use in a SubstringMatcher.
 * @param str
 */
export function compile(pattern: string): RegExp {
  return hasStickyRegexp
    ? new RegExp(pattern, "y")
    : new RegExp(`^${pattern}`, "g");
}

export const match: (
  pattern: RegExp,
  r: Context
) => string | undefined = hasStickyRegexp
  ? function match(pattern, r) {
      pattern.lastIndex = r.i;
      const raw = pattern.exec(r.msg);
      if (raw) {
        // set the start of range to the sticky index
        r.i = pattern.lastIndex;
        return raw[0];
      }
      return undefined;
    }
  : function match(pattern, r) {
      pattern.lastIndex = 0;
      const s = r.msg.substring(r.i, r.l);
      const raw = pattern.exec(s);
      if (raw) {
        // skip ahead by the number of characters matched
        r.i += pattern.lastIndex;
        return raw[0];
      }
      return undefined;
    };
