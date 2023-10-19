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
export const enum MessageOpType {
  TEXT = 0,
  ARG = 1,
  PLURAL = 2,
  SELECT = 3,
  SIMPLE = 4,
  END = 5,
}

export interface TextToken {
  [0]: MessageOpType.TEXT;
  [1]: string;
}

export interface ArgToken {
  [0]: MessageOpType.ARG;
  [1]: Argument;
  [2]?: number; // offset
}

export interface PluralToken {
  [0]: MessageOpType.PLURAL;
  [1]: Argument;
  [2]?: number; // offset
  [3]?: boolean; // isCardinal
  [4]: Submessages;
  [5]: number; // continue
}

export interface SelectToken {
  [0]: MessageOpType.SELECT;
  [1]: Argument;
  [2]: Submessages;
  [3]: number; // continue
}

export interface SimpleToken {
  [0]: MessageOpType.SIMPLE;
  [1]: Argument;
  [2]: string; // type
  [3]?: string[]; // style / options
}

export type ValueToken =
  | TextToken
  | ArgToken
  | PluralToken
  | SelectToken
  | SimpleToken;

export interface EndToken {
  [0]: MessageOpType.END;
}

export type Token = EndToken | ValueToken;
