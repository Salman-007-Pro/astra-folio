import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, existsSync } from "node:fs";
import { parseEnv } from "node:util";
import content from "../../content/portfolio.json" with { type: "json" };
const envPath = new URL("./.env", import.meta.url);
const localEnv = existsSync(envPath)
  ? parseEnv(readFileSync(envPath, "utf8"))
  : {};
export default defineConfig({
  site:
    process.env.PUBLIC_SITE_URL || localEnv.PUBLIC_SITE_URL || content.site.url,
  output: "static",
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
});
