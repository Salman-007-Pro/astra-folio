import { defineConfig } from "astro/config";
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
export default defineConfig({
  site:
    process.env.PUBLIC_SITE_URL || localEnv.PUBLIC_SITE_URL || content.site.url,
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
});
