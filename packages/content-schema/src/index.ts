import { z } from "zod";
import staticContent from "../../../content/portfolio.json";
export const safeUrl = z.string().refine((value) => {
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return value.startsWith("/") && !value.startsWith("//");
  }
}, "Use an HTTP(S) URL or a local absolute path");
export const projectSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortTitle: z.string(),
  outcome: z.string(),
  category: z.enum(["Enterprise", "Platform", "Mobile", "Creative"]),
  period: z.string(),
  role: z.string(),
  company: z.string(),
  status: z.enum(["Production", "Proof of concept", "In progress"]),
  preset: z.enum(["connector", "discovery", "engine", "mobile", "garden"]),
  stack: z.array(z.string()),
  problem: z.string(),
  constraints: z.array(z.string()),
  decisions: z.array(z.object({ title: z.string(), body: z.string() })),
  architecture: z.array(z.string()),
  contribution: z.string(),
  impact: z.string(),
  reflection: z.string(),
  featured: z.boolean().default(true),
  confidentiality: z.string(),
});
export const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  period: z.string(),
  location: z.string(),
  summary: z.string(),
  evidence: z.array(z.string()),
  stack: z.array(z.string()),
});
export const postSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string()),
  minutes: z.number(),
  mdx: z.string(),
  relatedProjects: z.array(z.string()),
  kind: z.string().default("Build note"),
});
export const collaborationDefaults = staticContent.profile.collaboration;
const defaultText = (fallback: string) =>
  z.preprocess(
    (value) => (value === null || value === "" ? undefined : value),
    z.string().default(fallback),
  );
const collaborationSchema = z.object({
  availability: defaultText(collaborationDefaults.availability),
  locations: defaultText(collaborationDefaults.locations),
  currencies: defaultText(collaborationDefaults.currencies),
  callNumber: defaultText(collaborationDefaults.callNumber),
  whatsappNumber: defaultText(collaborationDefaults.whatsappNumber),
  summary: defaultText(collaborationDefaults.summary),
  whatsappContacts: z
    .array(z.object({ label: z.string(), number: z.string() }))
    .nullish()
    .transform((value) => value ?? []),
});
export const profileSchema = z.object({
  name: z.string(),
  fullName: z.string(),
  role: z.string(),
  intro: z.string(),
  location: z.string(),
  email: z.email(),
  github: safeUrl,
  linkedin: safeUrl,
  experienceLabel: z.string(),
  currentFocus: z.string(),
  collaboration: z.preprocess((value) => value ?? {}, collaborationSchema),
  avatarUrl: safeUrl.nullish(),
});
export const resumeSchema = z.object({
  url: safeUrl.nullable(),
  filename: z.string(),
  updatedAt: z.string(),
  downloadEnabled: z.boolean(),
});
export const gameSettingsSchema = z.object({
  enabled: z.boolean(),
  title: z.string(),
  intro: z.string(),
  winQuotes: z.array(z.string().min(1)).min(1),
  lossQuotes: z.array(z.string().min(1)).min(1),
});
export const demoPresetSchema = z.enum([
  "layout",
  "state",
  "contract",
  "route",
  "island",
  "store",
  "mobile",
  "event",
  "middleware",
  "request",
  "query",
  "document",
  "cache",
  "bundle",
  "pipeline",
  "container",
  "routing",
  "test",
  "browser",
  "mesh",
  "publish",
  "wallet",
  "jobs",
  "auth",
]);
export const techLabSchema = z.object({
  title: z.string(),
  intro: z.string(),
  systemTitle: z.string(),
  technologies: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        preset: demoPresetSchema,
        description: z.string(),
        code: z.string(),
        projects: z.array(z.string()),
      }),
    )
    .min(1),
  scenarios: z
    .array(
      z.object({
        id: z.string(),
        preset: demoPresetSchema,
        title: z.string(),
        explanation: z.string(),
        why: z.string(),
        tradeoff: z.string(),
      }),
    )
    .min(1),
});
export const motivationSchema = z.object({
  enabled: z.boolean(),
  title: z.string(),
  intro: z.string(),
  intervalSeconds: z.number().min(5).max(120),
  quotes: z
    .array(
      z.object({
        text: z.string().min(1),
        author: z.string(),
        sourceUrl: safeUrl,
      }),
    )
    .min(1),
});
export type TechLabSettings = z.infer<typeof techLabSchema>;
export type MotivationSettings = z.infer<typeof motivationSchema>;
export type DemoPreset = z.infer<typeof demoPresetSchema>;
export const siteSchema = z.object({
  title: z.string(),
  url: safeUrl,
  brandName: z.string(),
  brandMark: z.string(),
  defaultPalette: z.enum(["garden", "ocean", "ember"]),
  footer: z.string(),
  portrait: z.object({ file: z.string(), caption: z.string() }),
  locationShort: z.string(),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    accent: z.string(),
    description: z.string(),
  }),
  about: z.object({
    teaser: z.string(),
    summary: z.string(),
    currentRole: z.string(),
    currentCompany: z.string(),
    interests: z.array(z.string()),
    sections: z.array(
      z.object({ title: z.string(), paragraphs: z.array(z.string()) }),
    ),
  }),
  education: z.string(),
  languages: z.array(z.string()),
  games: gameSettingsSchema,
  techLab: techLabSchema.default(staticContent.site.techLab as TechLabSettings),
  motivation: motivationSchema.default(staticContent.site.motivation),
});
export const portfolioSchema = z.object({
  profile: profileSchema,
  projects: z.array(projectSchema),
  experience: z.array(experienceSchema),
  posts: z.array(postSchema),
  resume: resumeSchema,
  site: z.preprocess((value) => value ?? staticContent.site, siteSchema),
});
export type GameSettings = z.infer<typeof gameSettingsSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Post = z.infer<typeof postSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type Portfolio = z.infer<typeof portfolioSchema>;
export function absoluteMediaUrl(file: unknown, origin: string) {
  let path =
    file &&
    typeof file === "object" &&
    typeof (file as { url?: unknown }).url === "string"
      ? (file as { url: string }).url
      : "";
  if (!path) {
    const filename =
      file &&
      typeof file === "object" &&
      typeof (file as { filename?: unknown }).filename === "string"
        ? (file as { filename: string }).filename
        : "";
    if (!filename) return null;
    path = `/api/media/file/${encodeURIComponent(filename)}`;
  }
  return new URL(path, origin).href;
}
export function withAvatarUrl(
  content: Portfolio,
  avatar: unknown,
  origin: string,
): Portfolio {
  if (content.profile.avatarUrl) return content;
  const avatarUrl = absoluteMediaUrl(avatar, origin);
  if (!avatarUrl) return content;
  return { ...content, profile: { ...content.profile, avatarUrl } };
}
