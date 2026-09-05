# Personal website

This repository has two independent projects and no root workspace runner:
use **npm in `portfolio-astro/`** and **pnpm in `studio-portfolio/`**. Preserve
their separate lockfiles and formatting conventions.

## Commands

Run from the affected project directory:

| Project | Development | Validation |
|---|---|---|
| Astro | `npm run dev` | `npm run astro -- check`, `npm run build` |
| Studio | `pnpm dev` | `pnpm eslint .`, `pnpm tsc --noEmit`, `pnpm build` |

Inspect the current manifests for available test scripts. Do not invent a
single-test command or install a test framework for a documentation edit.
Validate only the affected project unless the content contract spans both.

## Content contract

When changing `studio-portfolio/schemaTypes/`, keep these Astro consumers in
sync: GROQ in `portfolio-astro/src/lib/sanity.ts`, types in
`portfolio-astro/src/types/project.ts`, and affected pages in
`portfolio-astro/src/pages/`. Keep new fields optional until consumers migrate.
Validate Studio first and Astro second for a shared content-model change.

Keep strict typing and follow file-local styles (Astro commonly uses semicolons;
Studio does not). Do not manually edit `.astro/`, `dist/`, `.sanity/`,
`node_modules/`, or `tsconfig.tsbuildinfo`. Never commit env secrets.
