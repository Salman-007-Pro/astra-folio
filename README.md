# Salman Asif · The Kinetic Garden

Semantic-first portfolio for Muhammad Salman Asif: a static Astro site, one lazy Three.js garden, public case studies, writing, a recruiter CV view, and a separately deployed Payload CMS.

The public site is HTML first. The WebGL scene is an enhancement, never the only way to read the work. Career facts come from the owner-supplied September 2026 CV. The public PDF is that file, unchanged.

## Features

- Immersive homepage with one React Three Fiber canvas that moves between the hero and the desktop work biome
- Semantic routes for work, case studies, writing, about, reading, contact, and CV
- Recruiter-friendly CV page with a direct PDF download and optional live resume metadata
- Night Shift, blueprint, reduced-motion, and quality preferences stored locally
- Payload CMS for projects, experience, skills, writing, experiments, media, profile, and resume settings
- Strict build-time content validation — a configured-but-unavailable CMS fails the build instead of publishing partial data
- Restricted Markdown/MDX pipeline, RSS, sitemap, robots, `llms.txt`, and `profile.json`
- Performance budget check on static JS; reading routes never import the 3D world

## Architecture

```text
pnpm workspace
├── apps/web              Astro 7 static site + one R3F island
├── apps/cms              Payload 3 on Next.js + PostgreSQL
├── packages/content-schema   Shared Zod contracts and MDX policy
├── packages/design-tokens    Theme tokens and CSS
└── tooling/              Stage-site, budget, webhook verifier
```

`apps/web` is the public surface. It builds to static HTML and stages output into root `dist/` for hosting.

`apps/cms` is a separate Node service. It owns drafts, versions, media, and the `/api/portfolio` snapshot. Static Sites hosting publishes only the Astro frontend.

Without `CMS_URL`, the site uses the verified CV-backed bootstrap snapshot. With `CMS_URL`, the build loads and validates `/api/portfolio`. Invalid or unreachable CMS content fails the build on purpose.

```text
Owner CV ──► bootstrap snapshot ──► Astro build ──► dist/
                 ▲
Payload admin ───┴── /api/portfolio (validated public fields only)
                 └── /api/resume   (optional runtime CV refresh)
```

See [docs/architecture.md](docs/architecture.md) and [docs/decisions/001-platform.md](docs/decisions/001-platform.md).

## Requirements

- Node 22.12 or newer (Node 24 in CI)
- pnpm 10.32.1
- Google Chrome for the Playwright browser suite
- Docker, only if you run the CMS locally (PostgreSQL 17)

## Quick start

```sh
pnpm install
pnpm dev
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321). The homepage, work, writing, and CV routes work from bootstrap content — no CMS required.

```sh
pnpm check          # Astro + CMS typecheck
pnpm test           # Unit contracts and webhook verifier
pnpm test:e2e       # Browser checks against a local preview
pnpm build          # Static site → root dist/
pnpm budget         # Compressed JS budget for the public build
```

The browser suite uses an installed Google Chrome in isolated test contexts.

## Public routes

| Route                                   | Purpose                                                               |
| --------------------------------------- | --------------------------------------------------------------------- |
| `/`                                     | Immersive homepage: hero, selected work, experience, writing, contact |
| `/work`                                 | Selected work index                                                   |
| `/work/[slug]`                          | Case study                                                            |
| `/writing`                              | Engineering notes and articles                                        |
| `/writing/[slug]`                       | Article                                                               |
| `/about`                                | Profile and approach                                                  |
| `/reading`                              | Calm reading view — no Three.js import                                |
| `/cv`                                   | Recruiter CV, PDF download, optional live resume metadata             |
| `/contact`                              | Remote availability and contact channels                              |
| `/sitemap.xml` `/rss.xml` `/robots.txt` | Discovery                                                             |
| `/llms.txt` `/profile.json`             | Machine-readable profile                                              |

## CMS

The public site has no admin link. Start Payload on port 3001, create the first administrator there, then publish content.

```sh
docker compose up -d postgres
cp apps/cms/.env.example apps/cms/.env
# Set a PAYLOAD_SECRET of at least 32 characters.
pnpm --filter @garden/cms generate:importmap
pnpm cms:dev
```

Open [http://localhost:3001/admin](http://localhost:3001/admin).

Then point the site at the CMS:

```sh
cp apps/web/.env.example apps/web/.env
```

Set `CMS_URL` and `PUBLIC_CMS_URL` to the CMS origin. Leave `CMS_URL` empty to keep using bootstrap content.

Production CMS deployments need migrations, persistent storage, and backups:

```sh
pnpm --filter @garden/cms migrate:create
pnpm --filter @garden/cms migrate
pnpm cms:build
```

Publishing can notify `BUILD_WEBHOOK_URL` with an HMAC-SHA256 signature of `timestamp + '.' + rawBody`. The repo ships a verifier for an external receiver. There is no unsigned public deploy endpoint. A failed rebuild leaves the previous deployment untouched.

See [docs/content-model.md](docs/content-model.md).

## Environment

`apps/web/.env`

| Variable          | Role                                                            |
| ----------------- | --------------------------------------------------------------- |
| `PUBLIC_SITE_URL` | Canonical public origin                                         |
| `CMS_URL`         | Build-time portfolio snapshot. Omit to use bootstrap content    |
| `PUBLIC_CMS_URL`  | Browser-visible CMS origin for live CV metadata only            |
| `CMS_READ_TOKEN`  | Optional server-only read key. Never prefix this with `PUBLIC_` |

`apps/cms/.env`

| Variable                                     | Role                                 |
| -------------------------------------------- | ------------------------------------ |
| `DATABASE_URL`                               | PostgreSQL connection                |
| `PAYLOAD_SECRET`                             | Payload auth secret, 32+ characters  |
| `CMS_PUBLIC_URL`                             | Public CMS origin                    |
| `PUBLIC_SITE_URL`                            | Allowed public site origin           |
| `R2_*`                                       | Optional Cloudflare R2 media storage |
| `BUILD_WEBHOOK_URL` / `BUILD_WEBHOOK_SECRET` | Optional signed rebuild hook         |

`.env` files are gitignored. Never commit secrets.

Local Postgres from Compose:

```text
postgresql://garden:garden_local_only@localhost:5432/garden
```

## Scripts

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Astro site on `127.0.0.1:4321`                 |
| `pnpm build`        | Build the site and stage `dist/`               |
| `pnpm cms:dev`      | Payload admin on `:3001`                       |
| `pnpm cms:build`    | Production CMS build                           |
| `pnpm check`        | Typecheck web and CMS                          |
| `pnpm test`         | Vitest unit suite                              |
| `pnpm test:e2e`     | Playwright + axe checks                        |
| `pnpm format`       | Format source, docs, and YAML                  |
| `pnpm format:check` | CI-safe format check                           |
| `pnpm budget`       | Fail the build if static JS exceeds the budget |

Astro daemon helpers:

```sh
pnpm --filter @garden/web exec astro dev stop
pnpm --filter @garden/web exec astro dev status
pnpm --filter @garden/web exec astro dev logs
```

On Windows, creating a new imported file in the same edit can leave Astro HMR with a stale missing-import error. Restart the daemon if that happens.

## Scene, motion, and access

- One primary canvas, lazy-imported after semantic HTML
- Desktop work reuses that canvas; mobile keeps a dedicated hero composition plus HTML diagrams
- All geometry is procedural — no GLB, HDR, or texture downloads
- GSAP owns seed expansion and focus entrances; R3F owns continuous motion; native scroll owns stage placement
- Reduced motion freezes ambient animation and keeps the same DOM controls
- Rendering pauses when the scene is offscreen or in a background tab
- Quality caps DPR and particle counts from viewport, memory, save-data, and measured frame time
- Sound starts only after a user gesture
- Native dialogs trap and restore focus
- No analytics ship by default

See [docs/motion-system.md](docs/motion-system.md) and [docs/performance-budget.md](docs/performance-budget.md).

Targets for field p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.10. Those need production observation. Headless Chrome does not prove mid-range phone performance or Safari.

## Content rules

- The latest owner-provided CV is the authority for dates, location, email, GitHub, and LinkedIn
- Case studies expand documented CV facts. Architecture drawings are conceptual
- No confidential screenshots, invented metrics, or employer-internal material
- Forward-looking notes are proposals, not shipped outcomes
- Markdown allowlist: text, code fences, and safe links. Imports, JSX, raw HTML, and JS expressions are rejected
- Public `/api/portfolio` returns validated public fields only — never users or tokens
- Drafts stay in Payload admin. Do not expose them on the public snapshot endpoint

## Formatting

```sh
pnpm format
pnpm format:check
```

Biome 2.5.13 formats JavaScript, TypeScript, JSX/TSX, JSON/JSONC, CSS, and Astro templates. Root `biome.json` uses two spaces, LF, an 80-character line, and Tailwind directive support. Linting and import organization are off — these commands only format.

Prettier still owns Markdown, MDX, and YAML. Generated files, build output, caches, dependencies, uploaded media, and the local master PRD stay excluded. Git keeps text files on LF across Windows and CI.

## Quality and CI

`.github/workflows/quality.yml` runs on push and pull request:

1. `pnpm format:check`
2. `pnpm check`
3. `pnpm test`
4. `pnpm build`
5. `pnpm budget`
6. Playwright against `astro preview` on Chrome

Failed browser runs upload `playwright-report/`.

## Docs

| Doc                                                              | Contents                                    |
| ---------------------------------------------------------------- | ------------------------------------------- |
| [docs/architecture.md](docs/architecture.md)                     | Site/CMS split, content loading, MDX policy |
| [docs/content-model.md](docs/content-model.md)                   | Collections, publishing, CV, preview policy |
| [docs/motion-system.md](docs/motion-system.md)                   | Scene ownership and reduced motion          |
| [docs/performance-budget.md](docs/performance-budget.md)         | Budgets and what tests do not prove         |
| [docs/implementation-plan.md](docs/implementation-plan.md)       | Scope, gates, content gaps                  |
| [docs/task-ledger.md](docs/task-ledger.md)                       | Verification status                         |
| [docs/agent-runbook.md](docs/agent-runbook.md)                   | Local commands and guardrails               |
| [docs/decisions/001-platform.md](docs/decisions/001-platform.md) | Why Astro + Payload, not a single Next app  |

Public launch still needs owner-approved copy, a configured CMS, and field performance checks. Do not describe unrun device tests as complete.
