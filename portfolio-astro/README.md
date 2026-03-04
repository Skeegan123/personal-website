# Portfolio Astro Starter

Static-first Astro starter with Sanity project content support.

## Why this setup

- Astro stays fast and mostly static.
- Sanity project data is fetched at build time.
- No React dependency in the site app.
- Ready to add a separate Sanity Studio and a blog later.

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add env values:

   ```bash
   cp .env.example .env
   ```

3. Run locally:

   ```bash
   npm run dev
   ```

## Environment variables

- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PUBLIC_SANITY_API_VERSION` (defaults to `2025-01-01`)
- `PUBLIC_SANITY_USE_CDN` (`true` by default; set to `false` for freshest data)

## Expected Sanity project document shape

The Astro app currently expects `project` documents with these fields:

- `title` (string)
- `slug` (slug)
- `summary` (text)
- `stack` (array of strings, optional)
- `repoUrl` (url, optional)
- `liveUrl` (url, optional)
- `publishedAt` (datetime, optional)

## Routes included

- `/` project list
- `/projects/[slug]` project detail pages generated statically

## Next logical additions

- Add a dedicated Sanity Studio in a sibling folder for editing content.
- Add `post` schema + Astro blog routes when you are ready.
