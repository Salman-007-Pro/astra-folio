import type { Endpoint, PayloadRequest } from "payload";
import { portfolioSchema, resumeSchema } from "@garden/content-schema";
import {
  absoluteMediaUrl,
  cmsOrigin,
  toPublicExperience,
  toPublicPost,
  toPublicProfile,
  toPublicProject,
} from "./public-content";
const publicOptions = (req: PayloadRequest) => ({
  req,
  overrideAccess: false,
  draft: false,
  depth: 1,
});
async function publishedMedia(req: PayloadRequest, file: unknown) {
  if (file && typeof file === "object") return file;
  if (typeof file !== "number") return null;
  return req.payload.findByID({
    collection: "media",
    id: file,
    ...publicOptions(req),
  });
}
async function resume(req: PayloadRequest) {
  const settings = await req.payload.findGlobal({
    slug: "resume-settings",
    ...publicOptions(req),
  });
  const pdf = await publishedMedia(req, settings.currentPdf);
  return resumeSchema.parse({
    url: absoluteMediaUrl(pdf, cmsOrigin()),
    filename: settings.filename || "CV.pdf",
    updatedAt:
      settings.versionDate || settings.updatedAt || new Date().toISOString(),
    downloadEnabled: settings.downloadEnabled ?? true,
  });
}
export const endpoints: Endpoint[] = [
  {
    path: "/resume",
    method: "get",
    handler: async (req) =>
      Response.json(await resume(req), {
        headers: { "Cache-Control": "no-store" },
      }),
  },
  {
    path: "/portfolio",
    method: "get",
    handler: async (req) => {
      const [
        profile,
        projects,
        experience,
        posts,
        currentResume,
        siteSettings,
      ] = await Promise.all([
        req.payload.findGlobal({ slug: "profile", ...publicOptions(req) }),
        req.payload.find({
          collection: "projects",
          sort: "order",
          limit: 100,
          where: { _status: { equals: "published" } },
          ...publicOptions(req),
        }),
        req.payload.find({
          collection: "experience",
          sort: "order",
          limit: 100,
          where: { _status: { equals: "published" } },
          ...publicOptions(req),
        }),
        req.payload.find({
          collection: "blog-posts",
          sort: "-publishedAt",
          limit: 1000,
          where: { _status: { equals: "published" } },
          ...publicOptions(req),
        }),
        resume(req),
        req.payload.findGlobal({
          slug: "site-settings",
          ...publicOptions(req),
        }),
      ]);
      const content = portfolioSchema.parse({
        profile: toPublicProfile(
          profile,
          await publishedMedia(req, profile.avatar),
        ),
        projects: projects.docs.map(toPublicProject),
        experience: experience.docs.map(toPublicExperience),
        posts: posts.docs.map(toPublicPost),
        resume: currentResume,
        site: siteSettings.websiteContent,
      });
      return Response.json(content, {
        headers: { "Cache-Control": "no-store" },
      });
    },
  },
];
