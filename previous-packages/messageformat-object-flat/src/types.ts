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

  result: Token[];
  nextIndex: number;
};

export type Argument = string | number;

export type Submessages = {
  [key: string]: number;
  other: number;
};

/**
 * Type of a message instruction.
 *
 * @public
 */
export enum MessageOpType {
  TEXT = 0,
  ARG = 1,
  PLURAL = 2,
  SELECT = 3,
  SIMPLE = 4,
  END = 5,
}

/**
 * Lexicon:
 * t: Type
 * v: Variable / Value
 * o: Offset
 * m: Submessages
 * f: Simple type formatter
 * s: Simple type Options
 * j: Jump to index
 */

export interface TextToken {
  /** Type */
  t: MessageOpType.TEXT;
  /** Content */
  v: string;
}

export interface ArgToken {
  /** Type */
  t: MessageOpType.ARG;
  /** Argument */
  v: Argument;
  /** Offset */
  o?: number;
}

export interface PluralToken {
  /** Type */
  t: MessageOpType.PLURAL;
  /** Argument */
  v: Argument;
  /** Offset */
  o?: number;
  /** is Cardinal */
  c?: boolean;
  /** Messages */
  m: Submessages;
  /** Jump to */
  j: number;
}

export interface SelectToken {
  /** Type */
  t: MessageOpType.SELECT;
  /** Argument */
  v: Argument;
  /** Messages */
  m: Submessages;
  /** Jump to */
  j: number; // continue
}

export interface SimpleToken {
  /** Type */
  t: MessageOpType.SIMPLE;
  /** Argument */
  v: Argument;
  /** Formatter */
  f: string;
  /** Style / Options */
  s?: string[];
}

export type VariableToken = ArgToken | PluralToken | SelectToken | SimpleToken;

export interface EndToken {
  /** Type */
  t: MessageOpType.END;
}

export type Token = EndToken | TextToken | VariableToken;
