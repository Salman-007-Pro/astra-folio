import { defineMiddleware } from "astro:middleware";
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const type = response.headers.get("content-type") || "";
  const path = context.url.pathname;
  if (path === "/download/cv") {
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  if (path === "/sitemap.xml") {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    return response;
  }
  if (
    type.includes("text/html") ||
    type.includes("xml") ||
    type.includes("json")
  )
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
  return response;
});
