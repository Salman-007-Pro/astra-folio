import type { APIRoute } from "astro";
import { getContent } from "../lib/content";
export const GET: APIRoute = async ({ site, url }) => {
  const { profile } = await getContent();
  const origin = site || url.origin;
  return new Response(
    `# ${profile.fullName}\n\n> ${profile.role}. ${profile.intro}\n\n## Public content\n${["reading", "work", "writing", "about", "cv", "contact", "profile.json"].map((p) => `- [${p}](${new URL("/" + p, origin).href})`).join("\n")}\n\nCase studies use public-safe descriptions. Build modernization was a proof of concept. No private customer information or unverified numerical outcomes are provided.\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
