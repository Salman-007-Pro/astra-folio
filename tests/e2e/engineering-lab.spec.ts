import { test, expect } from "@playwright/test";
import content from "../../content/portfolio.json" with { type: "json" };
import { visualStyles } from "../../apps/web/src/lib/visual-styles";
import AxeBuilder from "@axe-core/playwright";
test("lab scenes visibly animate and pause without disabling controls", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#skills");
  const lab = page.locator(".engineering-lab");
  await expect(lab.locator(".lab-run")).toBeEnabled();
  await lab.locator(".lab-stage").scrollIntoViewIfNeeded();
  await expect(lab.locator(".lab-stage")).toHaveAttribute(
    "data-running",
    "false",
  );
  for (const name of ["CSS", "PostgreSQL", "Three.js"]) {
    await lab.getByRole("button", { name, exact: true }).click();
    await lab
      .getByRole("button", { name: "Play lab animation", exact: true })
      .click();
    const canvas = lab.locator("canvas");
    await expect(canvas).toBeVisible();
    const before = await canvas.screenshot();
    await page.waitForTimeout(650);
    expect(
      (await canvas.screenshot()).equals(before),
      `${name} should animate`,
    ).toBe(false);
    await lab
      .getByRole("button", { name: "Pause lab animation", exact: true })
      .click();
    await expect(lab.locator(".lab-stage")).toHaveAttribute(
      "data-running",
      "false",
    );
    await page.waitForTimeout(250);
    const paused = await canvas.screenshot();
    await page.waitForTimeout(400);
    expect(
      (await canvas.screenshot()).equals(paused),
      `${name} should stay still`,
    ).toBe(true);
    await lab.locator(".lab-run").click();
    await expect(lab.getByRole("status")).not.toContainText("Ready.");
  }
});
test("3D variants reuse the canvas and mesh controls reset correctly", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#skills");
  const lab = page.locator(".engineering-lab");
  await expect(lab.locator(".lab-run")).toBeEnabled();
  await lab.locator(".lab-stage").scrollIntoViewIfNeeded();
  await expect(lab.locator("canvas")).toHaveCount(1);
  await lab
    .locator("canvas")
    .evaluate((canvas) => canvas.setAttribute("data-original-canvas", "true"));
  for (const [name, family] of [
    ["React", "tree"],
    ["PostgreSQL", "database"],
    ["React Native", "phone"],
    ["Blockchain / dApps", "chain"],
    ["Three.js", "sculpture"],
  ]) {
    await lab.getByRole("button", { name, exact: true }).click();
    await lab.locator(".lab-stage").scrollIntoViewIfNeeded();
    await expect(lab.locator(".lab-stage")).toHaveAttribute(
      "data-scene",
      family,
    );
    await expect(lab.locator("canvas")).toHaveAttribute(
      "data-original-canvas",
      "true",
    );
  }
  for (const shape of ["sphere", "torus", "crystal", "knot"]) {
    await lab.getByLabel("Geometry", { exact: true }).selectOption(shape);
    await expect(lab.getByLabel("Geometry", { exact: true })).toHaveValue(
      shape,
    );
  }
  for (const finish of ["metal", "wireframe", "ceramic"]) {
    await lab.getByLabel("Material", { exact: true }).selectOption(finish);
    await expect(lab.getByLabel("Material", { exact: true })).toHaveValue(
      finish,
    );
  }
  await lab.getByLabel("Mesh rotation").fill("90");
  await expect(lab.getByLabel("Mesh rotation")).toHaveValue("90");
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("45 degrees");
  await lab.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(lab.getByLabel("Mesh rotation")).toHaveValue("0");
  await expect(lab.getByLabel("Geometry", { exact: true })).toHaveValue("knot");
  await expect(lab.getByLabel("Material", { exact: true })).toHaveValue(
    "ceramic",
  );
  expect(errors).toEqual([]);
});
test("Lab and quotations remain usable without WebGL or motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?webgl=off#skills");
  const lab = page.locator(".engineering-lab");
  await expect(lab.locator(".lab-run")).toBeEnabled();
  await lab.locator(".lab-run").focus();
  await page.keyboard.press("Enter");
  await expect(lab.getByRole("status")).toContainText("Layout:");
  await expect(lab.locator("canvas")).toHaveCount(0);
  await expect(lab.locator(".lab-stage")).toHaveAttribute(
    "data-running",
    "false",
  );
  const violations = (
    await new AxeBuilder({ page })
      .include(".engineering-lab")
      .include("#motivation")
      .analyze()
  ).violations;
  expect(violations).toEqual([]);
  await page.locator("#motivation").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("button", { name: "Play quote rotation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next quote" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-quote-counter]")).toHaveText("02 / 04");
});
test("a lost Lab WebGL context leaves its controls usable", async ({
  page,
}) => {
  await page.goto("/#skills");
  const lab = page.locator(".engineering-lab");
  await lab.locator(".lab-stage").scrollIntoViewIfNeeded();
  await expect(lab.locator("canvas")).toHaveCount(1);
  await lab.locator("canvas").evaluate((canvas) => {
    (canvas as HTMLCanvasElement)
      .getContext("webgl2")
      ?.getExtension("WEBGL_lose_context")
      ?.loseContext();
  });
  await expect(lab.locator("canvas")).toHaveCount(0);
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("Layout:");
});
test("every technology has an operable demo and its own explanation", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?webgl=off#skills");
  const lab = page.locator(".engineering-lab");
  await expect(
    lab.getByRole("button", { name: "CSS", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  for (const tech of content.site.techLab.technologies) {
    await lab.getByRole("button", { name: tech.name, exact: true }).click();
    await expect(lab.locator(".lab-title")).toHaveText(tech.name);
    await expect(lab.locator(".lab-code code")).toHaveText(tech.code);
    await lab.locator(".lab-run").click();
    await expect(lab.getByRole("status")).not.toContainText("Ready.");
  }
  expect(errors).toEqual([]);
  await page.goto("/reading");
  await expect(page.locator(".reading-toolkit")).toContainText("Node.js");
  await expect(page.locator(".engineering-lab canvas")).toHaveCount(0);
});
test("architecture controls expose failure and recovery", async ({ page }) => {
  await page.goto("/?webgl=off#skills");
  const lab = page.locator(".engineering-lab");
  await lab.getByRole("button", { name: /System Design/ }).click();
  await lab.getByLabel("Replicas", { exact: true }).selectOption("1");
  await lab.getByLabel("Take replica 1 offline").check();
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("No healthy replicas");
  await lab.getByLabel("Replicas", { exact: true }).selectOption("3");
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("2 healthy");
  await lab.getByRole("button", { name: /03\s*Caching/ }).click();
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("Cache miss");
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("Cache hit");
  await lab.getByRole("button", { name: "Expire / invalidate" }).click();
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("Cache miss");
  await lab.getByRole("button", { name: /04\s*Background jobs/ }).click();
  await lab.getByLabel("Simulate failure").check();
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("Transient failure");
  await lab.getByLabel("Simulate failure").uncheck();
  await lab.locator(".lab-run").click();
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("Duplicate suppressed");
  await lab.getByRole("button", { name: /05\s*Authentication/ }).click();
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText(
    "Authentication required",
  );
  await lab.getByLabel("Caller role").selectOption("member");
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("not authorized");
  await lab.getByLabel("Caller role").selectOption("admin");
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("allowed");
  await lab.getByRole("button", { name: /06\s*Delivery/ }).click();
  await lab.getByLabel("Fail a test", { exact: true }).check();
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("blocks deployment");
  await lab.getByLabel("Fail a test", { exact: true }).uncheck();
  await lab.getByLabel("Fail a request after deployment").check();
  await lab.locator(".lab-run").click();
  await expect(lab.getByRole("status")).toContainText("database timeout");
});
test("quotes rotate after 20 visible seconds and pause during interaction", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/?webgl=off#motivation");
  const section = page.locator("#motivation");
  await section.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.runFor(500);
  await page.clock.pauseAt(
    new Date(await page.evaluate(() => Date.now() + 1000)),
  );
  await section.getByRole("button", { name: "Next quote" }).click();
  await section.getByRole("button", { name: "Previous quote" }).click();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
  });
  await page.mouse.move(0, 0);
  await expect(section.locator("[data-quote-counter]")).toHaveText("01 / 04");
  await page.clock.runFor(19000);
  await expect(section.locator("[data-quote-counter]")).toHaveText("01 / 04");
  await page.clock.runFor(1500);
  await expect(section.locator("[data-quote-counter]")).toHaveText("02 / 04");
  await section.getByRole("button", { name: "Pause quote rotation" }).click();
  await page.clock.runFor(21000);
  await expect(section.locator("[data-quote-counter]")).toHaveText("02 / 04");
  await section.getByRole("button", { name: "Next quote" }).click();
  await expect(section.locator("[data-quote-counter]")).toHaveText("03 / 04");
});
test("new sections fit every visual style and mode", async ({ page }) => {
  test.setTimeout(120000);
  await page.goto("/?webgl=off#skills");
  for (const width of [320, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const style of visualStyles)
      for (const theme of ["day", "night"]) {
        await page.evaluate(
          ({ style, theme }) => {
            document.documentElement.dataset.style = style;
            document.documentElement.dataset.theme = theme;
          },
          { style: style.id, theme },
        );
        const fit = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          sections: [
            ...document.querySelectorAll(
              ".engineering-lab,.motivation-section",
            ),
          ].every((el) => {
            const r = el.getBoundingClientRect();
            return r.left >= -1 && r.right <= innerWidth + 1;
          }),
        }));
        expect(fit, `${style.id} ${theme} ${width}`).toEqual({
          overflow: false,
          sections: true,
        });
      }
  }
});
