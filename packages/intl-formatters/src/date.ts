/* eslint-disable @swissquote/swissquote/import/prefer-default-export */

import type { DateFormatterOptions } from "@onigoetz/i18n-types";

import { objectExtend } from "./utils.js";

function convertDateToIntl(
  format: DateFormatterOptions["date"],
): Intl.DateTimeFormatOptions {
  const o: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  switch (format) {
    // biome-ignore lint/suspicious/noFallthroughSwitchClause: we want fallthrough here
    case "full":
      o.weekday = "long";
    case "long":
      o.month = "long";
      break;
    case "short":
      o.month = "numeric";
  }

  return o;
}

function convertTimeToIntl(
  format: DateFormatterOptions["time"],
): Intl.DateTimeFormatOptions {
  const o: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };

  if (format !== "short") {
    o.second = "2-digit";
  }

  if (format === "full") {
    o.timeZoneName = "long";
  }

  if (format === "long") {
    o.timeZoneName = "short";
  }

  return o;
}

function convertToIntl(
  options: DateFormatterOptions,
): Intl.DateTimeFormatOptions {
  if (options.date) {
    return convertDateToIntl(options.date);
  }

  if (options.time) {
    return convertTimeToIntl(options.time);
  }

  return objectExtend(
    convertDateToIntl(options.datetime),
    convertTimeToIntl(options.datetime),
  );
}

/**
 * Returns a function that will format a date according to the options passed.
 *
 * Uses the `Intl.DateTimeFormat` API
 *
 * @param locale
 * @param options
 */
export function dateFormatter(
  locale: string,
  options?: DateFormatterOptions,
): (value: Date) => string {
  // eslint-disable-next-line no-param-reassign
  options = options || {};

  const formatter = new Intl.DateTimeFormat(locale, convertToIntl(options));

  return (value: Date) => formatter.format(value);
}
