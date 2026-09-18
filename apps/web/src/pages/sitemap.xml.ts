import type { APIRoute } from "astro";
import { getContentSafe } from "../lib/content";
import { personImageUrl, siteOrigin } from "../lib/seo";
import { renderSitemap, sitemapEntries } from "../lib/sitemap";

export const GET: APIRoute = async ({ site, url }) => {
  const origin = siteOrigin(site || url.origin);
  const content = await getContentSafe();
  return new Response(
    renderSitemap(sitemapEntries(content), origin, {
      path: "/",
      loc: personImageUrl(origin),
    }),
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
