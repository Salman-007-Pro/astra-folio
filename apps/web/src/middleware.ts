import { defineMiddleware } from "astro:middleware";
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const type = response.headers.get("content-type") || "";
  if (
    type.includes("text/html") ||
    type.includes("xml") ||
    type.includes("json")
  )
    response.headers.set("Cache-Control", "no-store");
  return response;
});
