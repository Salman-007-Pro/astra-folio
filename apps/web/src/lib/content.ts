import { portfolioSchema, type Portfolio } from "@garden/content-schema";
import { seed } from "@garden/content-schema/seed";
let cached: Promise<Portfolio>;
async function read(): Promise<Portfolio> {
  const origin = import.meta.env.CMS_URL;
  if (!origin) return portfolioSchema.parse(seed);
  const site = import.meta.env.PUBLIC_SITE_URL;
  if (site && new URL(origin).origin === new URL(site).origin)
    throw new Error(
      "CMS_URL must be the Payload origin (http://127.0.0.1:3001), not the Astro site.",
    );
  const headers: Record<string, string> = {};
  if (import.meta.env.CMS_READ_TOKEN)
    headers.Authorization = `users API-Key ${import.meta.env.CMS_READ_TOKEN}`;
  const response = await fetch(new URL("/api/portfolio", origin), {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok)
    throw new Error(
      `CMS snapshot unavailable (${response.status}); preserving the previous production build.`,
    );
  return portfolioSchema.parse(await response.json());
}
export function getContent() {
  if (import.meta.env.CMS_URL) return read();
  return (cached ||= read());
}
export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
