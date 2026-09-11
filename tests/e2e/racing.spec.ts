import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import content from "../../content/portfolio.json" with { type: "json" };

test.beforeEach(async ({ page }) => {
  await page.goto("/play");
  await page
    .getByRole("button", { name: "Racing Classic", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start race", exact: true }),
  ).toBeVisible();
  await page.clock.install({ time: new Date("2026-09-12T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-09-12T00:00:01Z"));
});

test("race pauses, steers with buttons and keys, and offers replay after a collision", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Start race", exact: true }).click();
  const screen = page.getByRole("group", {
    name: "Racing Classic game screen",
  });
  await screen.press("ArrowRight");
  await expect(page.locator(".lcd-player")).toHaveAttribute("data-lane", "1");
  await screen.press("Space");
  const row = await page
    .locator(".lcd-traffic")
    .first()
    .getAttribute("data-row");
  await page.clock.runFor(3000);
  await expect(page.locator(".lcd-traffic").first()).toHaveAttribute(
    "data-row",
    row!,
  );
  await page.getByRole("button", { name: "Resume race", exact: true }).click();
  await page.getByRole("button", { name: "Steer left" }).click();
  await expect(page.locator(".lcd-player")).toHaveAttribute("data-lane", "0");
  await page.getByRole("button", { name: "Steer right" }).click();
  await page.clock.runFor(4000);
  const result = page.locator(".round-result");
  await expect(result).toBeVisible();
  expect(content.site.games.lossQuotes).toContain(
    await result.locator("p").innerText(),
  );
  await result.getByRole("button", { name: "Play again" }).click();
  await expect(page.locator("[data-race-score]")).toHaveText("0000");
  await expect(screen).toBeFocused();
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Resume race", exact: true }),
  ).toBeVisible();
});

test("a complete race is winnable and its best score survives reload", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.getByRole("button", { name: "Start race", exact: true }).click();
  for (
    let step = 0;
    step < 250 && (await page.locator(".round-result").count()) === 0;
    step++
  ) {
    const traffic = await page.locator(".lcd-traffic").evaluateAll((cars) =>
      cars.map((car) => ({
        lane: Number(car.getAttribute("data-lane")),
        row: Number(car.getAttribute("data-row")),
      })),
    );
    const approaching = traffic.find((car) => car.row >= 10 && car.row < 19);
    if (approaching)
      await page
        .getByRole("button", {
          name: approaching.lane === 0 ? "Steer right" : "Steer left",
        })
        .click();
    await page.clock.runFor(240);
  }
  const result = page.locator(".round-result");
  await expect(result).toContainText("Beautifully played.");
  expect(content.site.games.winQuotes).toContain(
    await result.locator("p").innerText(),
  );
  await expect(page.locator("[data-race-score]")).toHaveText("2000");
  await expect(page.locator("[data-race-best]")).toHaveText("2000");
  await page.reload();
  await page
    .getByRole("button", { name: "Racing Classic", exact: true })
    .click();
  await expect(page.locator("[data-race-best]")).toHaveText("2000");
});

test("racing fits small screens and remains readable in every palette", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Viewport and palette matrix runs once.");
  test.setTimeout(120000);
  await page.clock.resume();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
      `${width}px overflow`,
    ).toBeLessThanOrEqual(1);
  }
  for (const night of [false, true]) {
    for (const palette of ["Garden", "Ocean", "Ember"]) {
      await page
        .getByRole("button", { name: "Experience settings", exact: true })
        .click();
      await page.locator("#pref-night").setChecked(night);
      await page
        .getByRole("group", {
          name: `${night ? "Dark" : "Light"} color palette`,
        })
        .getByRole("radio", { name: palette })
        .check();
      await page.keyboard.press("Escape");
      const results = await new AxeBuilder({ page })
        .exclude("astro-dev-toolbar")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect
        .soft(
          results.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          `${palette} ${night}`,
        )
        .toEqual([]);
    }
  }
});
