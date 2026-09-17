import { absoluteMediaUrl } from "@garden/content-schema";
const values = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => (typeof item === "string" ? item : item.value))
    : [];
const cmsOrigin = () => process.env.CMS_PUBLIC_URL || "http://localhost:3001";
export { absoluteMediaUrl };
export function toPublicProfile(profile: Record<string, any>, avatar: unknown) {
  return {
    ...profile,
    avatarUrl: absoluteMediaUrl(avatar, cmsOrigin()),
  };
}
export function toPublicProject(project: Record<string, any>) {
  return {
    ...project,
    status: project.lifecycle,
    stack: values(project.stack),
    constraints: values(project.constraints),
    architecture: values(project.architecture),
  };
}
export function toPublicExperience(entry: Record<string, any>) {
  return {
    ...entry,
    evidence: values(entry.evidence),
    stack: values(entry.stack),
  };
}
export function toPublicPost(post: Record<string, any>) {
  return {
    ...post,
    tags: values(post.tags),
    relatedProjects: values(post.relatedProjects),
  };
}
