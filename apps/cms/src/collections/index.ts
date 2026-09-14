import type { CollectionConfig, Field } from "payload";
import { compile } from "@mdx-js/mdx";
import { validateMdxTree } from "@garden/content-schema/mdx-policy";
import { adminOnly, publishedOrAdmin } from "../access";
import { rebuildCollection } from "../hooks/rebuild";
const text = (name: string, required = true): Field => ({
  name,
  type: "text",
  required,
});
const area = (name: string, required = true): Field => ({
  name,
  type: "textarea",
  required,
});
const list = (name: string): Field => ({
  name,
  type: "array",
  fields: [text("value")],
  required: true,
});
const select = (
  name: string,
  options: string[],
  extra: { label?: string; enumName?: string } = {},
): Field => ({
  name,
  type: "select",
  options,
  required: true,
  ...extra,
});
const base = (
  slug: string,
): Pick<CollectionConfig, "slug" | "access" | "versions" | "hooks"> => ({
  slug,
  access: {
    read: publishedOrAdmin,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  versions: { drafts: { autosave: true }, maxPerDoc: 30 },
  hooks: { afterChange: [rebuildCollection] },
});
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 8,
    lockTime: 600000,
    useAPIKey: true,
  },
  admin: { useAsTitle: "email" },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [text("name", false)],
};
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  upload: {
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "application/pdf",
    ],
    staticDir: "media",
    imageSizes: [
      { name: "card", width: 1200, height: 800, position: "centre" },
    ],
  },
  fields: [text("alt"), { name: "caption", type: "textarea" }],
};
export const Projects: CollectionConfig = {
  ...base("projects"),
  admin: {
    useAsTitle: "shortTitle",
    defaultColumns: ["shortTitle", "category", "lifecycle", "_status"],
  },
  fields: [
    text("title"),
    text("shortTitle"),
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) =>
        (typeof value === "string" &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        "Use a lowercase hyphenated slug.",
    },
    area("outcome"),
    select("category", ["Enterprise", "Platform", "Mobile", "Creative"]),
    text("period"),
    text("role"),
    text("company"),
    select("lifecycle", ["Production", "Proof of concept", "In progress"], {
      label: "Status",
      enumName: "project_lifecycle",
    }),
    select("preset", ["connector", "discovery", "engine", "mobile", "garden"]),
    list("stack"),
    area("problem"),
    list("constraints"),
    {
      name: "decisions",
      type: "array",
      required: true,
      fields: [text("title"), area("body")],
    },
    list("architecture"),
    area("contribution"),
    area("impact"),
    area("reflection"),
    area("confidentiality"),
    { name: "featured", type: "checkbox", defaultValue: true },
    { name: "order", type: "number", defaultValue: 0 },
    { name: "media", type: "relationship", relationTo: "media", hasMany: true },
    {
      name: "relatedSkills",
      type: "relationship",
      relationTo: "skills",
      hasMany: true,
    },
    {
      name: "relatedPosts",
      type: "relationship",
      relationTo: "blog-posts",
      hasMany: true,
    },
    text("externalLink", false),
    text("repositoryLink", false),
  ],
};
export const Experience: CollectionConfig = {
  ...base("experience"),
  admin: { useAsTitle: "company" },
  fields: [
    text("company"),
    text("role"),
    text("period"),
    text("location"),
    area("summary"),
    list("evidence"),
    list("stack"),
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
export const Skills: CollectionConfig = {
  ...base("skills"),
  admin: { useAsTitle: "name" },
  fields: [
    text("name"),
    text("category"),
    area("description", false),
    {
      name: "projects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
    },
    text("iconKey", false),
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
export const BlogPosts: CollectionConfig = {
  ...base("blog-posts"),
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "_status"],
  },
  hooks: {
    afterChange: [rebuildCollection],
    beforeChange: [
      async ({ data }) => {
        if (data._status === "published") {
          await compile(data.mdx || "", { remarkPlugins: [validateMdxTree] });
        }
        return data;
      },
    ],
  },
  fields: [
    text("title"),
    { name: "slug", type: "text", required: true, unique: true, index: true },
    area("excerpt"),
    {
      name: "mdx",
      type: "code",
      required: true,
      admin: {
        language: "mdx",
        description:
          "Trusted Markdown compiled at build time. Imports, JavaScript expressions, JSX, and raw HTML are rejected.",
      },
    },
    { name: "publishedAt", type: "date", required: true },
    list("tags"),
    { name: "minutes", type: "number", required: true, min: 1 },
    text("kind"),
    list("relatedProjects"),
    text("series", false),
    text("seoTitle", false),
    area("seoDescription", false),
    text("canonicalOverride", false),
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "author", type: "relationship", relationTo: "users" },
  ],
};
export const Experiments: CollectionConfig = {
  ...base("experiments"),
  admin: { useAsTitle: "title" },
  fields: [
    text("title"),
    select("lifecycle", ["Lab", "Prototype", "In progress"], {
      label: "Status",
      enumName: "experiment_lifecycle",
    }),
    area("description"),
    list("stack"),
    text("demoLink", false),
    text("repositoryLink", false),
    area("learnings", false),
  ],
};
