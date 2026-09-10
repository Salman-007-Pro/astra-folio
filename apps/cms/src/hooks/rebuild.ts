import { createHmac } from "node:crypto";
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from "payload";
async function notifyBuild(doc: any, collection: string, req: any) {
  if (doc._status && doc._status !== "published") return;
  const target = process.env.BUILD_WEBHOOK_URL,
    secret = process.env.BUILD_WEBHOOK_SECRET;
  if (!target || !secret) return;
  const timestamp = String(Date.now());
  const body = JSON.stringify({
    event: "content.published",
    collection,
    id: doc.id || collection,
    timestamp,
  });
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Garden-Timestamp": timestamp,
        "X-Garden-Signature": signature,
      },
      body,
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw new Error(`Build receiver responded ${response.status}`);
  } catch (error) {
    req.payload.logger.error({
      msg: "Publishing succeeded, but the frontend build notification failed. Re-trigger the build before announcing the update.",
      err: error,
    });
  }
}
export const rebuildCollection: CollectionAfterChangeHook = async ({
  doc,
  collection,
  req,
}) => {
  await notifyBuild(doc, collection.slug, req);
  return doc;
};
export const rebuildGlobal: GlobalAfterChangeHook = async ({
  doc,
  global,
  req,
}) => {
  await notifyBuild(doc, global.slug, req);
  return doc;
};
