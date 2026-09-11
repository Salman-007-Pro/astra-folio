import { getPayload } from "payload";
import config from "./payload.config";
import { seed } from "@garden/content-schema/seed";
const list = (items: string[]) => items.map((value) => ({ value }));
// Explicit command only. Never runs when the server starts.
if (process.env.ALLOW_SEED !== "true")
  throw new Error(
    "Set ALLOW_SEED=true for an intentional bootstrap into an empty development CMS.",
  );
const payload = await getPayload({ config });
for (const collection of ["projects", "experience", "blog-posts"] as const) {
  const existing = await payload.find({ collection, limit: 1 });
  if (existing.totalDocs)
    throw new Error(
      `${collection} is not empty; refusing to overwrite content.`,
    );
}
await payload.updateGlobal({
  slug: "profile",
  data: { ...seed.profile, _status: "published" },
});
await payload.updateGlobal({
  slug: "site-settings",
  data: {
    title: `${seed.profile.name} — ${seed.profile.role}`,
    canonicalDomain: process.env.PUBLIC_SITE_URL || "http://localhost:4321",
    description: seed.profile.intro,
    websiteContent: seed.site,
    _status: "published",
  },
});
for (const [order, p] of seed.projects.entries())
  await payload.create({
    collection: "projects",
    data: {
      ...p,
      stack: list(p.stack),
      constraints: list(p.constraints),
      architecture: list(p.architecture),
      order,
      _status: "published",
    },
  });
for (const [order, e] of seed.experience.entries())
  await payload.create({
    collection: "experience",
    data: {
      ...e,
      stack: list(e.stack),
      evidence: list(e.evidence),
      order,
      _status: "published",
    },
  });
for (const p of seed.posts)
  await payload.create({
    collection: "blog-posts",
    data: {
      ...p,
      tags: list(p.tags),
      relatedProjects: list(p.relatedProjects),
      _status: "draft",
    },
  });
console.log(
  "Bootstrap complete. Review writing drafts, upload the current PDF, and publish Resume Settings before connecting the frontend.",
);
process.exit(0);
