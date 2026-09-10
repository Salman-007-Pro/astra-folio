import { createHmac, timingSafeEqual } from "node:crypto";
export function verifyWebhook({
  body,
  timestamp,
  signature,
  secret,
  now = Date.now(),
}: {
  body: string;
  timestamp: string;
  signature: string;
  secret: string;
  now?: number;
}) {
  const sentAt = Number(timestamp);
  if (
    !secret ||
    !Number.isFinite(sentAt) ||
    Math.abs(now - sentAt) > 300000 ||
    !/^[a-f0-9]{64}$/i.test(signature)
  )
    return false;
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
