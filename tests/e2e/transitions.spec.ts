import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/about");
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
});

test("five transitions switch styles, clean up, and persist", async ({
  page,
}) => {
  await expect(page.locator("[data-style-transition]")).toHaveCount(5);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [i, effect] of [
    "fade",
    "fold",
    "pixels",
    "curtain",
    "circle",
  ].entries()) {
    await page.locator(`[data-style-transition][value="${effect}"]`).check();
    await page
      .locator(`[data-visual-style][value="${i % 2 ? "clay" : "cartoon"}"]`)
      .check();
    await expect(page.locator("html")).toHaveAttribute(
      "data-style",
      i % 2 ? "clay" : "cartoon",
    );
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-transition-running",
    );
    await expect(page.locator(".style-pixel-overlay")).toHaveCount(0);
    await expect(page.locator("#experience-settings")).toBeVisible();
    expect(
      await page.evaluate(() => document.activeElement?.closest("dialog")?.id),
    ).toBe("experience-settings");
  }
  await page.reload();
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await expect(
    page.locator('[data-style-transition][value="circle"]'),
  ).toBeChecked();
  expect(errors).toEqual([]);
});

test("pixel squares cover the viewport in ten columns and rapid changes remain usable", async ({
  page,
}) => {
  await page.locator('[data-style-transition][value="pixels"]').check();
  await page.locator('[data-visual-style][value="clay"]').check();
  const geometry = await page.locator(".style-pixel-overlay").evaluate((el) => {
    const tile = el.firstElementChild!.getBoundingClientRect();
    return {
      count: el.children.length,
      columns: getComputedStyle(el).gridTemplateColumns.split(" ").length,
      width: tile.width,
      size: innerWidth / 10,
      rows: Math.ceil(innerHeight / (innerWidth / 10)),
      topLayer: el.matches(":popover-open"),
    };
  });
  expect(geometry.columns).toBe(10);
  expect(geometry.count).toBe(geometry.rows * 10);
  expect(geometry.topLayer).toBe(true);
  // Change while tiles are moving; no overlay may retain input or stale state.
  await page.locator('[data-visual-style][value="vintage"]').check();
  await page.locator('[data-visual-style][value="doodle"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-style", "doodle");
  await expect(page.locator(".style-pixel-overlay")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.locator("#experience-settings")).not.toBeVisible();
});

test("motion preferences and resizing safely finish an in-flight transition", async ({
  page,
}) => {
  await page.locator('[data-style-transition][value="pixels"]').check();
  await page.locator('[data-visual-style][value="clay"]').check();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".style-pixel-overlay")).toHaveCount(0);
  await page.locator('[data-visual-style][value="vintage"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-style", "vintage");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-transition-running",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#pref-motion").check();
  await page.locator('[data-visual-style][value="doodle"]').check();
  await page.setViewportSize({ width: 620, height: 700 });
  await expect(page.locator(".style-pixel-overlay")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-style", "doodle");
});

test("unsupported View Transitions fall back without breaking selection", async ({
  page,
}) => {
  await page.evaluate(() =>
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
    }),
  );
  await page.locator('[data-style-transition][value="fold"]').check();
  await page.locator('[data-visual-style][value="clay"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-style", "clay");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-transition-running",
  );
});
