import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, existsSync } from "node:fs";
import { parseEnv } from "node:util";
import content from "../../content/portfolio.json" with { type: "json" };
const localEnv = {};
for (const name of [".env", ".env.local"]) {
  const file = new URL(`./${name}`, import.meta.url);
  if (existsSync(file))
    Object.assign(localEnv, parseEnv(readFileSync(file, "utf8")));
}
const cmsOrigins = [
  process.env.PUBLIC_CMS_URL,
  process.env.CMS_URL,
  localEnv.PUBLIC_CMS_URL,
  localEnv.CMS_URL,
  "https://cms.salmanasif.pro",
  "http://127.0.0.1:3001",
];
const remotePatterns = [];
const seen = new Set();
for (const value of cmsOrigins) {
  if (!value) continue;
  try {
    const url = new URL(value);
    const protocol = url.protocol.replace(":", "");
    const key = `${protocol}:${url.hostname}`;
    if (seen.has(key)) continue;
    seen.add(key);
    remotePatterns.push({ protocol, hostname: url.hostname });
  } catch {
    /* skip invalid CMS origins */
  }
}
export default defineConfig({
  site:
    process.env.PUBLIC_SITE_URL || localEnv.PUBLIC_SITE_URL || content.site.url,
  output: "server",
  adapter: process.env.VERCEL ? vercel() : node({ mode: "standalone" }),
  integrations: [react(), mdx()],
  image: { remotePatterns },
  vite: { plugins: [tailwindcss()] },
});
