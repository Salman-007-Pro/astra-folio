import type { Portfolio } from "@garden/content-schema";

export type SitemapEntry = { path: string; lastmod?: string };

export function sitemapEntries(content: Portfolio): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { path: "/" },
    { path: "/work" },
    { path: "/writing" },
    { path: "/about" },
    {
      path: "/cv",
      lastmod: content.resume.updatedAt || undefined,
    },
    { path: "/contact" },
    { path: "/reading" },
    ...content.projects.map((project) => ({ path: `/work/${project.slug}` })),
    ...content.posts.map((post) => ({
      path: `/writing/${post.slug}`,
      lastmod: post.publishedAt,
    })),
  ];
  return entries.filter((entry) => entry.path !== "/play");
}

function w3cDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

export function renderSitemap(
  entries: SitemapEntry[],
  origin: string,
  image?: { path: string; loc: string },
) {
  const xmlns = image
    ? ` xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`
    : ` xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`;
  const body = entries
    .map((entry) => {
      const loc = new URL(entry.path, origin).href;
      const lastmod = w3cDate(entry.lastmod);
      const imageXml =
        image && entry.path === image.path
          ? `<image:image><image:loc>${image.loc}</image:loc></image:image>`
          : "";
      return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${imageXml}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset${xmlns}>${body}</urlset>`;
}
