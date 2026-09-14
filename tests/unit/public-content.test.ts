import { describe, it, expect } from "vitest";
import { projectSchema } from "../../packages/content-schema/src/index";
import { seed } from "../../packages/content-schema/src/seed";
import { toPublicProject } from "../../apps/cms/src/public-content";
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
