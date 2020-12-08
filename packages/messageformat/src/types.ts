export type Context = {
  /**
   * Current position
   */
  i: number;
  /**
   * Total length of the string
   */
  l: number;
  /**
   * Original String
   */
  msg: string;
};

export type Submessages = {
  [key: string]: Token;
  other: Token;
};

/**
 * Lexicon:
 * t: Type
 * v: Variable
 * o: Offset
 * s: Submessages
 * c: children
 * f: format
 */

export type TextToken = { t: "text"; v: string };
export type ArgToken = { t: "arg"; v: string; o?: number };
export type SelectOrdinalToken = {
  t: "selectordinal";
  v: string;
  o?: number;
  s: Submessages;
};
export type PluralToken = {
  t: "plural";
  v: string;
  o?: number;
  s: Submessages;
};
export type SelectToken = {
  t: "select";
  v: string;
  s: Submessages;
};
export type DateTimeToken = {
  t: "date" | "time" | "datetime";
  v: string;
  f?: string;
};
export type NumberToken = {
  t: "number";
  v: string;
  f?: string;
};

export type ValueToken =
  | TextToken
  | ArgToken
  | PluralToken
  | SelectOrdinalToken
  | SelectToken
  | DateTimeToken
  | NumberToken;

export type BlockToken = {
  t: "block";
  c: Token[];
};
export type NOOPToken = {
  t: "noop";
};

export type Token = BlockToken | NOOPToken | ValueToken;
