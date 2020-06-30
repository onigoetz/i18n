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

export type TextToken = { t: "text"; v: string };
export type ArgToken = { t: "arg"; v: string; f?: number };
export type SelectOrdinalToken = {
  t: "selectordinal";
  v: string;
  f?: number;
  o: Submessages;
};
export type PluralToken = {
  t: "plural";
  v: string;
  f?: number;
  o: Submessages;
};
export type SelectToken = {
  t: "select";
  v: string;
  o: Submessages;
};
export type SimpleToken = {
  t: "date" | "time" | "datetime" | "number";
  f?: string;
  v: string;
};
export type BlockToken = {
  t: "block";
  n: Token[];
};
export type NOOPToken = {
  t: "noop";
};

export type Token =
  | TextToken
  | ArgToken
  | BlockToken
  | NOOPToken
  | PluralToken
  | SelectOrdinalToken
  | SelectToken
  | SimpleToken;
