---
title: "Salman Asif - Immersive Portfolio Master PRD"
subtitle: "The Kinetic Garden of Systems - Astro + Three.js + Payload CMS"
author: "Product and implementation specification for GPT-6 Astra"
date: "2026-09-10"
toc: true
toc-depth: 3
numbersections: true
geometry: margin=18mm
fontsize: 10.5pt
colorlinks: true
linkcolor: blue
urlcolor: blue
---

# Document Status

**Version:** 1.0  
**Purpose:** Agent-ready Product Requirements Document for a premium personal software-engineering portfolio.  
**Primary implementation agent:** GPT-6 Astra.  
**Public framework:** Astro 7.x, starting from the latest stable release available when implementation begins. At the time this PRD was prepared, Astro 7.3 was current.  
**Primary visual reference:** `https://ammarmunir.com/` for interaction ambition and curiosity only. The final product must not copy its archive-room concept, layouts, scene composition, copy, assets, or visual identity.

This PRD is the source of truth. The implementation agent may improve low-level engineering choices, but it must not silently change the product concept, user experience hierarchy, CMS contract, accessibility requirements, performance budgets, or acceptance criteria.

# 1. Executive Summary

Build a portfolio that does not feel like a resume converted into a website. It should feel like a **small interactive world made by a software engineer who cares about craft, systems, motion, and performance**.

The product has two equally important modes:

1. **Explore Mode** - a joyful, interactive Three.js experience that rewards curiosity.
2. **Recruiter / Reading Mode** - a fast, clean, highly legible portfolio that exposes the same content with almost no friction.

The key concept is **The Kinetic Garden of Systems**.

Instead of a dark archive, desk, operating system clone, terminal, or generic floating cards, the visitor enters a bright digital micro-world where software ideas behave like living systems. Projects become interactive machines and biomes. Skills form constellations. Experience becomes a transit line through shipped systems. Writing lives in an observatory. Small objects react to the cursor, scroll velocity, sound setting, device capability, and the visitor's choices.

The experience should feel playful and memorable without becoming childish. It should feel technically impressive without becoming a WebGL benchmark that recruiters abandon after five seconds.

The site must communicate one message quickly:

> **I build interfaces and product systems that make difficult things feel clear, fast, and usable.**

# 2. Product Vision

## 2.1 Product statement

Create a personal portfolio for Salman Asif that combines:

- senior frontend / product-engineering credibility;
- premium interactive art direction;
- cinematic but controlled motion;
- real case-study depth;
- strong SEO and machine-readable content;
- recruiter-friendly navigation;
- a CMS-driven publishing workflow;
- a first-class engineering blog;
- a live, always-current CV viewer and download path;
- measurable performance on desktop and mobile.

## 2.2 Experience principles

The site must be:

- **Joyful:** bright, tactile, surprising, rewarding to explore.
- **Confident:** strong writing without fake hype or inflated claims.
- **Technical:** interactions should reveal engineering judgment, not just decorative animation.
- **Fast:** 3D should be progressively loaded and adaptive.
- **Accessible:** all important information must exist outside the canvas.
- **Recruiter-safe:** a visitor can understand profile, experience, work, and contact information in under 60 seconds.
- **Replayable:** hidden micro-interactions and alternate routes make a second visit interesting.
- **Original:** inspiration may come from immersive portfolios, but the visual metaphor and content system must be unique.

# 3. Primary Personas

## 3.1 Technical recruiter

Needs to answer quickly:

- What does Salman do?
- How experienced is he?
- Which frontend / web / mobile stacks does he know?
- Has he shipped enterprise products?
- Can I view or download his CV?
- How do I contact him?

This persona should never be forced to complete a 3D interaction.

## 3.2 Engineering manager / CTO

Needs evidence of:

- architecture judgment;
- frontend depth;
- performance awareness;
- complex UI experience;
- ownership and delivery;
- ability to work across React, Next.js, Vue, React Native, Node/Nest, and modern TypeScript ecosystems;
- ability to explain tradeoffs clearly.

## 3.3 Designer / creative technologist

Needs to see:

- motion quality;
- visual restraint;
- interaction detail;
- Three.js competence;
- component and design-system thinking;
- ability to make an interface feel distinctive.

## 3.4 Peer engineer / returning visitor

Needs:

- writing;
- experiments;
- technical notes;
- project breakdowns;
- useful easter eggs and exploratory details.

# 4. Brand Positioning

## 4.1 Positioning sentence

**Software engineer building high-performance web, mobile, and interactive products where product complexity meets interface clarity.**

## 4.2 Brand personality

- curious;
- systems-minded;
- technically serious;
- quietly confident;
- playful in presentation;
- direct in writing;
- not corporate-boring;
- not cyberpunk-hacker-cliche;
- not a self-congratulatory awards-site clone.

## 4.3 Writing tone

Copy must sound like an engineer who has actually shipped products.

Avoid:

- "passionate developer";
- "pixel-perfect ninja";
- "I love turning coffee into code";
- generic CV paragraphs;
- exaggerated startup language;
- empty claims such as "world-class" without evidence.

Prefer:

- concrete problems;
- decisions;
- tradeoffs;
- measurable outcomes when known;
- compact first-person explanations;
- precise technical language;
- occasional personality.

# 5. Core Creative Concept - The Kinetic Garden of Systems

## 5.1 World idea

The site is a luminous, abstract engineering garden suspended in a clean spatial environment. It is not a literal garden with realistic plants. It is a visual language made from:

- soft geometric modules;
- orbital nodes;
- flexible cables / paths;
- kinetic mechanical flowers;
- glass-like data capsules;
- small conveyor systems;
- magnetic project objects;
- signal pulses;
- lightweight particle swarms;
- topology lines;
- modular bridges between sections.

The world should communicate **software systems becoming tangible**.

## 5.2 Why this concept

The reference site uses an archive / evidence metaphor. This project should preserve the reference's sense of curiosity while moving in a completely different visual direction.

The Kinetic Garden works because it can express:

- growth without using career-timeline cliches;
- systems thinking through connected objects;
- engineering through motion and causality;
- creativity through color, lighting, and playful physics;
- multiple project categories as visually distinct micro-biomes.

## 5.3 Visual mood

Primary mood: **daylight digital playground**.

Suggested palette direction:

- warm off-white / cream base;
- deep navy / near-black typography;
- sky / cyan signal color;
- electric violet secondary accent;
- coral / orange energy accent;
- lime used sparingly for active / success moments.

The exact colors must be finalized as semantic design tokens after contrast testing. Do not hardcode palette values across components.

## 5.4 Materials

Use a small material language:

- matte ceramic;
- translucent tinted glass;
- brushed dark metal;
- emissive signal strips;
- paper / card texture for long-form reading surfaces.

Avoid excessive glassmorphism. The 3D scene should have material identity, not one translucent shader applied everywhere.

# 6. Signature Interaction Journey

## 6.1 Entry

The initial HTML loads immediately with the name, one-line positioning, and core navigation.

The WebGL world then activates progressively.

A small central **signal seed** responds to the pointer. On first meaningful interaction, it unfolds into connected modules and reveals the primary navigation path.

No forced 10-second intro. No unskippable animation.

## 6.2 Hero interaction

Hero objective: communicate identity in under five seconds.

Suggested copy:

**Salman Asif**  
**I build interfaces that make difficult systems feel effortless.**

Supporting line:

> Software engineer crafting enterprise web platforms, mobile experiences, and interactive products across the modern TypeScript ecosystem.

Primary actions:

- Explore selected work
- Open recruiter view
- View CV

3D behavior:

- central system slowly breathes at rest;
- cursor influences nearby orbital nodes;
- scroll moves camera through the first bridge;
- velocity gently affects particle / ribbon movement;
- no uncontrolled camera motion.

## 6.3 Selected Work biome

Projects are not displayed as ordinary cards in Explore Mode.

Each selected project appears as a **living machine** with a unique mechanical behavior. Examples:

- enterprise data / connectors work -> orbital pipeline with sources flowing into a central index;
- mobile product -> foldable / stacked mobile surfaces with touch-like gestures;
- performance / tooling work -> engine or compiler-like kinetic module with measurable before / after indicators;
- AI / realtime experiments -> signal field / voice waveform / agent node network;
- 3D / creative web work -> procedural sculptural module.

Hover / focus reveals one clear sentence. Activate opens the case study.

## 6.4 Experience transit line

Professional history becomes a kinetic transit path through major chapters instead of a standard vertical timeline.

Each station contains:

- company / role;
- period;
- scope;
- 2-4 evidence points;
- technologies;
- an optional "what changed because of my work" note.

The route can be explored spatially, but the same data is available as semantic HTML beneath / beside it.

## 6.5 Skill constellation

Skills should never become a giant logo cloud.

Use categories:

- Product UI
- Web Platform
- Mobile
- Backend / APIs
- Performance / Tooling
- Data / Realtime
- Creative Engineering

In Explore Mode, skill nodes orbit project evidence. Selecting a skill highlights the projects and case-study moments where that skill was actually used.

This is more credible than listing technologies without context.

## 6.6 Writing observatory

The blog / writing area becomes a calmer observatory zone.

3D is reduced. Typography becomes primary.

Featured posts appear as floating field-note slabs / paper surfaces in space, but the actual route is standard accessible HTML.

Suggested section copy:

**Field Notes from the Build**

> Architecture decisions, frontend performance, real-time product experiments, and the things I learn while turning messy product constraints into working systems.

## 6.7 About capsule

The About section should explain the person, not repeat employment bullets.

Themes:

- how Salman approaches product problems;
- why complex UI is interesting;
- preference for architecture before implementation;
- experience across enterprise frontend, mobile, and modern full-stack TypeScript;
- curiosity around Rust, AI agents, real-time systems, and creative web;
- what kind of problems he wants next.

## 6.8 Contact launch pad

The final section feels like a small launch pad where the system connects outward.

Primary copy:

**Have a difficult product surface to untangle?**

> That is usually where I enjoy starting.

Actions:

- Email
- LinkedIn
- GitHub
- View CV

# 7. Dual Experience Modes

## 7.1 Explore Mode

Default for capable devices when motion preference allows it.

Includes:

- persistent Three.js world;
- cinematic section transitions;
- spatial project selection;
- ambient sound optional and off by default;
- hidden easter eggs;
- richer cursor / touch response.

## 7.2 Recruiter / Reading Mode

Accessible from the first screen and persistent in navigation.

Characteristics:

- zero dependence on WebGL;
- clean top navigation;
- hero summary;
- selected work;
- experience;
- skills with evidence;
- blog highlights;
- contact;
- CV actions;
- printable / shareable.

The mode must be a first-class product, not an apology or fallback.

## 7.3 Reduced Motion Mode

Triggered by `prefers-reduced-motion` and manually selectable.

Behavior:

- remove scroll-scrub camera sequences;
- freeze ambient motion;
- use opacity / short transform transitions only;
- preserve all navigation and information;
- disable cursor attraction and continuous parallax.

# 8. Information Architecture

Required public routes:

```text
/
/work
/work/[slug]
/writing
/writing/[slug]
/about
/cv
/contact
/reading
/rss.xml
/sitemap.xml
/robots.txt
/llms.txt
```

Optional future routes:

```text
/lab
/lab/[slug]
/uses
/now
```

CMS admin must live separately, for example:

```text
cms.<domain>
```

# 9. Recommended Technology Stack

## 9.1 Public frontend

```text
Astro 7.x
TypeScript strict mode
React 19 islands
Tailwind CSS
```

Why Astro:

- excellent content-first delivery;
- server-rendered / pre-rendered HTML by default;
- islands architecture keeps JavaScript localized;
- strong fit for blog and SEO;
- allows React only where complex interactivity is needed;
- current Astro 7 line improves build performance and agent workflows.

## 9.2 3D stack

```text
three
@react-three/fiber
@react-three/drei
@react-three/postprocessing - only where justified
three-stdlib - only if required
```

React is the only UI island framework for this project. Do **not** mix React, Preact, Svelte, and Solid in the same portfolio simply because Astro supports them. One island framework reduces dependency duplication, hydration complexity, debugging cost, and agent confusion.

## 9.3 Animation stack

```text
GSAP
ScrollTrigger
@gsap/react / useGSAP where appropriate
Motion for React (formerly Framer Motion)
Lenis
```

Responsibility boundaries:

- **Three.js / R3F:** 3D scene, camera, lights, materials, interactions.
- **GSAP:** cinematic timelines, section transitions, coordinated camera / object states.
- **ScrollTrigger:** scroll-to-timeline mapping and section activation.
- **Motion:** UI micro-interactions, modals, chips, buttons, layout transitions.
- **Lenis:** smooth scrolling only if it passes accessibility and integration tests.

Do not animate the same property with multiple animation systems.

## 9.4 State

Recommended:

```text
Zustand
```

Use only for cross-island / scene state such as:

- active chapter;
- selected project;
- quality tier;
- sound preference;
- experience mode;
- reduced motion override;
- shared pointer / scroll state where necessary.

Do not put CMS content or simple component-local state into Zustand.

## 9.5 Content and CMS

```text
Payload CMS 3.x stable
PostgreSQL
Payload versions + drafts
Payload REST API or GraphQL API for Astro consumption
Cloudflare R2 for media assets
```

Payload runs as its own service because Payload's admin / server stack is Next.js based. Astro remains the public site.

## 9.6 Blog

```text
Payload-managed metadata + MDX source
Astro MDX compilation during trusted build / CI
remark / rehype pipeline
Shiki for syntax highlighting
```

Important security rule:

**Never execute arbitrary MDX from a public request at runtime.**

The blog pipeline should:

1. author MDX in a Payload field;
2. allow only trusted admin users to edit it;
3. validate a strict custom-component allowlist;
4. compile it in CI / build time;
5. publish static or cached HTML.

Allowed MDX components may include:

```text
Callout
CodeDemo
ArchitectureNote
Figure
ImageCompare
Metric
Quote
VideoEmbed
ProjectLink
```

No arbitrary `import`, filesystem access, or runtime code from CMS content.

# 10. Payload CMS Content Model

## 10.1 Globals

### Site Settings

Fields:

- site title;
- default description;
- canonical domain;
- social links;
- contact email;
- availability text;
- primary navigation;
- footer;
- default OG image;
- analytics IDs;
- theme default;
- feature flags.

### Profile

Fields:

- display name;
- role line;
- short intro;
- long narrative;
- current focus;
- profile image / avatar if used;
- location display if intentionally public;
- years-of-experience label controlled manually;
- core disciplines;
- contact CTAs.

### Resume Settings

Fields:

- current CV PDF upload;
- optional public filename;
- version date;
- short version / long version relationship;
- open-in-viewer default;
- download enabled;
- changelog note.

## 10.2 Collections

### Experience

Fields:

- company;
- role;
- start date;
- end date;
- location / remote label;
- summary;
- evidence bullets;
- technologies;
- display order;
- public / private detail flags.

### Projects

Fields:

- title;
- slug;
- one-line outcome;
- status;
- category;
- year / period;
- role;
- team context;
- problem;
- constraints;
- decisions;
- architecture;
- contribution;
- impact;
- metrics;
- tech stack;
- media;
- confidentiality level;
- external link;
- repository link;
- featured flag;
- 3D visual preset;
- color / material token references;
- related skills;
- related posts.

### Skills

Fields:

- name;
- category;
- short description;
- proficiency label only if useful;
- related projects;
- icon key;
- order.

Avoid numeric skill percentages.

### Blog Posts

Fields:

- title;
- slug;
- excerpt;
- MDX source;
- cover media;
- author;
- published date;
- updated date;
- tags;
- series;
- SEO title;
- SEO description;
- canonical override;
- OG image;
- draft / published status.

### Experiments

For side projects / lab work:

- title;
- status;
- short description;
- stack;
- demo link;
- repo link;
- screenshot / video;
- what was learned;
- future direction.

### Testimonials - optional

Only include verifiable, approved testimonials. Never invent them.

# 11. CV Experience

The CV must feel current at all times.

Required UX:

- **View CV** opens a high-quality in-site viewer or dedicated `/cv` route.
- **Download CV** downloads the current published PDF from Payload media.
- show a subtle **Updated [date]** label from CMS;
- no hardcoded file path in components;
- CMS admin can replace the PDF without a code deploy;
- old versions should not remain linked publicly unless intentionally exposed.

The `/cv` page should include:

- embedded PDF for capable browsers;
- fallback direct link;
- download action;
- print action where useful;
- semantic summary of profile and key experience for crawlers and accessibility.

# 12. Content Strategy for Salman

## 12.1 Hero copy - recommended baseline

**Headline**

> I build interfaces that make difficult systems feel effortless.

**Supporting copy**

> Software engineer focused on high-performance web, mobile, and interactive products. I have spent years working across enterprise frontend systems, React and Next.js products, Vue platforms, React Native experiences, APIs, and the tooling that keeps complex teams moving.

**Micro-proof row**

```text
6+ years shipping product UI
React / Next.js / Vue / React Native
Enterprise systems + creative engineering
```

The final public wording must be checked against the latest CV before launch.

## 12.2 About copy - recommended baseline

> I like product problems that look simple from the outside and turn out to have ten moving parts underneath. My work is usually somewhere between interface architecture, product behavior, performance, and the small details that make a complicated workflow feel obvious.
>
> I have worked across enterprise web platforms, mobile applications, data-heavy interfaces, realtime integrations, and modern TypeScript stacks. I care about clean systems, but I care just as much about whether the person using the system understands what is happening.
>
> Outside day-to-day product work, I keep experimenting with AI agents, local-first realtime tools, Rust, creative WebGL, and the infrastructure behind faster developer workflows.

## 12.3 Work section intro

**Selected systems, not screenshots.**

> A project is more interesting when you can see the constraints, the architecture, the tradeoffs, and what changed after it shipped.

## 12.4 Experience section intro

**Years of shipping under real constraints.**

> Mature products teach you different lessons than blank repos: backwards compatibility, release risk, performance debt, confusing edge cases, and the value of making complicated behavior boringly reliable.

## 12.5 Writing section intro

**Field notes from the build.**

> Practical notes on frontend architecture, performance, realtime systems, AI product experiments, and the engineering decisions that are usually missing from polished screenshots.

# 13. Personal Experience Content Direction

The portfolio should feature professional work without exposing confidential customer data, unreleased product details, private ticket numbers, internal screenshots, source code, or sensitive architecture.

Recommended public experience themes based on the current profile:

## 13.1 Securiti.ai - enterprise frontend systems

Public narrative themes:

- complex Vue-based enterprise product surfaces;
- cloud connector configuration experiences;
- metadata / discovery workflows;
- permission and scope interfaces;
- async status and long-running job UX;
- data catalog / filter experiences;
- audit / export behavior;
- performance and tooling modernization;
- state and route architecture for complex screens.

Do not publish internal ticket IDs or customer-specific data.

## 13.2 Koderlabs / earlier engineering work

Public narrative themes:

- React and React Native product delivery;
- API integration;
- GraphQL / REST data flows;
- cross-platform UI;
- Azure / Firebase / MongoDB-related product work;
- predictive / dashboard interfaces where publicly shareable.

## 13.3 Independent / lab work

Potential lab highlights:

- realtime multilingual meeting interpretation experiments;
- AI agent / trading analysis tooling as a technical system demonstration, with no financial-performance claims;
- creative Three.js websites;
- developer tooling / visual QA experiments;
- Rust backend learning projects;
- DoderData website / product experiments when public.

The agent must mark unshipped experiments clearly as **Lab**, **Prototype**, or **In progress** rather than presenting them as commercial production work.

# 14. Case Study Template

Every featured case study must follow a consistent evidence structure.

## 14.1 Above the fold

- title;
- one-line outcome;
- role;
- period;
- team context;
- stack;
- confidentiality-safe visual;
- quick navigation.

## 14.2 Problem

Explain the user / product problem, not just the assigned task.

## 14.3 Constraints

Examples:

- legacy framework;
- backward compatibility;
- API behavior;
- large data sets;
- async workflows;
- limited migration surface;
- mobile constraints;
- performance budgets;
- release timelines.

## 14.4 Decisions

Show 2-5 important engineering decisions with rationale.

## 14.5 Architecture

Use diagrams where useful. Prefer simplified public-safe diagrams rather than internal production topology.

## 14.6 Contribution

Be explicit about what Salman owned and what the team owned.

## 14.7 Outcome

Use real metrics when available. If metrics are not verifiable, describe qualitative impact without inventing numbers.

## 14.8 What I would improve now

Include one short retrospective. This signals senior judgment and avoids a "everything was perfect" tone.

# 15. 3D Scene Architecture

## 15.1 Persistent canvas

Use one primary R3F Canvas for the Explore experience where practical.

Benefits:

- no repeated WebGL initialization;
- smoother section transitions;
- shared camera / lighting;
- global performance governor;
- simpler asset caching.

The canvas must sit behind / alongside semantic HTML, not replace it.

## 15.2 Scene layers

Suggested structure:

```text
Canvas
  WorldRoot
    EnvironmentLayer
    AmbientParticles
    HeroSystem
    WorkBiome
    ExperienceTransit
    SkillConstellation
    WritingObservatory
    ContactLaunchPad
    InteractionEffects
    DebugOverlay (development only)
```

Only active / near-active sections should be fully rendered.

## 15.3 Scene state machine

Use explicit scene states:

```text
BOOT
HERO
WORK
PROJECT_FOCUS
EXPERIENCE
SKILLS
WRITING
ABOUT
CONTACT
IDLE
```

Transitions must be deterministic and interruptible.

Do not create dozens of independent scroll listeners mutating camera position.

## 15.4 Camera choreography

Camera rules:

- camera never spins unexpectedly;
- no nausea-inducing dolly speed;
- scroll should feel like moving through connected spaces, not flying through a theme-park ride;
- maintain visible orientation landmarks;
- user input can subtly influence framing but not destroy the authored composition;
- reduced-motion mode uses static camera positions and crossfades.

# 16. Animation Architecture

## 16.1 Source of truth

Create an animation orchestration layer. Suggested modules:

```text
src/experience/animation/
  timelines.ts
  scrollMap.ts
  camera.ts
  motionTokens.ts
  reducedMotion.ts
```

## 16.2 GSAP usage

Use GSAP for:

- master chapter timeline;
- project focus transition;
- camera position / target tweening;
- coordinated DOM + 3D sequences when necessary;
- entrance / exit choreography.

Use `gsap.context()` / React cleanup patterns. Every animation must be killable on route / island unmount.

## 16.3 ScrollTrigger usage

Use a small number of chapter-level ScrollTriggers, not one per decorative element.

ScrollTrigger should publish normalized progress into the scene, for example:

```text
hero: 0.0 -> 1.0
work: 0.0 -> 1.0
experience: 0.0 -> 1.0
```

The R3F world consumes those values.

## 16.4 Motion usage

Use Motion for:

- navigation menu;
- command / quick switcher;
- modal and sheet transitions;
- project metadata chips;
- filters;
- reading-mode page transitions;
- hover and press feedback.

## 16.5 Lenis integration

Lenis is allowed only if:

- anchor links work;
- browser back / forward restores correctly;
- keyboard scrolling works;
- reduced-motion mode can disable it;
- ScrollTrigger stays synchronized;
- no scroll locking bug on mobile Safari;
- no accessibility regression.

If any of those fail, prefer native scrolling.

# 17. Motion Design Tokens

Define motion as tokens, not random values.

Example:

```text
--motion-fast: 140ms
--motion-ui: 220ms
--motion-section: 700ms
--motion-cinematic: 1100ms
--ease-standard
--ease-enter
--ease-exit
--ease-spring-soft
```

3D equivalents should be centralized as config.

# 18. Theme Architecture

## 18.1 Semantic tokens

Use CSS custom properties under Tailwind.

Examples:

```text
--color-bg-canvas
--color-bg-surface
--color-text-primary
--color-text-muted
--color-border-subtle
--color-accent-signal
--color-accent-energy
--color-success
--color-focus
```

Do not use literal colors in feature components unless a shader / asset requires it, and even then reference scene tokens.

## 18.2 Modes

Required:

- Daylight - primary brand mode;
- Night Shift - optional dark variant;
- High Contrast - accessibility override where needed.

## 18.3 Shared 2D / 3D token registry

Create a typed token mapping for materials and light values so that the DOM and WebGL worlds feel like one system.

# 19. Responsive Strategy

Do not shrink the desktop 3D world onto mobile.

## 19.1 Desktop

Full experience:

- persistent spatial scene;
- richer post-processing;
- pointer interactions;
- wide camera framing.

## 19.2 Tablet

Simplified:

- lower particle count;
- fewer simultaneous animated objects;
- simplified project biome;
- touch-specific interaction hints.

## 19.3 Mobile

Mobile-first alternate composition:

- 3D hero / ambient layer only;
- HTML project cards are primary;
- tap-to-focus interactions;
- no tiny drag targets;
- no forced landscape;
- camera transitions shortened;
- heavy effects disabled.

The mobile site must still feel premium even when the 3D load is intentionally reduced.

# 20. Performance Architecture

## 20.1 Principle

The portfolio should impress because it is smooth, not because it downloads 40 MB of assets.

## 20.2 Initial-load budgets

Targets for the default public route:

- semantic HTML visible immediately;
- 3D chunk lazy-loaded after critical content;
- no initial autoplay video;
- initial above-the-fold 3D assets <= approximately 3 MB compressed;
- total immersive-session 3D / texture assets should normally stay <= approximately 10 MB unless explicitly justified;
- reading mode must stay much lighter than explore mode.

## 20.3 Core Web Vitals targets

Production target at 75th percentile where measurable:

```text
LCP <= 2.5 s
INP <= 200 ms
CLS <= 0.10
```

No launch if the visual experience consistently destroys these metrics on representative devices.

## 20.4 WebGL budgets

Starting targets, to be validated in profiling:

```text
Desktop triangles active scene: <= 250k
Mobile triangles active scene: <= 120k
Desktop draw calls: ideally < 100
Mobile draw calls: ideally < 60
DPR cap: adaptive, typically <= 1.5 on medium devices
```

These are engineering guardrails, not reasons to degrade visual quality unnecessarily.

## 20.5 Asset optimization

Required toolchain / techniques:

- GLB / glTF;
- Meshopt and / or Draco where it materially reduces size;
- KTX2 / Basis compressed textures;
- texture atlases when useful;
- geometry instancing;
- merged static geometry;
- limited shadow casters;
- LOD for complex objects;
- compressed environment maps;
- `gltf-transform` in the asset pipeline.

## 20.6 Render-loop discipline

Prefer event-driven / demand rendering where possible.

Rules:

- pause / reduce render work when tab is hidden;
- reduce render when 3D is offscreen;
- do not update React state every frame;
- use refs / R3F frame loop for hot-path values;
- avoid creating new vectors / objects every frame;
- pool particles / temporary objects;
- memoize materials and geometry.

# 21. Adaptive Quality Governor

At first meaningful load, classify the device into:

```text
HIGH
MEDIUM
LOW
FALLBACK
```

Signals may include:

- device memory when available;
- hardware concurrency;
- viewport / DPR;
- WebGL renderer capability;
- measured frame time during a short warm-up;
- user reduced-motion preference.

Quality adjustments:

### HIGH

- full scene;
- soft shadows;
- restrained post-processing;
- full particles;
- higher DPR cap.

### MEDIUM

- fewer particles;
- simplified shadows;
- reduced post-processing;
- lower DPR.

### LOW

- simplified geometry;
- minimal post-processing;
- no realtime shadows where avoidable;
- reduced ambient animation.

### FALLBACK

- no WebGL requirement;
- static / CSS visual composition;
- full HTML content.

Quality tier must be inspectable in development.

# 22. Accessibility Requirements

Required:

- WCAG 2.2 AA target for primary content and controls;
- keyboard-complete navigation;
- visible focus states;
- skip-to-content;
- semantic headings;
- correct landmarks;
- alt text for meaningful media;
- no required hover-only content;
- reduced-motion support;
- screen-reader access to all project / experience content;
- color contrast validation;
- dialogs with focus trapping and restoration;
- sound off by default;
- no essential text drawn only into canvas.

For the 3D world, provide text equivalents for interactive objects.

# 23. Sound Design

Sound is optional and **off by default**.

If enabled:

- soft UI clicks;
- small signal pulses;
- subtle spatial ambience;
- no looping soundtrack by default;
- no sudden loud sounds;
- global mute always visible;
- preference persisted locally.

Audio must never block first interaction or trigger browser autoplay issues.

# 24. Navigation

Use two layers:

## 24.1 Persistent compact nav

Items:

```text
Work
Experience
Writing
About
CV
Contact
```

## 24.2 Quick switcher

Optional command-style overlay for keyboard users:

```text
Cmd/Ctrl + K
```

Actions:

- jump to section;
- open project;
- open CV;
- toggle Explore / Reading;
- toggle sound;
- toggle motion mode.

This should feel like a power feature, not the primary navigation.

# 25. Easter Eggs and Replayability

Add small, tasteful surprises:

- a hidden debug / blueprint view activated by a deliberate action;
- a tiny system object that follows repeated clicks and eventually transforms;
- project machines emit different signals after related blog posts are opened;
- skill constellation remembers the last highlighted cluster within the session;
- optional "Night Shift" world state;
- one hidden message in a dev-console style, but do not spam the real browser console.

No easter egg may hide essential content.

# 26. SEO Requirements

The 3D experience must not compromise discoverability.

Required:

- unique titles and meta descriptions;
- canonical tags;
- Open Graph / social cards;
- XML sitemap;
- RSS feed;
- robots.txt;
- semantic content in HTML;
- no key profile text rendered only in canvas;
- image metadata and alt text;
- clean slugs;
- internal linking between projects, skills, and writing.

# 27. Structured Data and GEO / AI Discoverability

Implement appropriate JSON-LD:

- `Person`;
- `ProfilePage`;
- `WebSite`;
- `BreadcrumbList`;
- `Article` / `BlogPosting`;
- `CreativeWork` or a more specific type for selected public projects when truthful.

Add:

- `/llms.txt` with concise public-profile / site map guidance;
- a machine-readable public profile summary;
- clear self-contained introduction paragraphs;
- case-study summaries that make sense without visual context;
- consistent name, role, social links, and project facts.

Do not add fake FAQ schema or structured-data fields not visible / truthful on the page.

# 28. Blog Requirements

## 28.1 Categories

Suggested:

- Frontend Architecture
- Performance
- React / Next.js
- Vue / Enterprise UI
- React Native
- AI Products
- Realtime Systems
- Rust Learning
- Creative Web / Three.js
- Engineering Notes

## 28.2 Article template

Every article should support:

- title;
- description;
- published / updated date;
- reading time;
- tags;
- table of contents for long posts;
- syntax-highlighted code;
- diagrams;
- callouts;
- previous / next;
- related projects;
- related posts;
- copy-link;
- RSS.

## 28.3 Content quality rule

No thin AI-generated articles.

Every published post should contain at least one of:

- a real implementation decision;
- benchmark;
- debugging story;
- code / architecture example;
- opinion supported by experience;
- useful step-by-step technique;
- original experiment.

# 29. Analytics and Privacy

Use lightweight analytics.

Recommended events:

```text
mode_changed
project_opened
case_study_completed
cv_viewed
cv_downloaded
contact_clicked
blog_opened
sound_enabled
quality_tier
webgl_fallback
```

Do not collect invasive cursor recordings by default.

No analytics should block rendering.

# 30. Error and Fallback UX

Cases:

- WebGL unsupported;
- asset failed;
- shader compilation failed;
- CMS unavailable at build / runtime;
- CV missing;
- image missing;
- JavaScript disabled.

For every case, the visitor must still be able to access:

- name / role;
- work;
- experience;
- writing;
- CV link when available;
- contact.

WebGL errors should fail into Reading Mode, not a blank canvas.

# 31. Repository Architecture

Recommended monorepo:

```text
portfolio/
  apps/
    web/                 # Astro public site
    cms/                 # Payload CMS
  packages/
    content-schema/      # shared TypeScript contracts / Zod
    design-tokens/       # shared semantic tokens
    eslint-config/
    tsconfig/
  tooling/
    asset-pipeline/
    scripts/
  docs/
    architecture.md
    content-model.md
    motion-system.md
    performance-budget.md
    agent-runbook.md
  .github/
    workflows/
```

Use `pnpm` workspaces.

Optional Turborepo only if it simplifies tasks; do not add it automatically for a two-app repo unless the agent can justify the value.

# 32. Web App Suggested Structure

```text
apps/web/src/
  components/
    ui/
    navigation/
    content/
  layouts/
  pages/
  content/
  experience/
    canvas/
    scenes/
    objects/
    materials/
    animation/
    quality/
    input/
  lib/
    cms/
    seo/
    analytics/
    cv/
  stores/
  styles/
```

# 33. CMS App Suggested Structure

```text
apps/cms/src/
  collections/
    Projects.ts
    Experience.ts
    Skills.ts
    BlogPosts.ts
    Experiments.ts
    Media.ts
  globals/
    SiteSettings.ts
    Profile.ts
    ResumeSettings.ts
  hooks/
    revalidate.ts
    seo.ts
  access/
  lib/
  payload.config.ts
```

# 34. CMS to Astro Publishing Flow

Preferred publishing sequence:

```text
Payload draft
 -> preview
 -> publish
 -> signed build webhook
 -> Astro CI fetches published content
 -> validates schemas
 -> compiles trusted MDX
 -> builds static / hybrid output
 -> runs tests
 -> deploys
```

If the build fails, the previous production version remains live.

Do not publish invalid MDX directly to production.

# 35. Deployment Recommendation

Keep infrastructure understandable.

Recommended two-platform direction:

## Platform A - Cloudflare

Use for:

- Astro public site / Workers or Pages as appropriate;
- CDN;
- Cloudflare R2 public media / optimized asset origin where suitable;
- caching / security.

## Platform B - Railway

Use for:

- Payload CMS service;
- PostgreSQL in the same operational platform;
- scheduled backups / service monitoring.

Alternative approved paths:

- Payload Cloud;
- Vercel / managed Postgres;
- another stable Node + Postgres host.

The agent must choose based on actual deployment constraints, not ideology.

# 36. Security Requirements

Required:

- secure Payload admin authentication;
- admin route not linked publicly;
- rate limits on public forms / endpoints;
- environment secrets never shipped to client;
- signed CMS build webhooks;
- CSP where compatible with Three.js / analytics;
- dependency scanning;
- safe external links with correct `rel` values;
- sanitized / build-time trusted MDX pipeline;
- media upload restrictions;
- regular DB backups;
- no sensitive internal company information in CMS.

# 37. Testing Strategy

## 37.1 Unit

Use Vitest for:

- content transformers;
- quality governor logic;
- state transitions;
- URL helpers;
- SEO serializers;
- CMS schema adapters;
- MDX validation utilities.

## 37.2 Component

Test:

- navigation;
- mode switcher;
- CV viewer shell;
- project metadata;
- filters;
- dialogs;
- blog components.

## 37.3 E2E

Use Playwright for:

- first visit;
- Explore to Reading switch;
- project navigation;
- keyboard navigation;
- mobile nav;
- CV view / download;
- blog article;
- contact link;
- reduced motion;
- WebGL disabled fallback;
- back / forward navigation.

## 37.4 Accessibility

Use automated axe checks plus manual keyboard testing.

## 37.5 Visual regression

Create deterministic screenshot states for:

- hero high / medium / fallback;
- selected work;
- case study;
- reading mode;
- mobile;
- dark / night mode if included.

For 3D snapshots:

- fixed camera;
- fixed seed;
- paused animation;
- stable lighting;
- deterministic asset state.

# 38. Performance CI

CI should fail or warn on meaningful regression.

Include:

- Lighthouse CI on key routes;
- bundle report;
- asset size report;
- GLB / texture budget check;
- Playwright timing smoke test;
- dependency audit.

Key routes:

```text
/
/reading
/work/[featured]
/writing/[featured]
/cv
```

# 39. Observability

Production diagnostics should capture lightweight client errors for:

- WebGL init failure;
- asset load failure;
- uncaught JS errors;
- failed CMS content fetch if runtime fetches exist.

Do not log private form content.

# 40. GPT-6 Astra Implementation Contract

This section is specifically written for an autonomous coding agent.

## 40.1 First action - inspect, do not code

Before implementation, Astra must:

1. inspect the repository;
2. inspect existing README / AGENTS / project instructions;
3. verify actual package versions;
4. confirm latest stable Astro and integration compatibility;
5. inspect Payload / React / R3F compatibility;
6. identify deployment environment;
7. write `docs/implementation-plan.md`;
8. create a task ledger with phase gates.

Do not scaffold blindly over an existing repo.

## 40.2 Preserve decisions

When a decision changes, record:

```text
Decision
Reason
Alternatives considered
Affected files
Performance / UX consequence
```

Store major decisions in `docs/decisions/` as lightweight ADRs.

## 40.3 Use the browser during implementation

For every visual phase, Astra should:

- run the app;
- inspect the page in a browser;
- test interactions;
- test desktop and mobile widths;
- test reduced motion;
- inspect console errors;
- capture screenshots for self-review;
- compare against acceptance criteria;
- fix issues before moving forward.

Do not treat "TypeScript compiles" as visual completion.

## 40.4 Keep work phase-scoped

Do not implement the entire portfolio in one giant pass.

Each phase must end with:

```text
Implemented
Tests run
Browser QA run
Performance checked
Known issues
Acceptance result: PASS / PARTIAL / FAIL
Next phase
```

## 40.5 No fake completion

Astra must never claim:

- tested when tests were not run;
- responsive when only one viewport was checked;
- accessible when only an automated tool was run;
- fast when no measurement exists;
- pixel-perfect when no visual comparison exists.

## 40.6 No unnecessary abstraction

Prefer clean, readable modules. Do not build a generic animation framework, CMS framework, or design-system library bigger than the portfolio needs.

## 40.7 Agent context file

Maintain `docs/agent-runbook.md` with:

- product concept;
- non-negotiables;
- current architecture;
- commands;
- environment requirements;
- active phase;
- performance budgets;
- known browser quirks;
- next tasks.

This makes long agent sessions safer and easier to resume.

# 41. Phase Plan

# Phase 0 - Research, content inventory, and visual direction

## Goal

Remove ambiguity before coding the experience.

## Tasks

- inspect latest CV;
- create public-safe experience inventory;
- identify 4-6 strongest case studies;
- identify 3-6 launch blog topics;
- confirm public social links;
- confirm domain;
- create moodboard;
- sketch Kinetic Garden scene map;
- define semantic design tokens;
- create performance target document;
- document reference sites and exactly what may / may not be borrowed.

## Acceptance

- content inventory approved;
- no confidential material selected;
- final world concept documented;
- desktop and mobile wireframes exist;
- Recruiter Mode exists in wireframes;
- CV source identified.

# Phase 1 - Monorepo and platform foundation

## Goal

Create stable Astro + Payload foundation.

## Tasks

- pnpm workspace;
- Astro app;
- React integration;
- Tailwind;
- Payload app;
- Postgres config;
- shared content types;
- ESLint / Prettier;
- environment schema;
- CI baseline;
- basic deployment preview.

## Acceptance

- both apps run locally;
- production builds pass;
- CMS can create / publish test content;
- Astro can consume published content;
- no TypeScript errors;
- CI green.

# Phase 2 - CMS model, recruiter view, SEO foundation

## Goal

Ship the complete useful portfolio **without depending on 3D**.

## Tasks

- all core Payload collections;
- reading / recruiter mode;
- homepage semantic sections;
- work index;
- case-study route;
- writing index and article route;
- about;
- contact;
- CV viewer / download;
- metadata;
- sitemap;
- RSS;
- structured data;
- llms.txt.

## Acceptance

- a recruiter can understand profile in under 60 seconds;
- all routes usable without WebGL;
- Lighthouse / accessibility baseline passes agreed thresholds;
- CV can be replaced through CMS;
- blog post publishes from Payload MDX through build pipeline.

# Phase 3 - 3D technical prototype

## Goal

Prove the interaction architecture before producing final art.

## Tasks

- persistent R3F canvas;
- camera state machine;
- quality governor;
- hero prototype;
- one work biome prototype;
- one scroll transition;
- reduced-motion branch;
- WebGL fallback;
- debug overlay;
- frame / draw-call profiling.

## Acceptance

- smooth on reference desktop;
- acceptable on mid-range mobile with reduced scene;
- 3D failure does not break content;
- no uncontrolled scroll / camera bugs;
- quality tiers visibly change complexity.

# Phase 4 - Final visual system and hero

## Goal

Make the site immediately memorable.

## Tasks

- final material system;
- lighting;
- hero signal seed;
- opening choreography;
- navigation integration;
- cursor / touch reactions;
- motion tokens;
- audio preference shell;
- final typography.

## Acceptance

- identity understandable before 3D finishes loading;
- no forced intro;
- hero works keyboard / touch / reduced motion;
- first meaningful interaction feels polished;
- visual language is clearly different from the reference site.

# Phase 5 - Work biome and case-study transitions

## Goal

Turn portfolio evidence into the main interactive attraction.

## Tasks

- 4-6 project machines;
- project focus transitions;
- skill evidence links;
- case study enter / exit;
- media / video optimization;
- mobile alternate layouts.

## Acceptance

- every project object has clear focus / activation states;
- selected project title never depends on guessing the 3D object;
- case studies remain standard URLs;
- back navigation preserves sensible state;
- mobile interaction requires no precision drag.

# Phase 6 - Experience, skills, writing, about, contact worlds

## Goal

Complete the full spatial narrative.

## Tasks

- experience transit;
- skill constellation;
- writing observatory;
- about capsule;
- contact launch pad;
- easter eggs;
- night mode optional.

## Acceptance

- each chapter feels distinct but uses the same visual language;
- transitions are coherent;
- no chapter is animation-only with weak content;
- Recruiter Mode stays in parity with content.

# Phase 7 - Blog and publishing polish

## Goal

Make writing a long-term product feature.

## Tasks

- MDX component allowlist;
- code highlighting;
- diagrams;
- reading progress;
- series / tags;
- related content;
- RSS validation;
- content preview;
- build webhook hardening.

## Acceptance

- draft preview works;
- invalid MDX blocks publish / deploy;
- code blocks accessible;
- article SEO correct;
- no arbitrary MDX execution.

# Phase 8 - Performance and accessibility hardening

## Goal

Turn a beautiful prototype into production software.

## Tasks

- profile frame time;
- reduce draw calls;
- texture compression;
- mobile asset variants;
- route JS review;
- Lighthouse CI;
- axe + manual keyboard audit;
- reduced-motion audit;
- WebGL context loss test;
- low-end device test.

## Acceptance

- agreed Core Web Vitals budgets met or documented with approved exceptions;
- no major accessibility blockers;
- mobile remains premium;
- no memory leak after repeated section navigation;
- canvas pauses appropriately in background.

# Phase 9 - Content finalization and launch

## Goal

Launch with credible, polished content.

## Tasks

- rewrite all copy;
- verify latest CV;
- verify dates / roles;
- remove placeholders;
- verify project confidentiality;
- add final OG images;
- analytics;
- domain;
- redirects;
- production error monitoring;
- browser matrix QA.

## Acceptance

- no lorem ipsum;
- no fake metrics;
- no broken external links;
- CV current;
- contact works;
- sitemap indexed;
- 404 / error pages styled;
- production smoke test passes.

# Phase 10 - Post-launch iteration

## Goal

Use real visitor behavior to improve clarity and performance.

Review:

- recruiter mode usage;
- CV views / downloads;
- project completion;
- high bounce points;
- WebGL fallback rate;
- device quality-tier distribution;
- Core Web Vitals;
- most-read posts.

Do not optimize for time-on-site by adding friction. The goal is useful engagement, not trapping visitors.

# 42. Launch Content Backlog

Suggested first case-study topics:

1. **Enterprise Connector Experience** - designing complex cloud configuration / status workflows in a mature Vue platform.
2. **Long-running Discovery UX** - making async scan state, cancellation, progress, and recovery understandable.
3. **Frontend Tooling Modernization** - modernizing a legacy frontend build stack with minimal application churn.
4. **Cross-platform Mobile Product Work** - React Native / API integration case study, where shareable.
5. **Realtime Multilingual Meeting Interpreter Lab** - architecture-first AI / audio experiment.
6. **Creative 3D Portfolio** - this portfolio itself as a public engineering case study after launch.

Suggested first blog topics:

1. Why a 3D portfolio still needs semantic HTML.
2. Building one persistent R3F world inside an Astro site.
3. GSAP vs Motion vs Three.js: clear animation responsibility boundaries.
4. Performance budgets for creative WebGL sites.
5. What mature Vue 2 products teach you about frontend architecture.
6. Building realtime translation without starving the audio pipeline.

# 43. Definition of Done - Whole Product

The portfolio is done when:

- it has a unique, recognizable visual concept;
- the experience is not a clone of the reference site;
- the homepage communicates role and value immediately;
- Recruiter Mode works independently of WebGL;
- selected work contains evidence, not only screenshots;
- Payload controls all long-lived content;
- blog publishing works from Payload-managed MDX through a trusted build pipeline;
- CV can be viewed and downloaded and updated without code changes;
- mobile is intentionally designed, not scaled-down desktop;
- reduced-motion mode is complete;
- WebGL fallback is complete;
- accessibility has been manually tested;
- performance is measured and within approved budgets;
- metadata, sitemap, structured data, RSS, and llms.txt are live;
- tests and browser QA pass;
- no confidential or invented content is published.

# 44. Non-Goals

Do not turn this into:

- a game with mandatory controls;
- a full 3D room clone;
- a terminal portfolio;
- a macOS / Windows UI clone;
- a generic Bento-grid template with decorative 3D;
- a CV copied line by line into sections;
- a shader demo that hides the work;
- a blog platform with user accounts / comments at launch;
- an overengineered microservice system;
- an AI chatbot whose answers can invent career facts.

An optional site assistant may be considered later only if it is grounded strictly in approved portfolio content and clearly labeled.

# 45. Final Creative Guardrails

The agent should repeatedly ask these questions while building:

1. **Would this still be a strong portfolio if the 3D failed?** If no, fix the content / structure.
2. **Does this interaction reveal something about the work, or is it only decoration?** Prefer meaningful motion.
3. **Is this visually too close to the reference?** If yes, redesign it.
4. **Can a recruiter get the answer in one click?** If no, simplify.
5. **Does mobile feel intentionally designed?** If no, create a mobile-specific composition.
6. **Is performance being measured?** If no, no performance claim is allowed.
7. **Is the copy evidence-based?** If no, rewrite it.
8. **Would Salman want to revisit this site himself?** The world should reward curiosity without wasting time.

# 46. Research Baseline

Verified while preparing this PRD on 2026-09-10:

- GPT-6 Astra official announcement: `https://openai.com/index/gpt-6-astra/`
- Astro 7.3 release: `https://astro.build/blog/astro-730/`
- Astro 7.0 release and agent-oriented build improvements: `https://astro.build/blog/astro-7/`
- React Three Fiber docs: `https://r3f.docs.pmnd.rs/`
- GSAP ScrollTrigger docs: `https://gsap.com/docs/v3/Plugins/ScrollTrigger/`
- Payload CMS: `https://payloadcms.com/`
- Payload releases: `https://payloadcms.com/posts/releases`
- Primary visual reference: `https://ammarmunir.com/`

# 47. Handoff Prompt for GPT-6 Astra

Use the following prompt at the start of implementation:

> You are implementing the Salman Asif Immersive Portfolio using the attached Master PRD as the source of truth. Treat `ammarmunir.com` only as an interaction-quality reference; do not copy its archive concept, layouts, scene, copy, or assets. The unique concept is "The Kinetic Garden of Systems." First inspect the repository and current package compatibility. Do not code until you have produced `docs/implementation-plan.md`, a phase task ledger, and a short architecture decision log. Implement one PRD phase at a time. At the end of each phase, run relevant tests, launch the app, perform browser QA on desktop and mobile, check console errors, verify reduced motion and accessibility where applicable, measure performance where the phase affects it, and report PASS / PARTIAL / FAIL against the phase acceptance criteria. Keep semantic HTML and Recruiter Mode first-class; Three.js is progressive enhancement, not the only interface. Use Astro as the public framework, React islands for R3F and complex interactive UI, Payload as the CMS, Payload-managed trusted MDX compiled at build time for writing, Tailwind semantic tokens, GSAP / ScrollTrigger for cinematic timelines, Motion for UI micro-interactions, Lenis only if it passes integration and accessibility tests, and an adaptive WebGL quality governor. Never invent career metrics or publish confidential employer information. Never claim a test or visual check was run unless you actually ran it.

# 48. One-Sentence North Star

> **Build a portfolio people remember for the experience, trust for the engineering, and use easily when they actually want to hire the person behind it.**

