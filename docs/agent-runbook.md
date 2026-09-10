# Kinetic Garden runbook

## Product

Full-stack engineer Salman Asif. Bright, tactile, semantic-first portfolio with a Three.js garden and an independent recruiter view. Latest owner-provided CV is the authority for career facts.

## Environment

- Node >=22.12.0 (this machine's system Node 21 is too old).
- Bundled Node 24: `C:/Users/Salman Asif/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`.
- pnpm workspace. `pnpm dev`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm budget`.
- Astro 7 daemon commands: `pnpm --filter @garden/web exec astro dev stop` / `dev status` / `dev logs`.
- Windows Astro HMR may retain a missing-import error when an imported new file is created in the same edit. Restart its daemon to clear that cache.
- `.env` files and generated output are ignored. Never commit secrets.

## CMS

`docker compose up -d postgres`, configure `apps/cms/.env`, then `pnpm cms:dev`. `pnpm --filter @garden/cms exec payload generate:importmap` before production CMS build. Review migrations before deploying with `pnpm --filter @garden/cms migrate`.

## Active phase

Validation and handoff. Check `docs/task-ledger.md` for measured results. Don't describe missing infrastructure or unrun browser/device tests as complete.

## Guardrails

No invented metrics or confidential production assets. Rsbuild migration remains a proof of concept. All essential information lives in HTML. Reading route must not import Three.js. Sound off by default. CMS errors must not replace a good public deployment with partial data.
