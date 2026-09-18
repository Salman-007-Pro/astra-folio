export function isImageResponse(status: number, contentType: string | null) {
  return status >= 200 && status < 300 && Boolean(contentType?.startsWith("image/"));
}
export async function usableAvatarUrl(url?: string | null) {
  if (!url) return undefined;
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    const ok = isImageResponse(
      response.status,
      response.headers.get("content-type"),
    );
    await response.body?.cancel();
    return ok ? url : undefined;
  } catch {
    return undefined;
  }
}
