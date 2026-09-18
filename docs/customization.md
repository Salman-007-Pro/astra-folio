# Customize the portfolio

The static source is [`content/portfolio.json`](../content/portfolio.json). No CMS is required. The shared Zod schema validates the file during development and builds.

## Identity and content

Keep the existing keys and replace their values. JSON does not support comments or trailing commas.

1. Update `profile`: name, full name, role, intro, location, email, social URLs, experience label, and current focus.
2. Update `profile.collaboration`: availability, working locations, currency/engagement copy, phone and WhatsApp labels, and both numbers.
3. Update `site`: brand name/mark, title, URL, hero, About copy, current role/company, education, and languages.
4. Replace `projects`, `experience`, and `posts` with your own verified work.
5. Replace the portrait below. Upload the CV in CMS Resume Settings.

Phone numbers use international format such as `+923321318363`. The calling number produces a `tel:` link; WhatsApp produces a `wa.me` URL with digits only. The channels can use different numbers. The prefilled WhatsApp greeting uses the profile’s first name.

`site.locationShort` is the compact homepage label; `profile.location` and `profile.collaboration` supply fuller descriptions. Keep them consistent.

## Portrait and CV

Place your portrait in `apps/web/src/assets/`, then set `site.portrait.file` to its filename and update `site.portrait.caption`. PNG, JPEG, WebP, and AVIF inputs are supported. Astro produces responsive AVIF/WebP/JPEG outputs for Home and About.

A missing filename fails the build. Updating a CMS filename does not upload a source image into the repository: commit the new image and rebuild too. The legacy Payload Profile avatar field does not automatically replace this optimized portrait.

The CV PDF is uploaded in CMS **Resume Settings**. The website reads `/api/resume` and never stores a copy in `apps/web/public`. Set `resume.url` to `null` in JSON only for static mode without a CMS file. Set `downloadEnabled` to `false` to hide download.

## Projects and writing

- Give projects and posts unique URL-safe slugs. A changed slug changes its URL; configure redirects on your host for already shared links.
- The seven case-study sections read `problem`, `constraints`, `decisions`, `architecture`, `contribution`, `impact`, and `reflection`. The short `outcome` text is used on work cards.
- `stack` drives displayed technology labels and filters. `featured` selects homepage projects.
- Keep project `preset` values within the schema’s supported values: `connector`, `discovery`, `engine`, `mobile`, or `garden`.
- Post `relatedProjects` values must refer to your project slugs.
- Post `mdx` allows Markdown, code fences, and safe links. Imports, JSX, raw HTML, executable expressions, and unsafe URLs are rejected. JSON string paragraph breaks use `\n\n`.

See the definitive fields in [`packages/content-schema/src/index.ts`](../packages/content-schema/src/index.ts). Keep required fields present and run `pnpm check`, `pnpm test`, and `pnpm build` after substantial edits.

## Visual styles

The **Styles** button opens fifteen visual treatments: Original (the default), Cyberpunk, Holographic, Pixel / Game, Parallax, Liquid Glass, Neumorphism, Paper / Scrapbook, Editorial, Aurora, Cartoon / Illustrative, Scrollytelling, Retro / Vintage, Claymorphism, and Hand-drawn / Doodle. Each works with the existing light and dark palettes. The selected style is saved on the visitor's device and restored before first paint on every route.

Edit names and descriptions in `apps/web/src/lib/visual-styles.ts`, base materials in `apps/web/src/styles/visual-styles.css`, and whole-page compositions in `apps/web/src/styles/style-worlds.css`. Each look defines its own light/dark canvas, surfaces, text and accent. Ocean and Ember tint the style accent. The original design remains unchanged. The other looks alter navigation, hero composition, section rhythm, project grids, biography, writing and contact surfaces. Choosing a style closes settings to reveal the full page.

The transition picker saves one of five effects: **Pixel Flip** (default), **Shutter Sweep**, **Diagonal Slice**, **Mosaic Bloom**, or **3D Blinds**. Old transition IDs migrate to Pixel Flip. Edit metadata and the controller in `apps/web/src/lib/style-transitions.ts`, and appearance in `apps/web/src/styles/style-transitions.css`. Pixel Flip uses ten square tiles per row and enough rows to cover viewport height. The replacement effects use alternating strips, slanted panels, a radial mosaic, and rotating vertical louvers. All five use the Web Animations API with a decorative top-layer overlay; no View Transitions support is required. Resize, hidden tabs, or reduced-motion changes finish the pending style and remove the overlay. Rapid selections keep the latest choice and restore keyboard focus to Styles.

Motion off and reduced-motion preferences disable animated switching and decorative movement. Liquid Glass uses CSS frosted surfaces, optical edge highlights and moving light; it is not physical refraction. Parallax uses independently moving background planes plus bounded movement inside project artwork; readable text remains in normal flow. Scrollytelling pairs sticky desktop chapter headings with a reading-progress rail. Neither effect hijacks scrolling.

Scrollytelling adds a page-reading progress line and chapter reveals using Intersection Observer. Text is never hidden while waiting for JavaScript. Switching styles, disabling motion, or hiding the browser cancels active reveals and releases their listeners. Cartoon, Vintage, Clay, and Doodle reuse the existing content and illustrations with distinct typography, borders, and surface treatments; Doodle uses system handwriting fonts with a cursive fallback.

## Games

`site.games.enabled` controls the homepage arcade and Play navigation link. When disabled, `/play` still shows an unavailable message and link to work.

Edit `site.games.title`, `intro`, `winQuotes`, and `lossQuotes`. Both quote lists need at least one nonempty message. Short, original messages fit mobile layouts best. Results randomly choose a message from the appropriate list.

Rules live in `apps/web/src/games/engines.ts` and `racing-engine.ts`; React UI is in `Arcade.tsx` and `Racing.tsx`. JSON controls visibility and editorial text, not executable behavior. Rounds stay in memory and reset when switching games or leaving the page. Racing Classic keeps only a device-local best score under `kinetic-garden-racing-best-v1`. Its LCD screen and controls are styled in `racing.css`.

## Light and dark colors

Set `site.defaultPalette` to one of these values:

| Palette  | Light                                  | Dark                           |
| -------- | -------------------------------------- | ------------------------------ |
| `garden` | Warm paper, forest tones, blue accents | Deep green, soft blue accents  |
| `ocean`  | Icy white, teal, ocean blue            | Navy, cyan, cool blue surfaces |
| `ember`  | Cream, rust, warm neutrals             | Plum, coral, soft lavender     |

Visitors select palettes in Experience settings. Night Shift changes mode; light and dark selections are remembered separately. Saved preferences override the site default. To test a new default, clear the `kinetic-garden-preferences-v1` local-storage entry in your own browser.

Tune existing colors in `apps/web/src/styles/themes.css` and `packages/design-tokens/`. Preserve contrast and visible focus indicators. Adding another named palette also requires updating the schema enum, preference whitelist, first-paint whitelist, and settings options.

## Domain and branding

Set `site.url` to your HTTPS origin. The canonical origin uses this precedence:

1. Hosting/shell `PUBLIC_SITE_URL`
2. `PUBLIC_SITE_URL` in `apps/web/.env`
3. `site.url` in the repository JSON

Astro reads this configuration before the CMS snapshot. A CMS edit to `websiteContent.url` does not independently change the build’s canonical origin; use the frontend build environment for deployment domains.

Page titles, profile metadata, bylines, RSS, and branding text use shared content. Review favicon/social-card assets in `apps/web/public/` for your visual identity; those assets are not generated from JSON. Generic interface instructions and navigation route names remain in components.

## Connect Payload later

Follow the [Payload setup guide](payload-setup.md). The seed imports JSON into an empty development CMS. Once `CMS_URL` is set, CMS content becomes the source; local JSON edits do not automatically update CMS records.

Site Settings → **Website copy, games & appearance** contains the same object as `site` in the JSON. Profile, Projects, Experience, Blog Posts, and Resume Settings use separate editors. Publish changes and rebuild the frontend.

### Style-specific opening layouts

`apps/web/src/components/StyleShowcase.astro` renders alternate hero content from the same profile, projects and portrait data. `apps/web/src/styles/style-compositions.css` selects the console (Cyberpunk/Pixel), project gallery (Holographic), portrait cover (Editorial/Paper/Vintage/Doodle), or dashboard (Neumorphism/Glass). The remaining styles keep the interactive spatial scene with distinct compositions. On mobile, Pixel leads with the LCD panel; Vintage and Doodle lead with the portrait. Hidden alternatives remain out of keyboard navigation. The Three.js hero is hidden while an alternate opening is active and restored when switching back; the desktop work-section scene remains available.

### Footer, cursors, scrollbars and sound

`apps/web/src/styles/style-chrome.css` gives each style a matching footer treatment and scrollbar. Footer links use a responsive grid, with the year aligned to the right. `apps/web/src/lib/style-chrome.ts` measures the footer during scrolling, resizing and style changes; the Styles button keeps an 18px gap above it and otherwise rests 32px above the viewport bottom. Mobile safe areas are included.

Desktop pointers use small native SVG cursors that change shape with the style and contrast with light/dark mode. Hovering controls uses a filled variant. Text inputs retain the text cursor; touch devices and forced-colors mode use native behavior. Scrollbar styling follows browser/platform support and never replaces native scrolling.

Sound remains off by default. Enable **Sound** in Styles to hear theme-specific click tones and a short three-note cue when changing styles. `apps/web/src/lib/style-audio.ts` defines each style's waveform and notes. One AudioContext is reused; muting, hiding the page or triggering another cue cancels pending notes. These generated effects need no audio downloads.
