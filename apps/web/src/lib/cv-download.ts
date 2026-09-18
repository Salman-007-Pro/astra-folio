import { Buffer } from "node:buffer";

export function pdfFilename(name?: string | null) {
  const raw = (name || "CV").replace(/\s+/g, " ").trim() || "CV";
  return /\.pdf$/i.test(raw) ? raw : `${raw}.pdf`;
}

export function attachmentDisposition(filename: string) {
  const pdf = pdfFilename(filename);
  const ascii = pdf.replace(/[^\w.\-]+/g, "_") || "CV.pdf";
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(pdf)}`;
}

export function isPdfResponse(status: number, contentType: string | null) {
  return (
    status >= 200 &&
    status < 300 &&
    Boolean(
      contentType?.includes("pdf") || contentType?.includes("octet-stream"),
    )
  );
}

export function isPdfBytes(body: Buffer) {
  return body.subarray(0, 4).toString("latin1") === "%PDF";
}

export function absoluteResumeUrl(url: string, cmsOrigin?: string | null) {
  if (/^https?:\/\//i.test(url)) return url;
  if (!cmsOrigin) return null;
  return new URL(url, cmsOrigin).href;
}

export async function readRemotePdf(
  url: string,
  fetchImpl: typeof fetch = fetch,
) {
  const response = await fetchImpl(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!isPdfResponse(response.status, response.headers.get("content-type")))
    return null;
  const body = Buffer.from(await response.arrayBuffer());
  return isPdfBytes(body) ? body : null;
}
