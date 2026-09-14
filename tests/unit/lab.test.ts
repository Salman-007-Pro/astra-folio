import { describe, it, expect } from "vitest";
import {
  initialState,
  initialOptions,
  runDemo,
} from "../../apps/web/src/lab/model";
import { portfolioSchema } from "../../packages/content-schema/src";
import { seed } from "../../packages/content-schema/src/seed";
import { contactLinks } from "../../apps/web/src/lib/contact";
describe("engineering scenarios", () => {
  it("routes around an offline replica and reports total loss", () => {
    let s = initialState;
    for (let i = 0; i < 6; i++) {
      s = runDemo("routing", s, { ...initialOptions, offline: true });
      expect(s.nodes).not.toContain("Replica 1");
      expect(s.error).toBe(false);
    }
    expect(
      runDemo("routing", s, { ...initialOptions, replicas: 1, offline: true })
        .error,
    ).toBe(true);
  });
  it("caches a source read and supports invalidation", () => {
    let s = runDemo("cache", initialState, initialOptions);
    expect(s.nodes).toContain("Cache MISS");
    s = runDemo("cache", s, initialOptions);
    expect(s.nodes).toContain("Cache HIT");
    expect(
      runDemo("cache", { ...s, cached: false }, initialOptions).nodes,
    ).toContain("Cache MISS");
  });
  it("retries a failed job and suppresses a completed duplicate", () => {
    let s = runDemo("jobs", initialState, { ...initialOptions, fail: true });
    expect(s.completed).toBe(false);
    s = runDemo("jobs", s, initialOptions);
    expect(s.completed).toBe(true);
    expect(runDemo("jobs", s, initialOptions).message).toContain(
      "Duplicate suppressed",
    );
  });
  it("distinguishes authentication and authorization", () => {
    expect(runDemo("auth", initialState, initialOptions).nodes).toContain(
      "401 sign in",
    );
    expect(
      runDemo("auth", initialState, { ...initialOptions, role: "member" })
        .nodes,
    ).toContain("403 forbidden");
    expect(
      runDemo("auth", initialState, { ...initialOptions, role: "admin" }).error,
    ).toBe(false);
  });
  it("distinguishes pipeline checks from production request failure", () => {
    expect(
      runDemo("pipeline", initialState, { ...initialOptions, fail: true })
        .nodes,
    ).not.toContain("Deployed");
    const s = runDemo("pipeline", initialState, {
      ...initialOptions,
      requestFail: true,
    });
    expect(s.nodes).toContain("Deployed");
    expect(s.nodes).toContain("GET /orders · 500");
  });
  it("wallet rejection cannot confirm a transaction", () => {
    let s = runDemo("wallet", initialState, initialOptions);
    s = runDemo("wallet", s, { ...initialOptions, fail: true });
    expect(s.phase).toBe(0);
    expect(s.message).toContain("No transaction sent");
  });
  it("old snapshots retain their own WhatsApp number and receive lab defaults", () => {
    const { techLab, motivation, ...site } = seed.site;
    const parsed = portfolioSchema.parse({
      ...seed,
      site,
      profile: {
        ...seed.profile,
        collaboration: { whatsappNumber: "+1 555 0100" },
      },
    });
    expect(contactLinks(parsed.profile).whatsapp).toContain("/15550100?");
    expect(parsed.site.techLab.technologies.length).toBeGreaterThan(30);
    expect(parsed.site.motivation.intervalSeconds).toBe(20);
  });
});
