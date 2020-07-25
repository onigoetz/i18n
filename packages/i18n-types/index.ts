export interface DateFormatterOptions {
  /**
   * One of the following String values: full, long, medium, or short, eg. { date: "full" }.
   */
  date?: "full" | "long" | "medium" | "short";
  /**
   * One of the following String values: full, long, medium, or short, eg. { time: "full" }.
   */
  time?: "full" | "long" | "medium" | "short";
  /**
   * One of the following String values: full, long, medium, or short, eg. { datetime: "full" }
   */
  datetime?: "full" | "long" | "medium" | "short";
}

export interface CommonNumberFormatterOptions {
  /**
   * Non-negative integer Number value indicating the minimum integer digits to be used. Numbers will be padded with leading zeroes if necessary.
   */
  minimumIntegerDigits?: number;
  /**
   * Non-negative integer Number values indicating the minimum and maximum fraction digits to be used.
   * Numbers will be rounded or padded with trailing zeroes if necessary.
   * Either one or both of these properties must be present.
   * If they are, they will override minimum and maximum fraction digits derived from the CLDR patterns.
   */
  minimumFractionDigits?: number;
  /**
   * Non-negative integer Number values indicating the minimum and maximum fraction digits to be used.
   * Numbers will be rounded or padded with trailing zeroes if necessary.
   * Either one or both of these properties must be present.
   * If they are, they will override minimum and maximum fraction digits derived from the CLDR patterns.
   */
  maximumFractionDigits?: number;
  /**
   * Positive integer Number values indicating the minimum and maximum fraction digits to be shown.
   * Either none or both of these properties are present
   * If they are, they override minimum and maximum integer and fraction digits.
   * The formatter uses however many integer and fraction digits are required to display the specified number of significant digits.
   */
  minimumSignificantDigits?: number;
  /**
   * Positive integer Number values indicating the minimum and maximum fraction digits to be shown.
   * Either none or both of these properties are present.
   * If they are, they override minimum and maximum integer and fraction digits.
   * The formatter uses however many integer and fraction digits are required to display the specified number of significant digits.
   */
  maximumSignificantDigits?: number;
  /**
   * String with rounding method ceil, floor, round (default), or truncate.
   */
  round?: "ceil" | "floor" | "round" | "truncate";
  /**
   * Boolean (default is true) value indicating whether a grouping separator should be used.
   */
  useGrouping?: boolean;
}

export interface NumberFormatterOptions extends CommonNumberFormatterOptions {
  /**
   * decimal (default), or percent
   */
  style?: "decimal" | "percent";
}

export interface CurrencyFormatterOptions extends CommonNumberFormatterOptions {
  /**
   * symbol (default), code or name.
   */
  style?: "symbol" | "code" | "name";
}

export interface PluralGeneratorOptions {
  /**
   * cardinal (default), or ordinal.
   */
  type?: "cardinal" | "ordinal";
}

export interface RelativeTimeFormatterOptions {
  /**
   * eg. "short" or "narrow". Or falsy for default long form
   */
  form?: "short" | "narrow";
}
