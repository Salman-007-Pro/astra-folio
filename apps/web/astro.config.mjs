import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  site:
    process.env.PUBLIC_SITE_URL ||
    "https://salman-asif-kinetic-garden.salmanasif36.chatgpt.site",
  output: "static",
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
});
