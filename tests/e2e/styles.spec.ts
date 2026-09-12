import { test, expect } from "@playwright/test";
import { visualStyles } from "../../apps/web/src/lib/visual-styles";

test("all ten styles switch in both themes and persist across routes", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Your kind of garden." });
  await expect(dialog.locator("[data-visual-style]")).toHaveCount(10);
  for (const night of [false, true]) {
    await page.locator("#pref-night").setChecked(night);
    for (const style of visualStyles) {
      await dialog.locator(`[data-visual-style][value="${style.id}"]`).check();
      await expect(page.locator("html")).toHaveAttribute(
        "data-style",
        style.id,
      );
      await expect(
        dialog.locator(`[data-visual-style][value="${style.id}"]`),
      ).toBeChecked();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      expect(overflow, `${style.id} overflow`).toBe(false);
    }
  }
  await dialog.getByRole("button", { name: "Explore this style" }).click();
  await expect(dialog).not.toBeVisible();
  await page.goto("/about");
  await expect(page.locator("html")).toHaveAttribute("data-style", "aurora");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await expect(
    page.locator('[data-visual-style][value="aurora"]'),
  ).toBeChecked();
  await page.locator('[data-visual-style][value="default"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-style", "default");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-style", "default");
});

test("mobile footer year aligns to the right at narrow widths", async ({
  page,
}) => {
  await page.goto("/about");
  for (const width of [320, 390, 760]) {
    await page.setViewportSize({ width, height: 844 });
    const dimensions = await page.locator(".site-footer").evaluate((footer) => {
      const row = footer.querySelector("div")!.getBoundingClientRect();
      const year = footer
        .querySelector(".footer-year")!
        .getBoundingClientRect();
      return {
        right: row.right - year.right,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(Math.abs(dimensions.right)).toBeLessThan(2);
    expect(dimensions.overflow).toBe(false);
  }
});

test("changing typography inside settings repositions the mobile scene", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await expect(page.locator(".world-stage")).toBeVisible();
  for (const style of ["pixel", "paper", "default"]) {
    await page
      .getByRole("button", { name: "Experience settings", exact: true })
      .click();
    await page.locator(`[data-visual-style][value="${style}"]`).check();
    await expect(page.locator("html")).toHaveAttribute("data-style", style);
    await page.getByRole("button", { name: "Explore this style" }).click();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const scene = document
            .querySelector(".world-stage")!
            .getBoundingClientRect();
          const copy = document
            .querySelector(".hero-copy")!
            .getBoundingClientRect();
          const footer = document
            .querySelector(".hero-bottom")!
            .getBoundingClientRect();
          return (
            scene.top >= copy.bottom + 20 && scene.bottom <= footer.top + 1
          );
        }),
      )
      .toBe(true);
  }
});

test("parallax cleans up on style change and reduced motion disables effects", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.locator("#pref-motion").check();
  await page.locator('[data-visual-style][value="parallax"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-style", "parallax");
  await page.getByRole("button", { name: "Explore this style" }).click();
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((root) =>
          parseFloat(
            (root as HTMLElement).style.getPropertyValue("--style-depth"),
          ),
        ),
    )
    .toBeGreaterThan(0);
  expect(
    await page
      .locator(".hero")
      .evaluate(
        (hero) => getComputedStyle(hero, "::before").backgroundPositionY,
      ),
  ).not.toBe("0%");
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.locator('[data-visual-style][value="glass"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-style", "glass");
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((root) =>
          (root as HTMLElement).style.getPropertyValue("--style-depth"),
        ),
    )
    .toBe("");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.locator('[data-visual-style][value="holographic"]').check();
  await expect(page.locator("html")).toHaveAttribute(
    "data-style",
    "holographic",
  );
  expect(
    await page
      .locator(".hero")
      .evaluate((hero) => getComputedStyle(hero, "::before").animationName),
  ).toBe("none");
});
