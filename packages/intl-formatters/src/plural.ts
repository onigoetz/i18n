/* eslint-disable @swissquote/swissquote/import/prefer-default-export */

import { PluralGeneratorOptions } from "@onigoetz/i18n-types";

type ValidPlurals = "zero" | "one" | "two" | "few" | "many" | "other";

const pluralMemory: Map<string, ReturnType<typeof pluralGenerator>> = new Map();

function getPluralSelector(
  locale: string,
  type: "cardinal" | "ordinal" | undefined,
) {
  const key = `${locale}-${type}`;

  if (!pluralMemory.has(key)) {
    const plural = new Intl.PluralRules(locale, { type });
    pluralMemory.set(key, (value) => plural.select(value) as ValidPlurals);
  }

  return pluralMemory.get(key) as ReturnType<typeof pluralGenerator>;
}

/**
 * Returns a function to resolve plurals
 * Uses the `Intl.PluralRules` API
 *
 * @param locale
 * @param options
 */
export function pluralGenerator(
  locale: string,
  options?: PluralGeneratorOptions,
): (value: number) => ValidPlurals {
  const type = (options && options.type) || "cardinal";

  return getPluralSelector(locale, type);
}
