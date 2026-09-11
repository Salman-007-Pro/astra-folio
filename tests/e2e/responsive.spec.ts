import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/about",
  "/play",
  "/contact",
  "/cv",
  "/reading",
  "/work",
  "/work/metadata-driven-connectors",
  "/work/discovery-workflows",
  "/work/build-modernization",
  "/work/cargobarn",
  "/work/kinetic-garden",
  "/writing",
  "/writing/html-before-webgl",
  "/writing/explicit-async-states",
  "/writing/compatibility-before-migration",
  "/404.html",
];

for (const width of [320, 360, 390, 430, 768, 1024]) {
  test(`responsive pages fit at ${width}px`, async ({ page, isMobile }) => {
    test.skip(
      isMobile,
      "Viewport matrix runs once in the desktop Chromium project.",
    );
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return {
          overflow: document.documentElement.scrollWidth - width,
          offenders: Array.from(document.querySelectorAll("main *, header *"))
            .filter((el) => {
              const box = el.getBoundingClientRect();
              return box.width > 0 && (box.right > width + 1 || box.left < -1);
            })
            .slice(0, 12)
            .map((el) => `${el.tagName}.${el.className}`),
        };
      });
      expect
        .soft(layout.overflow, `${route}: ${layout.offenders.join(", ")}`)
        .toBeLessThanOrEqual(1);
    }
  });
}

for (const viewport of [
  { width: 320, height: 740 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
  { width: 768, height: 1024 },
]) {
  test(`sidebar remains usable at ${viewport.width}x${viewport.height}`, async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      "Viewport matrix runs once in the desktop Chromium project.",
    );
    await page.setViewportSize(viewport);
    await page.goto("/about");
    await page.evaluate(() =>
      window.scrollTo({ top: 450, behavior: "instant" }),
    );
    const originalScroll = await page.evaluate(() => scrollY);
    const originalTop = await page
      .locator("main")
      .evaluate((el) => el.getBoundingClientRect().top);
    const trigger = page.getByRole("button", {
      name: "Open navigation",
      exact: true,
    });
    const drawer = page.getByRole("dialog", { name: "Find your way." });
    const close = drawer.getByRole("button", { name: "Close navigation" });
    // Use a direct pointer click: locator.click() scrolls this sticky control
    // before clicking, which would invalidate the scroll-preservation check.
    const triggerBounds = (await trigger.boundingBox())!;
    await page.mouse.click(
      triggerBounds.x + triggerBounds.width / 2,
      triggerBounds.y + triggerBounds.height / 2,
    );
    await expect(drawer).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(close).toBeFocused();
    await expect(drawer.locator('a[aria-current="page"]')).toHaveText(/About/);
    await expect
      .poll(async () => (await drawer.boundingBox())?.x)
      .toBeGreaterThanOrEqual(23);
    await expect
      .poll(async () => (await drawer.boundingBox())?.x)
      .toBeLessThan(30 + Math.max(0, viewport.width - 424));
    const bounds = await drawer.boundingBox();
    expect(bounds!.height).toBeCloseTo(viewport.height, 0);
    expect(bounds!.y).toBeCloseTo(0, 0);
    expect(
      await page
        .locator("main")
        .evaluate((el) => el.getBoundingClientRect().top),
    ).toBeCloseTo(originalTop, 0);
    await page.mouse.move(8, 180);
    await page.mouse.wheel(0, 500);
    expect(
      await page
        .locator("main")
        .evaluate((el) => el.getBoundingClientRect().top),
    ).toBeCloseTo(originalTop, 0);

    const firstLink = drawer.getByRole("link", { name: "Salman Asif, home" });
    await firstLink.focus();
    await page.keyboard.press("Shift+Tab");
    await expect(
      drawer.getByRole("link", { name: "Recruiter view" }),
    ).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(firstLink).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeCloseTo(originalScroll, 0);

    await trigger.click();
    await expect(drawer).toBeVisible();
    await page.mouse.click(8, 180);
    await expect(drawer).not.toBeVisible();
    await trigger.click();
    await drawer.getByRole("link", { name: "Work", exact: false }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.locator("html")).not.toHaveClass(/dialog-open/);
  });
}

test("mobile anchors, dialog accessibility, and rotation", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Runs once with an explicit phone viewport.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  const drawer = page.getByRole("dialog", { name: "Find your way." });
  await trigger.click();
  const accessibility = await new AxeBuilder({ page })
    .include("#mobile-menu")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await drawer.getByRole("link", { name: /Experience/ }).click();
  await expect(page).toHaveURL(/#experience$/);
  await expect(drawer).not.toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/dialog-open/);
  await expect
    .poll(async () => (await page.locator("#experience").boundingBox())!.y)
    .toBeGreaterThanOrEqual(84);
  await expect
    .poll(async () => (await page.locator("#experience").boundingBox())!.y)
    .toBeLessThan(160);
  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(drawer).not.toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/dialog-open/);
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
});

test("mobile hero scene clears wrapped copy and touch controls", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Runs once with explicit phone viewports.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page
      .getByRole("button", { name: "Unfold the signal seed" })
      .waitFor({ state: "visible" });
    await expect
      .poll(async () =>
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
