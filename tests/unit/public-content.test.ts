import { describe, it, expect } from "vitest";
import {
  absoluteMediaUrl,
  portfolioSchema,
  projectSchema,
  withAvatarUrl,
} from "../../packages/content-schema/src/index";
import { seed } from "../../packages/content-schema/src/seed";
import {
  toPublicProfile,
  toPublicProject,
} from "../../apps/cms/src/public-content";
describe("CMS public project mapping", () => {
  it("maps lifecycle to status and ignores draft _status", () => {
    const source = seed.projects[0];
    const mapped = toPublicProject({
      ...source,
      lifecycle: source.status,
      _status: "draft",
      stack: source.stack.map((value) => ({ value })),
      constraints: source.constraints.map((value) => ({ value })),
      architecture: source.architecture.map((value) => ({ value })),
    });
    const project = projectSchema.parse(mapped);
    expect(project.status).toBe(source.status);
    expect(project.status).not.toBe("draft");
    expect(project).not.toHaveProperty("lifecycle");
    expect(project).not.toHaveProperty("_status");
  });
});
describe("CMS profile avatar mapping", () => {
  it("turns a relative media path into an absolute CMS URL", () => {
    expect(
      absoluteMediaUrl(
        { url: "/api/media/file/salman-red-background.png" },
        "https://cms.salmanasif.pro",
      ),
    ).toBe(
      "https://cms.salmanasif.pro/api/media/file/salman-red-background.png",
    );
  });
  it("builds a media URL from filename when Payload omits url", () => {
    expect(
      absoluteMediaUrl(
        { filename: "Salman Red background.png" },
        "https://cms.salmanasif.pro",
      ),
    ).toBe(
      "https://cms.salmanasif.pro/api/media/file/Salman%20Red%20background.png",
    );
  });
  it("leaves avatarUrl empty when Profile has no avatar", () => {
    const profile = toPublicProfile(seed.profile, null);
    expect(
      portfolioSchema.parse({ ...seed, profile }).profile.avatarUrl,
    ).toBeNull();
  });
  it("maps Profile.avatar onto profile.avatarUrl", () => {
    const profile = toPublicProfile(seed.profile, {
      url: "https://cms.salmanasif.pro/api/media/file/avatar.png",
    });
    expect(portfolioSchema.parse({ ...seed, profile }).profile.avatarUrl).toBe(
      "https://cms.salmanasif.pro/api/media/file/avatar.png",
    );
  });
  it("fills avatarUrl from Profile.avatar when the portfolio snapshot omits it", () => {
    const content = portfolioSchema.parse(seed);
    expect(
      withAvatarUrl(
        content,
        {
          url: "https://cms.salmanasif.pro/api/media/file/Salman%20Red%20background.png",
        },
        "https://cms.salmanasif.pro",
      ).profile.avatarUrl,
    ).toBe(
      "https://cms.salmanasif.pro/api/media/file/Salman%20Red%20background.png",
    );
  });
});
describe("CMS avatar fallback", () => {
  it("treats JSON error payloads as unusable images", async () => {
    const { isImageResponse } = await import("../../apps/web/src/lib/avatar");
    expect(isImageResponse(500, "application/json")).toBe(false);
    expect(isImageResponse(404, "application/json")).toBe(false);
    expect(isImageResponse(200, "image/png")).toBe(true);
  });
});
