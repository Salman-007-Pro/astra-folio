# Platform and visual decisions

Decision: Astro 7.3.2 with React 19.2 and R3F 9.7, Payload 3.89 with Next 16.3.4. Use bundled Node 24 instead of system Node 21.
Reason: npm peer compatibility, strict separation of public HTML and CMS. The newest React 19.3 exceeds R3F's supported range.
Alternatives: a single Next app or generic Sites starter would change the requested architecture; rejected. Native scroll avoids unnecessary smooth-scroll accessibility and back-navigation risk.
Affected files: workspace manifests, Astro configuration, CMS configuration, scene controllers.
Consequence: small static reading routes; lazy WebGL island. CMS requires a separate Node/Postgres service. Geometry is procedural, so no GLB or texture downloads are needed; compression tools remain an optional asset pipeline for future supplied models.

Decision: do not invent a personal CV, metrics, dates, social URLs or shipping outcomes. Mark supplied work themes as public overviews awaiting detailed approval. Only implementation-backed writing is supplied.
Reason: the document explicitly treats profile wording as unverified until matched to a CV.
