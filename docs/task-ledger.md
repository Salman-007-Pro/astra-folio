# Phase ledger

| Gate                   | Status                | Evidence / remaining work                                                                                                                                                                                   |
| ---------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Research               | PASS                  | Versions verified against npm. Both owner-supplied CVs read; latest September 2026 CV used.                                                                                                                 |
| Foundation             | PASS                  | Strict Astro/React/Three workspace and separate Payload/Next app. Both production builds pass.                                                                                                              |
| First preview          | PASS                  | Actual procedural WebGL garden, interactive unfolding seed, four-machine work biome sharing one canvas.                                                                                                     |
| Content routes         | PASS                  | Five case studies, three substantive engineering notes, experience, skills, about/contact, current PDF, reading route, RSS/sitemap/robots/llms/profile JSON.                                                |
| CMS                    | PARTIAL               | Schemas, drafts/versions, access, R2 config, public adapters, current CV API, signed build notification and admin build implemented. Docker engine unavailable; live DB publishing not tested.              |
| Visual / functional QA | PASS for tested scope | Chromium desktop and mobile, 15 unit tests, 10 browser tests; axe checks on reading/work/contact; mobile overflow fixed; keyboard modal restoration; reduced motion and WebGL-off fallback.                 |
| Performance            | PARTIAL               | Whole-site JS 366.5 KB gzip, largest lazy scene chunk 279 KB gzip; no external 3D asset downloads. Field CWV and physical low-end/Safari devices remain unmeasured.                                         |
| Private preview        | IN PROGRESS           | Static frontend built for registered owner-only Sites destination.                                                                                                                                          |
| Full PRD launch        | PARTIAL               | Real CMS host/DB/R2, operational backups, frontend draft preview, signed webhook receiver deployment, six-chapter cinematic traversal, public editorial review, device matrix and field performance remain. |

## Checks actually run

- `pnpm check`: Astro and CMS strict typechecks passed (initial inline-script hints were corrected).
- `pnpm test`: 15 passing tests, covering content relationships, safe URLs, unavailable CV, device quality boundaries, MDX execution rejection and HMAC tampering/expiry.
- `pnpm build`: 16 HTML pages plus machine-readable routes; static output staged successfully.
- `pnpm cms:build`: Next/Payload production build passed; admin and API routes are dynamic.
- `pnpm test:e2e`: 10 passing checks across desktop and mobile Chrome. Initial contrast, hydration and overlap failures were fixed and the suite rerun successfully.
- Browser visual review: desktop hero, work biome, mobile hero and navigation. No false claim of Safari or real mobile-device testing.

This is a functional implementation with an honest launch gap list, not a claim that every phase of the master PRD has been completed.
