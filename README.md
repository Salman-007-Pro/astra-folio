# Salman Asif · The Kinetic Garden

An Astro + Three.js portfolio with public case studies, writing, recruiter view, current CV, and a separate Payload CMS.

## Run locally

Use Node 22.12+ and pnpm 10.32.1:

```sh
pnpm install
pnpm dev
```

Open http://127.0.0.1:4321. The bootstrap content is based on the supplied September 2026 CV. The latest PDF is included unchanged.

```sh
pnpm check
pnpm test
pnpm test:e2e
pnpm build
pnpm budget
```

The browser suite uses an installed Google Chrome in isolated test contexts. The build stages static output into root `dist/` for hosting.

## Formatting

```sh
pnpm format        # Format source, docs, and YAML configuration.
pnpm format:check  # Check formatting without writing; also runs in CI.
```

Biome 2.5.13 formats JavaScript, TypeScript, JSX/TSX, JSON/JSONC, CSS, and complete Astro templates. The root `biome.json` uses two spaces, LF line endings, an 80-character line width, and Tailwind CSS directive support. Linting and import organization are disabled so these commands only format code.

Astro formatting uses Biome's experimental full HTML support; keep the version pinned and review template diffs when upgrading. Prettier is retained only for Markdown, MDX, and YAML, which Biome does not yet support. See [Biome language support](https://biomejs.dev/internals/language-support/).

Generated files, build output, caches, dependencies, uploaded media, and the supplied PRD are excluded. Git keeps text files on LF line endings across Windows and CI. The workspace recommends the Biome and Prettier editor extensions and selects the appropriate formatter on save for each language.

## CMS

```sh
docker compose up -d postgres
# Copy apps/cms/.env.example to apps/cms/.env and set a secure PAYLOAD_SECRET.
pnpm --filter @garden/cms generate:importmap
pnpm cms:dev
```

Open http://localhost:3001/admin and create the first administrator. Configure content and publish it. Set `CMS_URL` and `PUBLIC_CMS_URL` in `apps/web/.env` to connect the site. A missing CMS URL uses the bootstrap content; a configured-but-unavailable CMS fails the build intentionally.

Payload needs its own Node host and PostgreSQL service. Static Sites hosting publishes only the Astro frontend. R2 credentials and build-webhook settings are optional and documented in the environment examples. Production CMS deployments need migrations, persistent storage and backups.

See `docs/architecture.md`, `docs/content-model.md`, `docs/motion-system.md`, and `docs/task-ledger.md` for scope and verification status.
