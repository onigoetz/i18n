/* eslint-disable @swissquote/swissquote/import/prefer-default-export */

import { PluralGeneratorOptions } from "@onigoetz/i18n-types";

/**
 * Returns a function to resolve plurals
 * Uses the `Intl.PluralRules` API
 *
 * @param locale
 * @param options
 */
export function pluralGenerator(
  locale: string,
  options?: PluralGeneratorOptions
): (value: number) => "zero" | "one" | "two" | "few" | "many" | "other" {
  const plural = new Intl.PluralRules(locale, { type: options.type });
  return value =>
    plural.select(value) as "zero" | "one" | "two" | "few" | "many" | "other";
}
