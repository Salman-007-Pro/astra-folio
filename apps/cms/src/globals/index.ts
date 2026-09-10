import type { Field, GlobalConfig } from "payload";
import { adminOnly } from "../access";
import { rebuildGlobal } from "../hooks/rebuild";
const text = (name: string, required = true): Field => ({
  name,
  type: "text",
  required,
});
const common = {
  access: { read: () => true, update: adminOnly },
  versions: { drafts: true },
  hooks: { afterChange: [rebuildGlobal] },
};
export const Profile: GlobalConfig = {
  ...common,
  slug: "profile",
  fields: [
    text("name"),
    text("fullName"),
    text("role"),
    { name: "intro", type: "textarea", required: true },
    text("location"),
    { name: "email", type: "email", required: true },
    text("github"),
    text("linkedin"),
    text("experienceLabel"),
    text("currentFocus"),
    { name: "longNarrative", type: "textarea" },
    { name: "avatar", type: "upload", relationTo: "media" },
  ],
};
export const SiteSettings: GlobalConfig = {
  ...common,
  slug: "site-settings",
  fields: [
    text("title"),
    { name: "description", type: "textarea" },
    text("canonicalDomain"),
    text("availability", false),
    {
      name: "navigation",
      type: "array",
      fields: [text("label"), text("href")],
    },
    text("footer", false),
    { name: "ogImage", type: "upload", relationTo: "media" },
    { name: "analyticsEnabled", type: "checkbox", defaultValue: false },
  ],
};
export const ResumeSettings: GlobalConfig = {
  ...common,
  slug: "resume-settings",
  hooks: { afterChange: [] },
  fields: [
    {
      name: "currentPdf",
      type: "upload",
      relationTo: "media",
      filterOptions: { mimeType: { equals: "application/pdf" } },
      required: true,
    },
    text("filename"),
    { name: "versionDate", type: "date", required: true },
    { name: "downloadEnabled", type: "checkbox", defaultValue: true },
    { name: "changelog", type: "textarea" },
  ],
};
