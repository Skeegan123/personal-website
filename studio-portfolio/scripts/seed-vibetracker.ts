import {createReadStream} from 'node:fs'
import {basename} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

type PortableTextChild = {
  _key: string
  _type: 'span'
  text: string
  marks: string[]
}

type SeedProjectDocument = {
  _id: string
  _type: 'project'
  title: string
  slug: {_type: 'slug'; current: string}
  summary: string
  role: string
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  externalLinks: {_key: string; label: string; url: string}[]
  image?: {
    _type: 'image'
    asset: {
      _type: 'reference'
      _ref: string
    }
    alt: string
  }
  featured: boolean
  featuredOrder?: number
  publishedAt: string
  body: Record<string, unknown>[]
  challenges: string[]
  learnings: string[]
}

let keyIndex = 0

function key(prefix: string) {
  keyIndex += 1
  return `${prefix}${keyIndex.toString(36)}`
}

function block(
  style: 'normal' | 'h2' | 'h3' = 'normal',
  children: PortableTextChild[],
  listItem?: 'bullet' | 'number',
) {
  return {
    _key: key('b'),
    _type: 'block',
    style,
    markDefs: [],
    children,
    ...(listItem ? {listItem} : {}),
  }
}

function span(text: string, marks: string[] = []): PortableTextChild {
  return {
    _key: key('s'),
    _type: 'span',
    text,
    marks,
  }
}

function paragraph(text: string) {
  return block('normal', [span(text)])
}

function heading(text: string) {
  return block('h2', [span(text)])
}

function bullet(text: string) {
  return block('normal', [span(text)], 'bullet')
}

function codeBlock(filename: string, language: string, code: string) {
  return {
    _key: key('c'),
    _type: 'codeBlock',
    filename,
    language,
    code,
  }
}

async function findOrUploadImage(path: string) {
  const filename = basename(path)
  const existing = await client.fetch<{_id: string} | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}',
    {filename},
  )

  if (existing?._id) {
    return existing._id
  }

  const asset = await client.assets.upload('image', createReadStream(path), {filename})
  return asset._id
}

async function seed() {
  const imageAssetId = await findOrUploadImage('/Users/keegangaffney/Development/vibetracker/public/OpenGraph.png')
  const weddingImageAssetId = await findOrUploadImage(
    '/Users/keegangaffney/Development/keegan-lexi-wedding-site/public/images/logo.png',
  )
  const multistreamersImageAssetId = await findOrUploadImage(
    '/Users/keegangaffney/Development/personal-website/portfolio-astro/public/multistreamers-ui-cover.png',
  )

  const image = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: imageAssetId,
    },
    alt: 'VibeTracker open graph artwork showing the VibeTracker brand.',
  } as const

  const weddingImage = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: weddingImageAssetId,
    },
    alt: 'Keegan and Lexi wedding website logo.',
  } as const

  const multistreamersImage = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: multistreamersImageAssetId,
    },
    alt: 'MultiStreamers brand artwork showing a grid of livestream tiles.',
  } as const

  const projects: SeedProjectDocument[] = [
    {
      _id: 'drafts.project-vibetracker',
      _type: 'project',
      title: 'VibeTracker',
      slug: {_type: 'slug', current: 'vibetracker'},
      summary:
        'A public sentiment tracker for AI models that turns everyday model feedback into live leaderboards, model pages, trends, and use-case comparisons.',
      role: 'Founder / Full-Stack Developer',
      stack: [
        'Next.js 16',
        'React 19',
        'TypeScript',
        'Convex',
        'WorkOS AuthKit',
        'Tailwind CSS 4',
        'Vitest',
      ],
      repoUrl: 'https://github.com/Skeegan123/vibetracker',
      liveUrl: 'https://vibetracker.app',
      externalLinks: [
        {_key: key('l'), label: 'Docs', url: 'https://vibetracker.app/docs'},
        {_key: key('l'), label: 'API Reference', url: 'https://vibetracker.app/docs/api/opinions'},
        {_key: key('l'), label: 'CLI Docs', url: 'https://vibetracker.app/docs/cli'},
      ],
      image,
      featured: true,
      featuredOrder: 10,
      publishedAt: '2026-05-01',
      body: [
        paragraph(
          'VibeTracker is built around a simple premise: benchmarks are useful, but they do not always capture how models feel in day-to-day use. The product gives people a fast way to report whether a model feels better, worse, or mixed for the work they are actually doing.',
        ),
        paragraph(
          'The app combines public read paths with anonymous-friendly contribution flows. Visitors can scan ranked models, drill into provider and model pages, compare sentiment by use case, and submit lightweight opinions without making account creation the first step.',
        ),
        heading('What it does'),
        bullet('Ranks AI models by community sentiment with sample counts and trend signals.'),
        bullet('Shows model detail pages with sentiment history, recent submissions, and use-case breakdowns.'),
        bullet('Supports anonymous score submissions while reserving stronger trust controls for higher-risk actions.'),
        bullet('Exposes API and CLI surfaces so feedback can be submitted from external tools and terminal workflows.'),
        heading('System design'),
        paragraph(
          'The project keeps the frontend, backend, auth, and data model in one TypeScript codebase. Next.js handles the public product surface and route handlers, Convex owns realtime data and aggregate read models, and WorkOS provides identity where authenticated actions are useful.',
        ),
        paragraph(
          'A lot of the engineering work sits in the product edges: making anonymous sessions reliable, keeping leaderboard reads fast, preventing internal validation details from leaking to users, and designing abuse controls that do not destroy low-friction participation.',
        ),
        codeBlock(
          'API example',
          'bash',
          `curl -X POST 'https://vibetracker.app/api/v1/opinions' \\
  -H 'Authorization: Bearer $VIBETRACKER_API_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "model": "gpt-4o",
    "score": 1,
    "useCase": "coding"
  }'`,
        ),
      ],
      challenges: [
        'Balancing anonymous-first participation with abuse prevention and moderation needs.',
        'Designing leaderboard scores that account for sentiment, recency, and sample size instead of a naive average.',
        'Keeping browser, API, and CLI submission paths consistent across Next.js route handlers and Convex functions.',
      ],
      learnings: [
        'Low-friction contribution products need trust controls that can escalate without making the default path feel heavy.',
        'Aggregated product surfaces are easier to reason about when raw submissions and precomputed hot-path tables are explicitly separated.',
        'Public-safe errors matter: validation details that are useful to engineers can be confusing or leaky for end users.',
      ],
    },
    {
      _id: 'drafts.project-vibetracker-cli',
      _type: 'project',
      title: 'Vibetracker CLI',
      slug: {_type: 'slug', current: 'vibetracker-cli'},
      summary:
        'A command-line companion for VibeTracker that lets developers authenticate, submit model sentiment, and script feedback from terminal workflows.',
      role: 'CLI / API Developer',
      stack: ['Node.js', 'TypeScript', 'VibeTracker API', 'WorkOS AuthKit', 'Convex'],
      repoUrl: 'https://github.com/Skeegan123/vibetracker-cli',
      externalLinks: [
        {_key: key('l'), label: 'npm', url: 'https://www.npmjs.com/package/vibetracker-cli'},
        {_key: key('l'), label: 'CLI Docs', url: 'https://vibetracker.app/docs/cli'},
        {_key: key('l'), label: 'API Docs', url: 'https://vibetracker.app/docs/api/opinions'},
      ],
      image,
      featured: false,
      publishedAt: '2026-05-01',
      body: [
        paragraph(
          'Vibetracker CLI brings the VibeTracker contribution model into the terminal. It is aimed at developers and power users who notice model quality while they are already working in command-line tools, scripts, or CI environments.',
        ),
        paragraph(
          'The CLI supports browser-based login, API-key authentication, local credential status, configurable server targets, JSON output, and sentiment submission with optional context such as use case, interface, tool ID, and comments.',
        ),
        heading('Example workflow'),
        codeBlock(
          'Terminal',
          'bash',
          `npm install -g vibetracker-cli
vtcli auth login
vtcli opinion add --model gpt-5.4 --score 1 --use-case coding --interface api`,
        ),
        heading('Why it matters'),
        paragraph(
          'The web app captures casual public feedback, while the CLI makes the same data model useful in the places heavy AI users already work. That creates a path for richer, more timely model-quality signals without forcing every contribution through a browser UI.',
        ),
      ],
      challenges: [
        'Designing auth flows that work both interactively through a browser and non-interactively with API keys.',
        'Keeping CLI flags aligned with the public API without duplicating product rules in too many places.',
        'Making output readable by humans while still supporting scriptable JSON responses.',
      ],
      learnings: [
        'A small CLI can be a strong extension of a web product when it maps directly to real user workflow moments.',
        'API design gets sharper when a CLI has to expose the same concepts through concise flags and useful errors.',
      ],
    },
    {
      _id: 'drafts.project-multistreamers',
      _type: 'project',
      title: 'MultiStreamers',
      slug: {_type: 'slug', current: 'multistreamers'},
      summary:
        'A browser-based multi-stream viewer for watching Twitch and YouTube livestreams together, with URL-driven stream lists, chat tabs, and automatic 16:9 layout optimization.',
      role: 'Creator / Frontend Developer',
      stack: ['JavaScript', 'jQuery', 'jQuery UI', 'Firebase Hosting', 'Twitch Embed API', 'YouTube Embed API'],
      repoUrl: 'https://github.com/Skeegan123/multistream',
      liveUrl: 'https://multistreamers.com',
      externalLinks: [{_key: key('l'), label: 'Example Stream', url: 'https://multistreamers.com/@LofiGirl=jfKfPfyJRdk'}],
      image: multistreamersImage,
      featured: true,
      featuredOrder: 20,
      publishedAt: '2023-01-01',
      body: [
        paragraph(
          'MultiStreamers is a focused web app for people who want to watch multiple livestreams at once. Users can build a shared URL out of Twitch channel names and YouTube livestream IDs, then open a single page that embeds every stream together.',
        ),
        paragraph(
          'The project came from a practical gap: MultiTwitch-style viewing was useful, but it did not cover the Twitch plus YouTube workflow I wanted. MultiStreamers keeps the interface lightweight and lets the URL itself become the shareable state.',
        ),
        heading('What it does'),
        bullet('Embeds any number of Twitch and YouTube livestreams on one page.'),
        bullet('Optimizes the stream grid to maximize 16:9 video size as streams are added, removed, or resized.'),
        bullet('Includes a chat panel with per-stream tabs and mobile behavior that can hide chat when screen space is tight.'),
        bullet('Lets users change streams through the UI or by editing the URL directly.'),
        codeBlock(
          'URL examples',
          'text',
          `https://multistreamers.com/skeegan123/
https://multistreamers.com/@LofiGirl=jfKfPfyJRdk`,
        ),
      ],
      challenges: [
        'Keeping embedded video and chat panes usable while the number of streams changes dynamically.',
        'Supporting both Twitch channel embeds and YouTube livestream embeds with a compact URL format.',
        'Maximizing visible video area while preserving 16:9 aspect ratios across different browser sizes.',
      ],
      learnings: [
        'URL-driven state is powerful for small tools because it makes sharing and restoring sessions almost free.',
        'Simple layout math can create a much better experience than a fixed grid when media count changes often.',
      ],
    },
    {
      _id: 'drafts.project-wedding-rsvp-system',
      _type: 'project',
      title: 'Wedding RSVP System',
      slug: {_type: 'slug', current: 'wedding-rsvp-system'},
      summary:
        'A private wedding website and guest-management system with personalized RSVP links, short invitation codes, CSV guest import, admin tracking, and a code-gated photo gallery.',
      role: 'Full-Stack Developer',
      stack: [
        'Next.js 15',
        'React',
        'TypeScript',
        'Clerk',
        'Supabase',
        'PostgreSQL',
        'Drizzle ORM',
        'Tailwind CSS',
        'Cloudinary',
      ],
      externalLinks: [],
      image: weddingImage,
      featured: true,
      featuredOrder: 30,
      publishedAt: '2025-03-01',
      body: [
        paragraph(
          'The wedding RSVP system is a private full-stack app I built for my own wedding. Instead of sending guests to a generic form, each invitation gets a short personalized code that opens the correct RSVP page and preloads the invited guests.',
        ),
        paragraph(
          'The admin side manages invitations, guests, plus-one limits, viewed status, RSVP submission status, and bulk imports from a guest-list CSV. The guest-facing flow keeps the experience simple: open the link, confirm attendance for each guest, add allowed plus ones, and submit.',
        ),
        heading('What it does'),
        bullet('Generates short invitation codes for personalized RSVP URLs.'),
        bullet('Imports invitations and guests from CSV into Supabase-backed Postgres tables.'),
        bullet('Tracks whether invitations were viewed and whether RSVPs were submitted.'),
        bullet('Supports guest attendance, dietary restrictions, plus ones, and a thank-you flow.'),
        bullet('Adds a code-gated guest photo upload/gallery flow with rate limiting.'),
        heading('Why it was useful'),
        paragraph(
          'This was not a portfolio toy problem. It had to work for real guests, handle real invitation data, and give us operational visibility while planning the wedding. The useful parts were the unglamorous ones: import reliability, clear admin filters, short links that were easy to print as QR codes, and safe fallbacks when guests made changes.',
        ),
      ],
      challenges: [
        'Turning a guest-list spreadsheet into normalized invitations and guest rows without losing plus-one limits.',
        'Designing personalized links that were short enough for QR codes but still mapped reliably to the right invitation.',
        'Separating public guest access from admin-only management while keeping the RSVP flow low-friction.',
      ],
      learnings: [
        'Small internal tools benefit from the same production thinking as public apps when real people depend on them.',
        'Admin visibility matters as much as the guest form when the workflow includes follow-up and event planning.',
        'Personalized URLs can remove a lot of friction for non-technical users.',
      ],
    },
  ]

  for (const project of projects) {
    await client.createOrReplace(project)
    console.log(`Seeded draft project: ${project.title}`)
  }
}

seed().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
