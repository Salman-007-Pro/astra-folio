import { test, expect } from "@playwright/test";
import { visualStyles } from "../../apps/web/src/lib/visual-styles";

test("visual worlds fit biography, work, writing and contact in both modes", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const route of ["/about", "/work", "/writing", "/contact"]) {
    await page.goto(route);
    for (const style of visualStyles) {
      for (const theme of ["day", "night"]) {
        await page.evaluate(
          ({ style, theme }) => {
            Object.assign(document.documentElement.dataset, {
              style,
              theme,
              motion: "off",
            });
          },
          { style: style.id, theme },
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${route}, ${style.id}, ${theme}`,
        ).toBe(true);
        await expect(page.locator("h1").first()).toBeVisible();
      }
    }
  }
});

test("switching worlds changes page composition, not only type or card borders", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/work");
  await page.evaluate(() => {
    document.documentElement.dataset.style = "cyberpunk";
  });
  const rail = await page.locator(".site-header").boundingBox();
  expect(rail!.width).toBeLessThan(250);
  expect(rail!.height).toBe(1000);
  await page.evaluate(() => {
    document.documentElement.dataset.style = "editorial";
  });
  const magazine = await page
    .locator(".project-item > a")
    .first()
    .evaluate((el) => {
      const art = el.querySelector(".project-art")!.getBoundingClientRect();
      const title = el.querySelector("h3")!.getBoundingClientRect();
      return title.left > art.right && title.top < art.bottom;
    });
  expect(magazine).toBe(true);
  await page.evaluate(() => {
    document.documentElement.dataset.style = "holographic";
  });
  const offset = await page
    .locator(".project-item")
    .evaluateAll(
      (items) =>
        items[1].getBoundingClientRect().top -
        items[0].getBoundingClientRect().top,
    );
  expect(offset).toBeGreaterThan(80);
});

test("parallax planes move at distinct speeds while scroll stays native", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.locator('[data-visual-style][value="parallax"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-style", "parallax");
  const positions = () =>
    page.locator(".style-atmosphere span").evaluateAll((layers) =>
      layers.map((el) => ({
        y: el.getBoundingClientRect().y,
        background: getComputedStyle(el).backgroundPositionY,
      })),
    );
  const before = await positions();
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
  await expect
    .poll(async () => (await positions())[1].y)
    .toBeLessThan(before[1].y - 80);
  const after = await positions();
  expect(after[0].background).not.toBe(before[0].background);
  expect(Math.abs(after[1].y - before[1].y)).toBeGreaterThan(
    Math.abs(after[2].y - before[2].y),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      page
        .locator(".style-atmosphere span")
        .nth(1)
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .toBe("none");
});
