# Architecture

The public site is Astro 7.3.2 with a single React Three Fiber island. Static routes share validated content records. The same canvas moves between the hero and desktop work biome without creating a second WebGL context. Mobile retains a dedicated hero composition and semantic work diagrams.

The separate Next/Payload application owns projects, experience, skills, blog posts, experiments, media, profile, site settings, and current CV metadata. PostgreSQL stores content. R2 is optional for hosted media; local development stores files in the ignored CMS media directory.

`CMS_URL` enables strict build-time loading from `/api/portfolio`. If a configured CMS is unavailable or returns an invalid schema, the build fails instead of publishing partial content. Without a CMS URL, the supplied-CV-based bootstrap snapshot is used. `PUBLIC_CMS_URL` separately enables a fresh `/api/resume` request on the CV route; replacement PDFs do not require a new frontend build. Offline users see the last built CV with an explicit status message.

Markdown/MDX is validated both before CMS publication and during the Astro build. The initial allowlist contains Markdown, code fences, and safe links only. Imports, JSX, raw HTML, and JavaScript expressions are rejected. Shiki highlights code during the trusted build; no remote code runs in a public request.

Native dialogs provide focus trapping and restoration. Motion/sound/theme/blueprint preferences are local only. Sound begins only after a user gesture. No analytics are enabled or data sent to an analytics provider by default.

## Content provenance

Latest source: Muhammad_Salman_Asif_CV_.pdf, modified 2026-09-02, supplied directly by the owner. Older 2026-06-30 CV used for cross-checking. Latest location (Al Khobar), cross-stack service work, role dates, email, GitHub and LinkedIn are used. The public PDF is the supplied latest document, unchanged. No telephone number is repeated in the HTML.

Case studies are editorial expansions of documented CV facts. Architecture illustrations are conceptual. No confidential screenshots or metrics are supplied. Forward-looking reflections are written as proposals rather than historical achievements. Three engineering notes contain conceptual examples and implementation decisions; they require editorial review before broad public launch.
