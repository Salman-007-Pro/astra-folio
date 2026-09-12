import { test, expect } from "@playwright/test";
import { visualStyles } from "../../apps/web/src/lib/visual-styles";

test("Styles stays above every footer without clipped links or year", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/about");
  for (const width of [320, 390, 780, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const style of visualStyles) {
      await page.evaluate((style) => {
        document.documentElement.dataset.style = style;
        window.dispatchEvent(new Event("garden:layout"));
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "instant",
        });
      }, style.id);
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const footer = document
                .querySelector(".site-footer")!
                .getBoundingClientRect();
              const trigger = document
                .querySelector(".settings-trigger")!
                .getBoundingClientRect();
              return Math.round(footer.top - trigger.bottom);
            }),
          { message: `${style.id} at ${width}px` },
        )
        .toBeGreaterThanOrEqual(16);
      const layout = await page.locator(".site-footer").evaluate((footer) => {
        const rect = footer.getBoundingClientRect();
        const links = [...footer.querySelectorAll("a, .footer-year")].map(
          (el) => el.getBoundingClientRect(),
        );
        const row = footer
          .querySelector(".footer-links")!
          .getBoundingClientRect();
        const year = footer
          .querySelector(".footer-year")!
          .getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          contained: links.every(
            (link) => link.left >= rect.left && link.right <= rect.right + 1,
          ),
          yearRight: Math.abs(row.right - year.right),
        };
      });
      expect(layout.overflow, `${style.id} ${width}`).toBe(false);
      expect(layout.contained, `${style.id} ${width}`).toBe(true);
      expect(layout.yearRight).toBeLessThan(2);
    }
  }
});

test("cursor follows style and mode and restores the default pointer", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Touch devices do not show mouse cursors");
  await page.goto("/about");
  const cursors = new Set<string>();
  for (const style of ["cyberpunk", "pixel", "paper", "glass", "doodle"]) {
    await page
      .getByRole("button", { name: "Experience settings", exact: true })
      .click();
    await page.locator("#pref-motion").uncheck();
    await page.locator(`[data-visual-style][value="${style}"]`).check();
    const cursor = await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).cursor);
    expect(cursor).toContain("data:image/svg+xml");
    cursors.add(cursor);
  }
  expect(cursors.size).toBe(5);
  const before = [...cursors].at(-1);
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.locator("#pref-night").check();
  expect(
    await page.locator("body").evaluate((el) => getComputedStyle(el).cursor),
  ).not.toBe(before);
  await page.locator('[data-visual-style][value="default"]').check();
  expect(
    await page.locator("body").evaluate((el) => getComputedStyle(el).cursor),
  ).toBe("auto");
});

test("style sounds differ, stay opt-in, and stop creating notes when muted", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const audioNotes: number[] = [];
    Object.assign(window, { audioNotes });
    const Base = window.AudioContext;
    window.AudioContext = class extends Base {
      createOscillator() {
        const oscillator = super.createOscillator();
        const set = oscillator.frequency.setValueAtTime.bind(
          oscillator.frequency,
        );
        oscillator.frequency.setValueAtTime = (value, time) => {
          audioNotes.push(value);
          return set(value, time);
        };
        return oscillator;
      }
    };
  });
  await page.goto("/about");
  const notes = () =>
    page.evaluate(
      () => (window as unknown as { audioNotes: number[] }).audioNotes,
    );
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.locator('[data-visual-style][value="pixel"]').check();
  expect(await notes()).toHaveLength(0);
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.locator("#pref-sound").check();
  await expect.poll(notes).toContain(330);
  await page.locator('[data-visual-style][value="glass"]').check();
  await expect.poll(notes).toContain(880);
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.locator("#pref-sound").uncheck();
  const muted = (await notes()).length;
  await page.locator('[data-visual-style][value="cyberpunk"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-style", "cyberpunk");
  expect((await notes()).length).toBe(muted);
});
