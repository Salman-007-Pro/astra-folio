import { it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWebhook } from "../../tooling/scripts/verify-webhook";
it("verifies an exact signed payload and rejects modifications and expired deliveries", () => {
  const body = '{"event":"content.published"}',
    secret = "test-only-secret",
    now = 1800000000000,
    timestamp = String(now);
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  expect(verifyWebhook({ body, timestamp, signature, secret, now })).toBe(true);
  expect(
    verifyWebhook({ body: body + " ", timestamp, signature, secret, now }),
  ).toBe(false);
  expect(
    verifyWebhook({ body, timestamp, signature, secret, now: now + 300001 }),
  ).toBe(false);
  expect(
    verifyWebhook({ body, timestamp, signature: "abc", secret, now }),
  ).toBe(false);
});
