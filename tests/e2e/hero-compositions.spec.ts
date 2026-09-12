import { test, expect } from "@playwright/test";

test("style-specific content replaces the hero and restores the spatial scene", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".world-stage")).toBeVisible();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [style, panel] of [
    ["cyberpunk", "console"],
    ["editorial", "profile"],
    ["holographic", "gallery"],
    ["neumorphism", "dashboard"],
    ["parallax", "spatial"],
    ["pixel", "console"],
    ["default", "spatial"],
  ]) {
    await page
      .getByRole("button", { name: "Experience settings", exact: true })
      .click();
    await page.locator("#pref-motion").uncheck();
    await page.locator(`[data-visual-style][value="${style}"]`).check();
    await expect(page.locator("html")).toHaveAttribute("data-style", style);
    if (panel === "spatial") {
      await expect(page.locator(".world-stage")).toBeVisible();
      await expect(page.locator(".hero-showcase")).not.toBeVisible();
    } else {
      await expect(page.locator(`.showcase-${panel}`)).toBeVisible();
      await expect(page.locator(".world-stage")).not.toBeVisible();
      const link = page.locator(`.showcase-${panel} a`).first();
      await expect(link).toBeVisible();
      expect(await link.getAttribute("href")).toMatch(
        /^\/(work|cv|about|contact)/,
      );
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      style,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("alternate heroes fit a 320px screen and do not hide the work section", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  for (const style of [
    "cyberpunk",
    "pixel",
    "holographic",
    "editorial",
    "paper",
    "vintage",
    "doodle",
    "glass",
    "neumorphism",
  ]) {
    await page
      .getByRole("button", { name: "Experience settings", exact: true })
      .click();
    await page.locator("#pref-motion").uncheck();
    await page.locator(`[data-visual-style][value="${style}"]`).check();
    await expect(page.locator(".hero-showcase")).toBeVisible();
    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      end: document.querySelector(".hero-showcase")!.getBoundingClientRect()
        .bottom,
      next: document.querySelector(".hero-bottom")!.getBoundingClientRect().top,
    }));
    expect(geometry.overflow, style).toBe(false);
    expect(geometry.end, style).toBeLessThanOrEqual(geometry.next + 1);
    await expect(page.locator("#work .work-list")).toBeVisible();
  }
});
