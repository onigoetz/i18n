# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Yarn 4 workspaces monorepo. Root scripts fan out to every package topologically:

```bash
yarn build          # tsc --noEmit + rslib build, per package
yarn test           # vitest watch, per package
yarn test:ci        # vitest run --coverage (what CI runs)
yarn format         # biome format (check only; add --write to fix)
yarn check          # biome check (add --apply to fix)
```

Working on a single package is usually faster:

```bash
yarn workspace @onigoetz/messageformat test          # watch mode
yarn workspace @onigoetz/messageformat test:ci       # single run + coverage
yarn workspace @onigoetz/messageformat build
```

Run a single test file or test name (vitest flags pass through):

```bash
yarn workspace @onigoetz/messageformat test run src/parser.test.ts
yarn workspace @onigoetz/messageformat test run -t "plural offset"
```

Benchmarks (private packages, require `yarn build` first):

```bash
cd packages/benchmark-messageformat && node benchmark.js
cd packages/benchmark-plural && node benchmark.js
```

`@onigoetz/intl-formatters` tests set `NODE_ICU_DATA` to `full-icu` — run them through the package script, not bare `vitest`, or locale output will differ.

## Architecture

Four published packages plus test/benchmark helpers, all deliberately dependency-free at runtime:

- **`@onigoetz/i18n-types`** — pure type declarations for formatter options (`DateFormatterOptions`, `NumberFormatterOptions`, `PluralGeneratorOptions`, …). The only runtime dependency `messageformat` has. Its `src` is the root-level `index.ts`, unlike the other packages.
- **`@onigoetz/messageformat`** — `parse()` (parser.ts) + `createRenderer()` (runtime.ts). No formatting logic of its own.
- **`@onigoetz/intl-formatters`** — optional `Intl`-backed implementations of the three functions `createRenderer` expects.
- **`@onigoetz/make-plural`** — fork of `make-plural` v4, compiles CLDR plural rule strings into selector functions. Sized for the browser.

### The parse/render split

The central design decision: `parse()` produces a **flat array of tokens**, not a tree. Branching tokens (`PLURAL`, `SELECT`) carry a `j` field (jump-to index after the branch) and a `m` map of submessage key → token index. `runtime.ts` walks the array with an explicit index `i` and a `stack` of return indices — `END` pops the stack. This is why rendering is fast and why the token format is essentially a bytecode; `MessageOpType` in `types.ts` is the opcode enum.

Consequence: when changing the parser, indices in emitted tokens are load-bearing. Adding, removing, or reordering tokens shifts every downstream jump target.

### Formatter injection

`createRenderer` takes the locale (as an opaque `T` "localeHolder") plus a plural generator, a number formatter and a date formatter, and closes over them. The runtime never imports `intl-formatters` — callers can supply Globalize, `Intl`, or anything else. Keep it that way; adding a formatting dependency to `messageformat` defeats the point of the library.

Unknown formatter types fall back to a `noop` returning `""` rather than throwing.

## Conventions

- Biome for both formatting and linting; each package has its own `biome.json` extending the shared shape (2-space indent, recommended rules). There is no ESLint/Prettier.
- Build is rslib, emitting ESM (`dist/esm`), CJS (`dist/cjs`) and types (`dist/types`) per package. `build` runs `tsc --noEmit` first, so type errors fail the build.
- TS targets ES2015 with `strict: true`; imports use explicit `.js` extensions (`moduleResolution: "Bundler"`, `type: "module"`).
- Node `>=20.19.0`; CI matrix is 20/22/24.
- Tests live next to sources as `*.test.ts`. `make-plural`'s `selftest.test.ts` validates every locale against CLDR data from the private `test-cldr-data` package — it is the real correctness gate for plural rules.
- Coverage is reported to SonarCloud via `vitest-sonar-reporter`; each package's `vitest.config.ts` rewrites report paths to be repo-relative, so don't drop the `onWritePath` hook.
- Versions are locked in lockstep across packages (`1.0.0-rc.x`) and published with `oao` (`yarn publish:canary` / `yarn publish:all`).
- `previous-packages/` holds earlier abandoned implementations kept for benchmark comparison; `docs/` is published with daux.io on push to master, and `docs/02_Packages/*.md` are symlinks to each package's README.
