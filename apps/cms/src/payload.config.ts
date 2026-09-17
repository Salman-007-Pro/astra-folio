import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Users,
  Media,
  Projects,
  Experience,
  Skills,
  BlogPosts,
  Experiments,
} from "./collections";
import { Profile, SiteSettings, ResumeSettings } from "./globals";
import { endpoints } from "./endpoints";
import { migrations } from "./migrations";
import { databasePool } from "./database-url";
const directory = path.dirname(fileURLToPath(import.meta.url));
if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32)
  throw new Error(
    "PAYLOAD_SECRET must contain at least 32 characters. Configure apps/cms/.env.",
  );
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.CMS_PUBLIC_URL || "http://localhost:3001",
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: directory,
      importMapFile: path.resolve(
        directory,
        "app/(payload)/admin/importMap.js",
      ),
    },
  },
  collections: [
    Users,
    Media,
    Projects,
    Experience,
    Skills,
    BlogPosts,
    Experiments,
  ],
  globals: [SiteSettings, Profile, ResumeSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: databasePool(),
    push: process.env.NODE_ENV !== "production",
    prodMigrations: migrations,
  }),
  sharp,
  cors: (process.env.PUBLIC_SITE_URL || "http://127.0.0.1:4321")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  csrf: [process.env.CMS_PUBLIC_URL || "http://localhost:3001"],
  typescript: { outputFile: path.resolve(directory, "payload-types.ts") },
  endpoints,
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  plugins: process.env.R2_BUCKET
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.R2_BUCKET,
          config: {
            endpoint: process.env.R2_ENDPOINT,
            region: "auto",
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
            },
          },
        }),
      ]
    : [],
});
