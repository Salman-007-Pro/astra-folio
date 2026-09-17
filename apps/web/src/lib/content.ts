import {
  portfolioSchema,
  withAvatarUrl,
  type Portfolio,
} from "@garden/content-schema";
import { seed } from "@garden/content-schema/seed";
let cached: Promise<Portfolio>;
let live: { at: number; value: Promise<Portfolio> } | undefined;
const liveTtlMs = 30_000;
async function read(): Promise<Portfolio> {
  const origin = process.env.CMS_URL || import.meta.env.CMS_URL;
  if (!origin) return portfolioSchema.parse(seed);
  const site = process.env.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL;
  if (site && new URL(origin).origin === new URL(site).origin)
    throw new Error(
      "CMS_URL must be the Payload origin (http://127.0.0.1:3001), not the Astro site.",
    );
  const headers: Record<string, string> = {};
  const token = process.env.CMS_READ_TOKEN || import.meta.env.CMS_READ_TOKEN;
  if (token) headers.Authorization = `users API-Key ${token}`;
  const response = await fetch(new URL("/api/portfolio", origin), {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok)
    throw new Error(
      `CMS snapshot unavailable (${response.status}); preserving the previous production build.`,
    );
  const content = portfolioSchema.parse(await response.json());
  if (content.profile.avatarUrl) return content;
  try {
    const profileResponse = await fetch(
      new URL("/api/globals/profile?depth=1", origin),
      {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!profileResponse.ok) return content;
    return withAvatarUrl(
      content,
      (await profileResponse.json()).avatar,
      origin,
    );
  } catch {
    return content;
  }
}
export function getContent() {
  const origin = process.env.CMS_URL || import.meta.env.CMS_URL;
  if (!origin) return (cached ||= read());
  const now = Date.now();
  if (live && now - live.at < liveTtlMs) return live.value;
  live = { at: now, value: read() };
  return live.value;
}
export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
