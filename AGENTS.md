# AGENTS.md

Repository guidance for agentic coding tools working in this codebase.

## Scope
- Applies to the whole repository root.
- This repo contains two independent projects, each with its own package manager.
- Run commands from the correct project directory.

## Repository layout
- `portfolio-astro/` - Astro frontend app.
- `studio-portfolio/` - Sanity Studio content project.
- Root has no workspace runner (`package.json` is not at root).

## Package manager rules
- Use `npm` in `portfolio-astro/` (lockfile: `package-lock.json`).
- Use `pnpm` in `studio-portfolio/` (lockfile: `pnpm-lock.yaml`).
- Do not mix package managers unless explicitly requested.

## Setup

### Astro app (`portfolio-astro/`)
```bash
npm install
cp .env.example .env
```

### Sanity Studio (`studio-portfolio/`)
```bash
pnpm install
```

## Build / lint / test commands

### `portfolio-astro/`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Astro CLI passthrough: `npm run astro -- <args>`
- Recommended checks: `npm run astro -- check`

Lint/testing status:
- No dedicated lint script in `portfolio-astro/package.json`.
- No test framework/config is currently present.
- Single-test execution is not currently available.

### `studio-portfolio/`
- Dev: `pnpm dev`
- Start: `pnpm start`
- Build: `pnpm build`
- Deploy Studio: `pnpm deploy`
- Deploy GraphQL: `pnpm deploy-graphql`

Lint/typecheck commands:
- Lint all: `pnpm eslint .`
- Lint autofix: `pnpm eslint . --fix`
- Lint single file: `pnpm eslint schemaTypes/project.ts`
- Type-check project: `pnpm tsc --noEmit`

Testing status:
- No test framework/config is currently present.
- Single-test execution is not currently available.

## Single test guidance (explicit)
- Current state: there are no runnable test suites in either project.
- If you add tests, also add package scripts in that project.
- Suggested future Vitest pattern:
  - All tests: `pnpm vitest run`
  - Single file: `pnpm vitest run path/to/file.test.ts`
  - Single test by name: `pnpm vitest run path/to/file.test.ts -t "test name"`

## Validation workflow

### For `portfolio-astro/` changes
1. `npm run astro -- check`
2. `npm run build`

### For `studio-portfolio/` changes
1. `pnpm eslint .`
2. `pnpm tsc --noEmit`
3. `pnpm build`

### For shared content model changes
1. Validate Studio first (`eslint`, `tsc`, `build`).
2. Validate Astro second (`astro check`, `build`).

## Code style guidelines

### 1) Imports
- Group imports as: external packages first, then local relative imports.
- Prefer existing relative import style over introducing new alias systems.
- Use `import type` for type-only imports in TypeScript where possible.
- Remove unused imports in the same change.
- Keep import blocks compact and sorted by existing local convention.

### 2) Formatting
- Use 2-space indentation.
- Follow file-local semicolon style:
  - `portfolio-astro/` commonly uses semicolons.
  - `studio-portfolio/` omits semicolons (`semi: false`).
- In `studio-portfolio/`, follow Prettier config:
  - `singleQuote: true`
  - `printWidth: 100`
  - `bracketSpacing: false`
- Avoid unrelated formatting-only churn.

### 3) Types
- Both projects use strict TypeScript settings.
- Prefer explicit interfaces/types for content structures.
- Keep Sanity schema, GROQ selections, and frontend types in sync.
- Avoid introducing new `any` unless unavoidable at an integration boundary.
- Prefer explicit return types for exported functions when practical.

### 4) Naming
- Astro layout/components: PascalCase file names (example: `BaseLayout.astro`).
- Astro routes: framework naming (`index.astro`, `[slug].astro`).
- Functions and variables: `camelCase`.
- Type/interface names: PascalCase.
- Sanity field/document ids: lowercase string identifiers (`project`, `publishedAt`).
- CSS classes: kebab-case and token-based naming patterns.

### 5) Error handling
- Fail fast for required route params and missing required records.
- Use clear, actionable error messages (include context like slug/id).
- Gracefully degrade for optional external data (empty arrays/null where appropriate).
- Wrap unsafe URL parsing or external data transforms in `try/catch` with safe fallback.
- Do not silently swallow unexpected failures without intentional fallback behavior.

### 6) Sanity/Astro contract rules
- Schema updates in `studio-portfolio/schemaTypes/` usually require Astro updates.
- When changing schema fields:
  - Update GROQ in `portfolio-astro/src/lib/sanity.ts`.
  - Update TS types in `portfolio-astro/src/types/project.ts`.
  - Update affected page rendering in `portfolio-astro/src/pages/`.
- Keep fields optional until all consumers are migrated.

### 7) File hygiene
- Do not manually edit generated/build outputs:
  - `portfolio-astro/.astro/`
  - `portfolio-astro/dist/`
  - `studio-portfolio/.sanity/`
  - any `node_modules/`
  - `studio-portfolio/tsconfig.tsbuildinfo`
- Do not commit secrets from `.env` files.

## Practical agent notes
- Make focused changes and preserve existing architecture.
- Match the style of the file you are editing (projects differ intentionally).
- Validate only the affected project unless the change crosses project boundaries.
- If conventions are unclear, inspect nearby files and follow precedent.
