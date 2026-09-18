import type { APIRoute } from "astro";
import { robotsTxt, siteOrigin } from "../lib/seo";

export const GET: APIRoute = ({ site, url }) =>
  new Response(robotsTxt(siteOrigin(site || url.origin)), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
