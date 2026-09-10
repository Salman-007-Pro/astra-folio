import { z } from "zod";
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
export const collaborationDefaults = {
  availability: "Available worldwide · Remote",
  locations: "Al Khobar, Saudi Arabia · Karachi, Pakistan",
  currencies: "USD / EUR",
  callNumber: "+92 332 1318363",
  whatsappNumber: "+966 56 379 1037",
};
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
});
export const resumeSchema = z.object({
  url: safeUrl.nullable(),
  filename: z.string(),
  updatedAt: z.string(),
  downloadEnabled: z.boolean(),
});
export const portfolioSchema = z.object({
  profile: profileSchema,
  projects: z.array(projectSchema),
  experience: z.array(experienceSchema),
  posts: z.array(postSchema),
  resume: resumeSchema,
});
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Post = z.infer<typeof postSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type Portfolio = z.infer<typeof portfolioSchema>;
