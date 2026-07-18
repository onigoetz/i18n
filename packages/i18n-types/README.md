Shared TypeScript types describing the formatter options used across the
`@onigoetz/i18n` packages — `DateFormatterOptions`, `NumberFormatterOptions`,
`CurrencyFormatterOptions`, `PluralGeneratorOptions` and `RelativeTimeFormatterOptions`.

This package contains **no runtime code**; it ships type declarations only. It exists
so that a formatter implementation can depend on the shared vocabulary without
pulling in `@onigoetz/messageformat`.

You only need to install it directly if you are writing your own formatters.
`@onigoetz/messageformat` and `@onigoetz/intl-formatters` inline these types into
their own declarations, so consuming those packages does not require this one.

## Usage

```typescript
import type { NumberFormatterOptions } from "@onigoetz/i18n-types";

export function numberFormatter(locale: string, options: NumberFormatterOptions) {
  // ...
}
```
