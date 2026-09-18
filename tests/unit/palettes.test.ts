import { describe, expect, it } from "vitest";
import { isPalette, paletteIds, palettes } from "../../apps/web/src/lib/palettes";
import { siteSchema } from "../../packages/content-schema/src/index";
import { seed } from "../../packages/content-schema/src/seed";

describe("color palettes", () => {
  it("exposes fifteen unique palette ids shared with the content schema", () => {
    expect(palettes).toHaveLength(15);
    expect(new Set(paletteIds).size).toBe(15);
    expect(isPalette("noir")).toBe(true);
    expect(isPalette("dusk")).toBe(true);
    expect(isPalette("unknown")).toBe(false);
    for (const id of paletteIds) {
      expect(
        siteSchema.safeParse({ ...seed.site, defaultPalette: id }).success,
      ).toBe(true);
    }
  });
});
