# AGENTS.md

## Project Overview

A production-ready TypeScript library starter template. Uses Bun as runtime/package manager, Biome for lint+format (no ESLint/Prettier), tsdown for building (Rolldown-based), lefthook for git hooks, changesets for versioning.

Key exports from the library (examples):
- `greet(name)` — returns `` `Hello, ${name}!` ``
- `capitalize(str)` — uppercases first character
- `range(end)` — returns `[0, 1, ..., end-1]`
- `sum(a, b)` — returns a + b

## Setup Commands

```bash
bun install              # install dependencies
bun install -d <pkg>     # add dev dependency
bun install <pkg>        # add runtime dependency
bun install --frozen-lockfile  # CI install (exact versions)
bun outdated             # check for outdated packages
```

## Development Workflow

```bash
bun run dev               # tsdown --watch (rebuild on file change)
bun run typecheck         # tsc --noEmit (type-check src/ + test/)
bun run lint              # biome check . (lint + format check)
bun run lint:fix          # biome check --write . (auto-fix)
bun run format            # biome format --write .
bun test                  # run all tests
bun test --watch          # run tests in watch mode
bun run ci                # full pipeline: typecheck → lint → test → build
```

## Testing Instructions

- Framework: `bun:test` (built into Bun, no extra config)
- Test files live in `test/` and use `.test.ts` extension
- Use `import { describe, expect, it } from "bun:test"` in each test file
- Import source directly from `../src/index.ts` (Bun resolves `.ts` natively)

```bash
bun test                       # run all tests
bun test --watch               # watch mode
bun test test/some-file.test.ts  # run a specific file
```

### Test Patterns

Tests use `describe`/`it`/`expect` from `bun:test`. Example:

```ts
import { describe, expect, it } from "bun:test"
import { greet } from "../src/index.ts"

describe("greet", () => {
  it("should return a greeting for a given name", () => {
    expect(greet("World")).toBe("Hello, World!")
  })
})
```

## Code Style Guidelines

### Biome (lint + format)

Configuration in `biome.json`. Key rules:

- **Quotes**: double (`"`)
- **Semicolons**: as-needed (only when required)
- **Trailing commas**: always
- **Line width**: 100
- **Indent**: 2 spaces
- **Line ending**: lf

### Lint rules

- `noUnusedVariables`: error
- `noExplicitAny`: warn
- `noNonNullAssertion`: warn
- Import organizing: on (auto-sorted by Biome)

### Conventions

- **Single entry point**: `src/index.ts` — all public API is re-exported from here
- **Internal modules**: `src/internal/` — not part of public API, mark with `@internal` JSDoc
- **File naming**: `kebab-case.ts` for files, `camelCase` for functions/variables, `PascalCase` for types/interfaces
- **Imports**: always use `.ts` extension in import paths (required by `verbatimModuleSyntax` + `allowImportingTsExtensions`)
- **Type imports**: use `import type` when importing types only (for `verbatimModuleSyntax`)
- **Pure functions**: prefer pure functions over classes unless state is needed

## Build and Deployment

### Build

```bash
bun run build    # runs tsdown
```

Output (ESM-only):

```
dist/
├── index.mjs        # ESM bundle
├── index.mjs.map    # sourcemap
├── index.d.mts      # type declarations
└── index.d.mts.map  # declaration map
```

### Build config

`tsdown.config.ts`:
- Entry: `./src/index.ts`
- Format: ESM only
- DTS: true (generates `.d.mts`)
- Sourcemaps: true

### CI Pipeline

`.github/workflows/ci.yml` runs on push/PR to `main`:
1. `bun run typecheck`
2. `bun run lint`
3. `bun test`
4. `bun run build`

## Versioning and Release

Uses [Changesets](https://github.com/changesets/changesets).

### Creating a changeset

When making changes to `src/` or `test/` that should be released, create a changeset:

```bash
bunx changeset
```

Or write the file directly:

```bash
cat > .changeset/$(date +%s)-description.md << 'EOF'
---
"@zfadhli/base-ts": patch   # or minor, or major
---

A user-facing summary of the change.
EOF
```

### Bump type mapping

| Conventional commit type | Changeset bump |
|---|---|
| `feat` + `BREAKING CHANGE` | major |
| `feat` | minor |
| `fix`, `perf`, `refactor`, `docs`, `chore`, `style`, `test` | patch |

### Full release flow

1. Changeset files are committed alongside code changes on `main`
2. Run `bunx changeset version` to consume `.md` files and bump versions
3. Create `release/v*.*.*` branch and PR against `main`
4. Merge PR to `main`
5. `bun run build && bunx changeset publish` to publish to npm, create tag, and GitHub release
6. Tag format: `v*.*.*`

### Release workflow

`.github/workflows/release.yml` automates npm publish on pushes to `main` when changesets are detected.

## Git Hooks (Lefthook)

Configuration in `lefthook.yml`.

### pre-commit (runs in parallel)

1. `biome check --staged --write --unsafe` on `*.{ts,tsx,js,jsx,json,jsonc}` files + auto-stage fixed files
2. `tsc --noEmit` on `*.{ts,tsx}` files

### pre-push (runs in parallel)

1. `bun test`
2. `bun run build`

### Skip hooks

```bash
LEFTHOOK=0 git commit -m "wip"    # skip pre-commit hooks
LEFTHOOK=0 git push               # skip pre-push hooks
```

## Project Structure

```
.
├── .changeset/config.json     # Changeset config
├── .editorconfig              # Editor settings
├── .github/workflows/
│   ├── ci.yml                 # Typecheck → lint → test → build
│   └── release.yml            # NPM publish on main
├── .gitignore
├── AGENTS.md                  # This file
├── CHANGELOG.md               # Auto-generated release notes
├── LICENSE                    # MIT
├── README.md                  # Human-facing docs
├── biome.json                 # Lint + format rules
├── lefthook.yml               # Git hooks
├── package.json               # Package manifest + scripts
├── tsconfig.json              # Strict TS config (ESNext, bundler)
├── tsdown.config.ts           # Build config (ESM-only, dts)
├── src/
│   ├── index.ts               # Public API — re-export from here
│   └── internal/utils.ts      # Internal implementation
├── test/
│   └── index.test.ts          # Tests using bun:test
└── dist/                      # Build output (gitignored)
```

## Important Notes

- **Do not modify `dist/` directly** — it's generated by `bun run build`
- **Do not modify `CHANGELOG.md` manually** — it's auto-generated by changesets
- **Changeset files** (`.changeset/*.md`) are gitignored (committed only during `bunx changeset version`)
- **`package.json` `version` field** — update via changesets, not manually
- **Bun is the package manager** — don't use `npm` or `pnpm` commands. `bun.lock` must stay in sync
- **The `tmp/` directory** is gitignored — use it for scratch files
