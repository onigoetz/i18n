/* eslint-disable no-param-reassign */
import {
  CommonNumberFormatterOptions,
  CurrencyFormatterOptions,
  NumberFormatterOptions,
} from "@onigoetz/i18n-types";

import { objectExtend } from "./utils.js";

function numberTruncate(value: number): number {
  return Math[value < 0 ? "ceil" : "floor"](value);
}

/**
 * round( method )
 *
 * @method [String] with either "round", "ceil", "floor", or "truncate".
 *
 * Return function( value, incrementOrExp ):
 *
 *   @value [Number] eg. 123.45.
 *
 *   @incrementOrExp [Number] optional, eg. 0.1; or
 *     [Object] Either { increment: <value> } or { exponent: <value> }
 *
 *   Return the rounded number, eg:
 *   - round( "round" )( 123.45 ): 123;
 *   - round( "ceil" )( 123.45 ): 124;
 *   - round( "floor" )( 123.45 ): 123;
 *   - round( "truncate" )( 123.45 ): 123;
 *   - round( "round" )( 123.45, 0.1 ): 123.5;
 *   - round( "round" )( 123.45, 10 ): 120;
 *
 *   Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 *   Ref: #376
 */
function numberRound(
  method: "round" | "ceil" | "floor" | "truncate" | undefined,
): (value: number) => number {
  let m: (number: number) => number = (v) => v;

  if (method) {
    m = method === "truncate" ? numberTruncate : Math[method];
  }

  return function round(value: number) {
    value = +value;

    // If the value is not a number, return NaN.
    if (Number.isNaN(value)) {
      return 0;
    }

    // Return original value if no rounding method is specified.
    return m(value);
  };
}

function getFormatter(
  locale: string,
  options: Intl.NumberFormatOptions & {
    round?: CommonNumberFormatterOptions["round"];
  },
) {
  const formatter = new Intl.NumberFormat(locale, options);
  const roundFn = numberRound(options.round);

  return function (value: number): string {
    return formatter.format(roundFn(value));
  };
}

/**
 * Returns a function to format currencies
 * uses Intl.NumberFormat API
 *
 * @param locale
 * @param currency
 * @param entryOptions
 */
export function currencyFormatter(
  locale: string,
  currency: string,
  entryOptions?: CurrencyFormatterOptions,
): (value: number) => string {
  const options: Intl.NumberFormatOptions = objectExtend(
    {},
    entryOptions || {},
  ) as Intl.NumberFormatOptions;
  if (entryOptions?.style) {
    options.currencyDisplay = entryOptions.style;
  }
  options.style = "currency";
  options.currency = currency;

  return getFormatter(locale, options);
}

/**
 * Returns a function to format numbers
 * uses Intl.NumberFormat API
 *
 * @param locale
 * @param options
 */
export function numberFormatter(
  locale: string,
  options?: NumberFormatterOptions,
): (value: number) => string {
  return getFormatter(locale, (options || {}) as Intl.NumberFormatOptions);
}
