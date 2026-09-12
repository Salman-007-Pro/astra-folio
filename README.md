# Salman Asif · The Kinetic Garden

A full-stack engineer’s portfolio with a procedural Three.js garden, detailed case studies, and an interactive arcade. Built with Astro, React, TypeScript, and an optional Payload CMS.

The site delivers readable static HTML first. The 3D world and games load as enhancements. Run the complete portfolio from one JSON file, then connect Payload when you want an editorial workflow.

## Features

- One lazy React Three Fiber canvas shared by the homepage hero and desktop work section
- Work filters, seven-part case studies with scroll-following navigation, engineering notes, RSS, and a quiet reading view
- Professional portrait, CV summary, PDF download, and worldwide remote contact channels
- Mobile navigation drawer with keyboard focus handling and scroll restoration
- **Card flip, Signal snake, Orbit shooter, and Racing Classic** on the homepage and `/play`, with encouraging win/loss messages
- **Garden, Ocean, and Ember** palettes, each with light and dark colors; light and dark selections are remembered independently
- **Fifteen visual styles** with previews, smooth switching, and a saved device preference: Original, Cyberpunk, Holographic, Pixel / Game, Parallax, Liquid Glass, Neumorphism, Paper / Scrapbook, Editorial, Aurora, Cartoon / Illustrative, Scrollytelling, Retro / Vintage, Claymorphism, and Hand-drawn / Doodle
- Reduced motion, optional sound, blueprint mode, and adaptive 3D quality
- Reusable **[`content/portfolio.json`](content/portfolio.json)** for identity, copy, work, contact details, CV, and game quotes
- Optional **Payload 3 + PostgreSQL** for drafts, publishing, media, and validated public content
- Biome formatting, TypeScript, Vitest, Playwright, axe accessibility checks, and a compressed JavaScript budget

## Run locally

Requirements: **Node 22.12+** (Node 24 recommended) and **pnpm 10.32.1**. Google Chrome is needed for browser tests. PostgreSQL is only needed for the optional CMS; Docker Compose can provide it locally.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321). No environment file or CMS is required for the static version. An existing `CMS_URL` in `apps/web/.env` selects CMS content instead.

## Make it yours

Edit [`content/portfolio.json`](content/portfolio.json), replace the portrait and PDF, then run `pnpm check` and `pnpm build`.

| JSON section | Controls                                                                        |
| ------------ | ------------------------------------------------------------------------------- |
| `profile`    | Identity, role, social links, contact channels, and remote availability         |
| `site`       | Branding, URL, hero/About copy, education, languages, portrait, default palette |
| `site.games` | Arcade visibility, introduction, and win/loss quote lists                       |
| `projects`   | Work cards, filters, case studies, and architecture labels                      |
| `experience` | Career timeline and supporting details                                          |
| `posts`      | Writing metadata and restricted Markdown content                                |
| `resume`     | PDF URL, filename, date, and download availability                              |

Shared Zod contracts validate JSON during builds. Keep the structure and replace values with your own verified information. Follow the **[customization guide](docs/customization.md)** for assets, themes, content relationships, and domains.

## Games and appearance

| Game           | Goal                                                         | Controls                                                                           |
| -------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Card flip      | Match six pairs within 18 moves                              | Tap/click; Tab and Enter. No timer                                                 |
| Signal snake   | Collect ten signals without a collision                      | Arrow keys/WASD with board focused, or direction buttons; Space pauses             |
| Orbit shooter  | Clear fifteen targets before five escape                     | Tap/click targets; Tab and Enter/Space                                             |
| Racing Classic | Dodge traffic and pass twenty cars through five speed levels | Left/right arrows or A/D with screen focused; touch steering buttons; Space pauses |

Rounds start on request and pause when the browser loses focus, the game leaves view, or a site dialog opens. Resume and restart are explicit. Switching games starts a fresh round. Results choose a message from your JSON quote lists. Racing Classic remembers its best score on this device; scores are not sent to a server.

Open **Styles** to choose one of fifteen visual treatments or select a palette. **Night Shift** changes mode. Each mode keeps its own palette selection in local storage. The initial mode follows the visitor’s system preference when no choice is saved. `site.defaultPalette` sets the initial palette for both modes. Original is the default visual style. Style selection persists across routes and reloads, independently of the palettes. Switching uses a crossfade, with a fallback for browsers without View Transitions. Motion off and reduced-motion preferences disable decorative animation; Liquid Glass then stays frosted and Parallax stays still.

## Payload configuration

Payload is optional and runs as a **separate Node service**. Static website hosting does not run the CMS, PostgreSQL, or uploaded-file storage.

The **[Payload setup guide](docs/payload-setup.md)** covers every environment variable, local PostgreSQL, the first admin, seeding, PDF uploads, API keys, migrations, R2 storage, and publishing.

1. Create `apps/cms/.env` from its example and configure the database and a random secret.
2. Run `pnpm cms:doctor`, generate the import map, and start `pnpm cms:dev`.
3. Create your first administrator at [http://localhost:3001/admin](http://localhost:3001/admin).
4. Seed an empty development CMS or enter content manually; review and publish it.
5. Set `CMS_URL` in `apps/web/.env`, then rebuild the frontend.

`cms:doctor` validates environment values without connecting to a database or changing data. Seeding is separately enabled. No CMS credentials are included in this repository.

### Frontend environment

Use [`apps/web/.env.example`](apps/web/.env.example) as a template. Edit existing environment files rather than overwriting them.

| Variable          | Purpose                                                                       |
| ----------------- | ----------------------------------------------------------------------------- |
| `PUBLIC_SITE_URL` | Canonical website origin; use your HTTPS domain in production                 |
| `CMS_URL`         | Server-only build-time CMS origin. Leave empty for JSON content               |
| `PUBLIC_CMS_URL`  | Optional public CMS origin for refreshing CV download metadata in the browser |
| `CMS_READ_TOKEN`  | Optional server-only Payload Users API key. Never use a `PUBLIC_` prefix      |

`CMS_URL` selects a complete published snapshot; it does not merge CMS records with JSON arrays. A configured CMS that is unavailable or invalid fails the build. Deploy only successful builds so the previous release stays available.

## Deploy your own domain

1. Set `PUBLIC_SITE_URL=https://your-domain.example` in the hosting build environment, or `apps/web/.env` for a local build. Also update `site.url` when reusing the project.
2. Run `pnpm build` and `pnpm budget`.
3. Upload root **`dist/`** to your static host and connect your domain there.

Keep the output structure intact. Use normal static HTML routing with `404.html`, not a universal SPA rewrite. Payload needs its own Node deployment.

Built JS/CSS and optimized portraits use content-hashed filenames. HTML should revalidate so visitors discover changed asset URLs. [`apps/web/public/_headers`](apps/web/public/_headers) supplies policies for hosts supporting that format; configure equivalent rules elsewhere. Raw `public/` files retain their names: rename replacement PDFs/images and update their JSON URLs for guaranteed versioned URLs. Cache busting still requires uploading the new build.

CMS edits reach static pages **after a rebuild and deployment**. Optional live CV metadata is the exception. See [publishing and rebuilds](docs/payload-setup.md#publishing-and-automatic-rebuilds) before enabling webhooks.

## Commands

| Command             | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `pnpm dev`          | Astro development server at `127.0.0.1:4321`                |
| `pnpm build`        | Build and stage root `dist/`                                |
| `pnpm check`        | Astro and CMS TypeScript checks                             |
| `pnpm test`         | Content, game engines, and webhook unit tests               |
| `pnpm test:e2e`     | Playwright + axe against a running local preview            |
| `pnpm budget`       | Compressed JavaScript budget after building                 |
| `pnpm format`       | Biome for source; Prettier for Markdown/MDX/YAML            |
| `pnpm format:check` | Check formatting without edits                              |
| `pnpm cms:doctor`   | Validate CMS env without printing secrets                   |
| `pnpm cms:dev`      | Payload development server on port 3001                     |
| `pnpm cms:seed`     | Bootstrap empty development CMS; requires `ALLOW_SEED=true` |
| `pnpm cms:build`    | Build the separate production CMS                           |
| `pnpm cms:start`    | Start the built CMS on port 3001                            |

Test a production frontend build:

```sh
pnpm --filter @garden/web exec astro dev stop
pnpm build
pnpm --filter @garden/web exec astro preview --host 127.0.0.1 --port 4321
pnpm test:e2e
pnpm --filter @garden/web exec astro preview stop
```

Astro also supports `astro dev status` and `astro dev logs`. Restart the daemon if Windows HMR retains a missing-import error after creating a file.

## Project structure

```text
content/portfolio.json          Reusable static content
apps/web/                       Astro + React games + Three.js garden
apps/cms/                       Payload on Next.js, PostgreSQL, optional R2
packages/content-schema/        Shared validation and Markdown policy
packages/design-tokens/         Base design tokens
tooling/scripts/                Build staging, budget, CMS doctor, webhook verifier
tests/                          Unit, responsive, browser and accessibility checks
docs/                           Configuration and architecture guides
```

Pages: `/`, `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`, `/about`, `/play`, `/reading`, `/cv`, and `/contact`. Discovery: `/sitemap.xml`, `/rss.xml`, `/robots.txt`, `/llms.txt`, and `/profile.json`.

## Quality and content

CI runs formatting, type checks, unit tests, static build, JS budget, and browser tests. Biome 2.5.13 formats JS/TS/JSX/TSX, JSON, CSS, and Astro. Prettier handles Markdown/MDX/YAML. Formatting commands do not enable linting or import organization.

The garden uses procedural geometry, caps quality, pauses offscreen, and respects reduced motion. Reading pages do not load the 3D world. Games support touch and keyboard; dialogs restore focus. No analytics ship by default. Automated checks do not replace physical-device testing or production field performance measurements.

Career facts follow the owner-provided CV and subsequent contact updates. Case-study diagrams are conceptual; there are no private employer screenshots or invented metrics. Replace personal data and review all copy when reusing the project. Markdown rejects imports, JSX, raw HTML, executable expressions, and unsafe links. Public snapshots exclude drafts and authentication records.

## Guides

- [Customize content, assets, games, and themes](docs/customization.md)
- [Payload, env, media, and deployment](docs/payload-setup.md)
- [Architecture](docs/architecture.md)
- [Content model](docs/content-model.md)
- [Motion system](docs/motion-system.md)
- [Performance budget](docs/performance-budget.md)
- [Platform decision](docs/decisions/001-platform.md)
