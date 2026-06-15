# @zfadhli/base-ts

A production-ready TypeScript library starter template.

## Stack

| Tool | Role |
|---|---|
| [Bun](https://bun.sh) | Runtime, package manager, test runner |
| [TypeScript](https://www.typescriptlang.org) | Type system (strict mode, `isolatedDeclarations`) |
| [Biome](https://biomejs.dev) | Linter + formatter (replaces ESLint + Prettier) |
| [tsdown](https://tsdown.dev) | Library bundler (Rolldown-based, ESM + CJS + dts) |
| [Lefthook](https://lefthook.dev) | Git hooks manager |
| [Changesets](https://github.com/changesets/changesets) | Versioning and changelog |
| GitHub Actions | CI (quality checks) + release (npm publish) |

## Getting started

### Rename the package and set public

Before publishing, you'll also need to set `"private": false` in `package.json`:

```diff
+ "private": false,
```

### Rename the package

Update `package.json`:

```diff
- "name": "@zfadhli/base-ts",
+ "name": "@your-scope/your-library",
```

Update `repository.url`:

```diff
- "url": ""
+ "url": "https://github.com/your-org/your-repo"
```

### Install

```bash
bun install
```

## Scripts

| Script | Command | Description |
|---|---|---|
| `bun run build` | `tsdown` | Build library (ESM + CJS + d.ts) |
| `bun run dev` | `tsdown --watch` | Watch mode rebuild |
| `bun run typecheck` | `tsc --noEmit` | Type-check all source and test files |
| `bun run lint` | `biome check .` | Check lint + formatting |
| `bun run lint:fix` | `biome check --write .` | Auto-fix lint + formatting |
| `bun run format` | `biome format --write .` | Format only |
| `bun test` | `bun test` | Run tests |
| `bun run test:watch` | `bun test --watch` | Watch mode tests |
| `bun run ci` | `typecheck && lint && test && build` | Full CI pipeline |
| `bun run release` | `build && changeset publish` | Build and publish to npm |

## Git hooks (Lefthook)

- **pre-commit**: Biome lint + TypeScript type-check on staged files
- **pre-push**: Run tests + build

Skip hooks temporarily with `LEFTHOOK=0`:

```bash
LEFTHOOK=0 git commit -m "wip"
```

## Versioning and publishing

This template uses [Changesets](https://github.com/changesets/changesets) for version management.

### Creating a changeset

```bash
bunx changeset
```

Follow the prompts to specify the bump type (patch/minor/major) and write a changelog entry.

### Publishing

```bash
bun run release
```

This builds the library and publishes to npm.

### Automated release (CI)

The release workflow (`.github/workflows/release.yml`) runs on pushes to `main`. It:

1. Builds the library
2. Publishes to npm
3. Creates a GitHub release

**Pre-requisite**: Set `NPM_TOKEN` in your GitHub repository secrets.

## Build output

```
dist/
├── index.mjs        # ESM bundle
├── index.mjs.map    # ESM sourcemap
├── index.d.mts      # ESM type declarations
├── index.d.mts.map  # ESM declaration map
├── index.cjs        # CJS bundle
├── index.cjs.map    # CJS sourcemap
├── index.d.cts      # CJS type declarations
└── index.d.cts.map  # CJS declaration map
```

## Project structure

```
.
├── .changeset/            # Changeset config
├── .github/workflows/
│   ├── ci.yml             # Quality checks on push/PR
│   └── release.yml        # npm publish on main
├── src/
│   ├── index.ts           # Public API entry
│   └── internal/          # Internal implementation
├── test/
│   └── index.test.ts      # Tests (bun:test)
├── biome.json             # Biome configuration
├── lefthook.yml           # Git hooks
├── package.json
├── tsconfig.json          # TypeScript strict config
└── tsdown.config.ts       # Build configuration
```
