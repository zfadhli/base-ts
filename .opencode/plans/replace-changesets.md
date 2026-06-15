# Plan: Replace Changesets with custom release flow

## Why

`@changesets/cli` assumes npm publishing. Since this project is `"private": true`,
changeset files accumulate and `changeset version` / `changeset publish` do nothing.
A simpler approach: derive the version bump from conventional commits since the
last tag — no intermediate `.md` files, no extra dependency.

## Steps

### Phase 1 — Remove changesets

1. **Remove `.changeset/` directory** — delete the entire directory, including
   `config.json` and any leftover `.md` files

2. **Remove `@changesets/cli` from `package.json`** — delete the devDependency
   entry and remove the `"release"` script entry (will readd in phase 2)

3. **Remove `publishConfig` from `package.json`** — no longer needed

4. **Update `.gitignore`** — remove the `# Changesets` comment block

### Phase 2 — Implement custom release script

5. **Create `scripts/release.sh`** — a bash script that automates the full
   release flow:

   - Get latest tag: `git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"`
   - Scan commits: `git log <tag>..HEAD --oneline`
   - Classify each commit by conventional commit type to determine bump:
     - `feat.*!:*` or `BREAKING CHANGE` → major
     - `feat:` → minor
     - everything else → patch
   - Pick the highest bump among all commits
   - Compute new version from current using `node -e` semver bump
   - Update `package.json` version field
   - Update `CHANGELOG.md` — prepend a new section with today's date,
     listing commits grouped by type (Features, Bug Fixes, etc.)
     with links to GitHub commits
   - Print proposed changelog, ask user for confirmation
   - `git add -A && git commit -m "Release v<new>"`
   - `git tag v<new>`
   - Create GitHub Release: extract the changelog section for this version
     and pass to `gh release create`

7. **Add `"release"` script** to `package.json`:
   ```json
   "release": "bash scripts/release.sh"
   ```

### Phase 3 — Update docs

8. **Update AGENTS.md** — replace "Versioning and Release" section with the
   custom release flow. Remove changeset references everywhere.

9. **Update `/git-commit` flow** — remove the changeset generation step
   (step 3). Now it's just: stage → analyze → commit.

## Verification

- `bun run ci` — passes
- No `.changeset/` directory
- No `@changesets/cli` in `bun pm ls`
- `bash scripts/release.sh` proposes correct version from recent commits
