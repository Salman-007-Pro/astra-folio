# Kinetic Garden implementation

## Scope and evidence

The supplied PRD is the product specification, not a source of verified CV dates, metrics, contact details or permission to publish employer material. Build the complete local experience and a separately deployable CMS. Private previews may use explicitly identified draft material. Public launch remains gated by content verification and infrastructure configuration.

## Architecture

- pnpm workspace: `apps/web` (Astro static HTML + React Three Fiber island), `apps/cms` (Payload/Next + PostgreSQL), shared content and material contracts.
- One lazy Three.js canvas on the immersive homepage, semantic sections throughout. Reading routes never import the scene.
- Daylight editorial interface, large navy type, cobalt signal accents, ceramic modular islands, warm glass and small mechanical flowers. Mobile has its own tighter camera and HTML navigation.
- Native scroll; a single chapter controller publishes progress. GSAP owns chapter transitions, R3F owns continuous movement, Motion owns UI controls.
- Published CMS content is fetched and validated at build time. MDX is restricted, compiled only at build time. Runtime CV metadata fetch permits PDF replacement without a frontend build.

## Gates

1. Foundation: verify dependency compatibility, scaffold strict workspace, document content gaps.
2. First preview: designed semantic hero + interactive world, navigation and reading entry.
3. Content: public routes, shared data, work filters, case studies, writing, experience, skills, CV state, SEO.
4. Publishing: Payload schema/access/drafts/media, restricted MDX pipeline, signed rebuild hook, environment examples.
5. Hardening: typechecks, build, meaningful unit and browser tests, reduced motion, WebGL failure, mobile, performance evidence.
6. Handoff: private preview if available; state precisely what requires owner data/services before public launch.

## Content gaps

No CV asset, public email, social URLs, exact employment dates, approved case-study decisions/outcomes, published articles, domain or database credentials were supplied. Never fabricate these. Seed summaries derive from PRD themes; writing about this implementation can be included as explicitly labelled engineering notes.

## Sources

- npm registry checked 2026-09-11: Astro 7.3.2, React integration 6.0.5, MDX 8.0.1, R3F 9.7.0, Three 0.186.0, Payload 3.89.0, Next 16.3.4.
- R3F peer range is React >=19 <19.3: use React 19.2, not latest 19.3.
- https://astro.build/blog/astro-7/
- https://payloadcms.com/docs/getting-started/installation
- Reference https://ammarmunir.com/ did not load through research tool. No reference assets or layouts reused.
