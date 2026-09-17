import { describe, it, expect } from "vitest";
import {
  portfolioSchema,
  resumeSchema,
  safeUrl,
} from "../../packages/content-schema/src/index";
import { seed } from "../../packages/content-schema/src/seed";
import {
  classifyQuality,
  chapterAt,
} from "../../apps/web/src/experience/quality";
import { compile } from "../../apps/web/node_modules/@mdx-js/mdx";
import { validateMdxTree } from "../../packages/content-schema/src/mdx-policy";
describe("published content contract", () => {
  it("validates CV-backed seed content and all internal content relationships", () => {
    const data = portfolioSchema.parse(seed);
    const slugs = new Set(data.projects.map((p) => p.slug));
    expect(slugs.size).toBe(data.projects.length);
    for (const post of data.posts)
      for (const slug of post.relatedProjects)
        expect(slugs.has(slug)).toBe(true);
    expect(data.resume.url).toMatch(/\.pdf$/);
  });
  it("rejects unsafe resume and navigation URLs", () => {
    for (const url of [
      "javascript:alert(1)",
      "data:text/html,test",
      "//evil.example/path",
    ])
      expect(safeUrl.safeParse(url).success).toBe(false);
    expect(
      resumeSchema.safeParse({ ...seed.resume, url: "javascript:alert(1)" })
        .success,
    ).toBe(false);
  });
  it("supports missing CVs without inventing a URL", () => {
    expect(resumeSchema.parse({ ...seed.resume, url: null }).url).toBeNull();
  });
  it("keeps the bundled portrait when CMS avatar URL is absent", () => {
    const data = portfolioSchema.parse(seed);
    expect(data.site.portrait.file).toBe("salman-asif-portrait.png");
    expect(data.profile.avatarUrl).toBeUndefined();
  });
  it("uses JSON appearance defaults for older CMS snapshots", () => {
    for (const site of [undefined, null])
      expect(portfolioSchema.parse({ ...seed, site }).site).toEqual(seed.site);
  });
  it("rejects empty result messages and unknown palettes", () => {
    for (const games of [
      { ...seed.site.games, winQuotes: [] },
      { ...seed.site.games, lossQuotes: [""] },
    ])
      expect(
        portfolioSchema.safeParse({ ...seed, site: { ...seed.site, games } })
          .success,
      ).toBe(false);
    expect(
      portfolioSchema.safeParse({
        ...seed,
        site: { ...seed.site, defaultPalette: "unknown" },
      }).success,
    ).toBe(false);
  });
  it("keeps existing CMS profiles compatible when contact fields have not been saved yet", () => {
    for (const collaboration of [
      undefined,
      null,
      { callNumber: null, whatsappNumber: "" },
    ]) {
      const data = portfolioSchema.parse({
        ...seed,
        profile: { ...seed.profile, collaboration },
      });
      expect(data.profile.collaboration).toEqual({
        ...seed.profile.collaboration,
        whatsappContacts: [],
      });
    }
  });
});
describe("quality governor", () => {
  it("falls back without WebGL regardless of powerful hardware", () =>
    expect(
      classifyQuality({ width: 1800, cores: 16, memory: 16, webgl: false }),
    ).toBe("FALLBACK"));
  it("respects low-memory and data-saver devices", () => {
    expect(classifyQuality({ width: 1800, cores: 16, memory: 2 })).toBe("LOW");
    expect(
      classifyQuality({ width: 1800, cores: 16, memory: 16, saveData: true }),
    ).toBe("LOW");
  });
  it("does not select desktop quality on mobile", () =>
    expect(classifyQuality({ width: 390, cores: 8, memory: 8 })).toBe(
      "MEDIUM",
    ));
  it("clamps chapter transitions at both ends", () => {
    expect(chapterAt(-10)).toBe("HERO");
    expect(chapterAt(100)).toBe("CONTACT");
  });
});
describe("trusted MDX boundary", () => {
  it.each([
    'import fs from "node:fs"\n\n# Hello',
    "{process.env.SECRET}",
    "<script>alert(1)</script>",
    "[link](javascript:alert%281%29)",
    "<div onClick={evil()}>unsafe</div>",
  ])("rejects executable or unsafe content: %s", async (source) => {
    await expect(
      compile(source, { remarkPlugins: [validateMdxTree] }),
    ).rejects.toThrow();
  });
  it("accepts code examples without executing them", async () => {
    await expect(
      compile("# Hello\n\n```js\nprocess.exit(1)\n```", {
        remarkPlugins: [validateMdxTree],
      }),
    ).resolves.toBeDefined();
  });
  it("accepts all authored notes", async () => {
    for (const post of seed.posts)
      await expect(
        compile(post.mdx, { remarkPlugins: [validateMdxTree] }),
      ).resolves.toBeDefined();
  });
});
