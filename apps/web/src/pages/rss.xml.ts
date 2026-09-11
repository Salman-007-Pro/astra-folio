import type { APIRoute } from "astro";
import { getContent } from "../lib/content";
const xml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export const GET: APIRoute = async ({ site, url }) => {
  const { posts, profile } = await getContent();
  const origin = site || url.origin;
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(profile.name)} — Field notes</title><link>${xml(String(origin))}</link><description>Engineering notes from the moving parts.</description><language>en</language>${posts.map((p) => `<item><title>${xml(p.title)}</title><description>${xml(p.excerpt)}</description><link>${xml(new URL("/writing/" + p.slug, origin).href)}</link><guid>${xml(new URL("/writing/" + p.slug, origin).href)}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate></item>`).join("")}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
