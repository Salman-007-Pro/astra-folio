import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import content from "../../content/portfolio.json" with { type: "json" };

test("card flip can be completed using the cards a visitor reveals", async ({
  page,
}) => {
  await page.goto("/play");
  await page.getByRole("button", { name: "Start card flip" }).click();
  const cards = page.locator(".memory-card");
  const known = new Map<string, number[]>();
  for (let index = 0; index < 12; index += 2) {
    for (const i of [index, index + 1]) {
      await cards.nth(i).click();
      const label = (await cards.nth(i).getAttribute("aria-label"))!;
      const symbol = label.split(": ")[1].split(",")[0];
      known.set(symbol, [...(known.get(symbol) || []), i]);
    }
    await expect(
      page.locator(".memory-card.is-flipped:not(.is-matched)"),
    ).toHaveCount(0);
  }
  for (const pair of known.values()) {
    if (await cards.nth(pair[0]).isDisabled()) continue;
    await cards.nth(pair[0]).click();
    await cards.nth(pair[1]).click();
  }
  const result = page.locator(".round-result");
  await expect(result).toContainText("Beautifully played.");
  expect(content.site.games.winQuotes).toContain(
    await result.locator("p").innerText(),
  );
  await expect(result).toBeFocused();
  await result.getByRole("button", { name: "Play again" }).click();
  await expect(result).toHaveCount(0);
  await expect(page.locator(".game-stats")).toContainText("0 / 6");
});

test("snake supports pause, mobile direction controls, loss quotes, and replay", async ({
  page,
}) => {
  await page.goto("/play");
  await page.getByRole("button", { name: "Snake", exact: true }).click();
  await page.getByRole("button", { name: "Start snake" }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Resume snake" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Move up" })).toBeDisabled();
  await page.getByRole("button", { name: "Resume snake" }).click();
  await page.getByRole("button", { name: "Move up" }).click();
  const result = page.locator(".round-result");
  await expect(result).toBeVisible({ timeout: 6000 });
  expect(content.site.games.lossQuotes).toContain(
    await result.locator("p").innerText(),
  );
  await result.getByRole("button", { name: "Play again" }).click();
  await expect(
    page.getByRole("group", { name: "Snake game board" }),
  ).toBeFocused();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Resume snake" }),
  ).toBeVisible();
});

test("shooter targets respond to pointer and keyboard and finish with a win", async ({
  page,
  isMobile,
}) => {
  await page.goto("/play");
  await page.getByRole("button", { name: "Shooter", exact: true }).click();
  await page.getByRole("button", { name: "Start shooter" }).click();
  const arena = page.getByRole("group", { name: "Orbit shooter arena" });
  for (let hit = 0; hit < 15; hit++) {
    const target = arena.getByRole("button", { name: /Shoot target/ }).first();
    await expect(target).toBeVisible();
    if (hit % 2) {
      await arena.focus();
      await page.keyboard.press("Enter");
    } else {
      const box = (await target.boundingBox())!;
      if (isMobile)
        await page.touchscreen.tap(
          box.x + box.width / 2,
          box.y + box.height / 2,
        );
      else
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }
    await expect(page.locator(".game-stats")).toContainText(`${hit + 1} / 15`);
  }
  const result = page.locator(".round-result");
  await expect(result).toContainText("Beautifully played.");
  expect(content.site.games.winQuotes).toContain(
    await result.locator("p").innerText(),
  );
});

test("settings pause a round and remember independent light and dark palettes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/play");
  await page.getByRole("button", { name: "Start card flip" }).click();
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  const light = page.getByRole("group", { name: "Light color palette" });
  const dark = page.getByRole("group", { name: "Dark color palette" });
  await light.getByRole("radio", { name: "Ocean" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "ocean");
  await page.locator("#pref-night").check();
  await expect(light).not.toBeVisible();
  await dark.getByRole("radio", { name: "Ember" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "ember");
  await page.locator("#pref-night").uncheck();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "ocean");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Resume card flip" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "day");
  await expect(page.locator("html")).toHaveAttribute("data-palette", "ocean");
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page.locator("#pref-night").check();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "ember");
});

test("new palettes apply in light and dark modes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/about");
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Light color palette" })
    .getByRole("radio", { name: "Noir" })
    .check();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "noir");
  await page.locator("#pref-night").check();
  await page
    .getByRole("group", { name: "Dark color palette" })
    .getByRole("radio", { name: "Dusk" })
    .check();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "dusk");
});

test("all six palettes keep play and settings accessible", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "Palette matrix runs once; mobile gameplay is covered separately.",
  );
  test.setTimeout(120000);
  await page.goto("/play");
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
      let results = await new AxeBuilder({ page })
        .exclude("astro-dev-toolbar")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect
        .soft(
          results.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          `${palette} settings ${night}`,
        )
        .toEqual([]);
      await page.keyboard.press("Escape");
      results = await new AxeBuilder({ page })
        .exclude("astro-dev-toolbar")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect
        .soft(
          results.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          `${palette} play ${night}`,
        )
        .toEqual([]);
    }
  }
});
