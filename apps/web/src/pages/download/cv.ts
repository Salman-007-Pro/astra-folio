import type { APIRoute } from "astro";
import { resumeSchema } from "@garden/content-schema";
import { getContentSafe } from "../../lib/content";
import {
  absoluteResumeUrl,
  attachmentDisposition,
  readRemotePdf,
} from "../../lib/cv-download";

function cmsOrigin() {
  return (
    process.env.PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    import.meta.env.PUBLIC_CMS_URL ||
    import.meta.env.CMS_URL ||
    ""
  );
}

async function liveResume() {
  const origin = cmsOrigin();
  if (!origin) return null;
  const headers: Record<string, string> = {};
  const token = process.env.CMS_READ_TOKEN || import.meta.env.CMS_READ_TOKEN;
  if (token) headers.Authorization = `users API-Key ${token}`;
  const response = await fetch(new URL("/api/resume", origin), {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return null;
  return resumeSchema.parse(await response.json());
}

export const GET: APIRoute = async ({ redirect }) => {
  try {
    const resume = (await liveResume()) ?? (await getContentSafe()).resume;
    if (!resume.downloadEnabled || !resume.url) return redirect("/cv");
    const pdfUrl = absoluteResumeUrl(resume.url, cmsOrigin() || null);
    if (!pdfUrl) return redirect("/cv");
    const body = await readRemotePdf(pdfUrl);
    if (!body) return redirect("/cv");
    return new Response(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": attachmentDisposition(resume.filename),
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return redirect("/cv");
  }
};
