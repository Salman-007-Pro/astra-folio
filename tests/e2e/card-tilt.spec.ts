import { test, expect } from "@playwright/test";

const waitFrame = (page: {
  evaluate: (fn: () => Promise<void>) => Promise<void>;
}) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );

test.describe("card pointer tilt", () => {
  test.skip(({ isMobile }) => isMobile, "Fine-pointer tilt is desktop-only.");

  test("outer project card tilts with the pointer and resets on leave", async ({
    page,
  }) => {
    await page.goto("/work");
    const card = page.locator(".project-item").first();
    const art = card.locator(".project-art");
    await card.scrollIntoViewIfNeeded();
    await card.hover({ position: { x: 16, y: 24 } });
    await expect
      .poll(async () =>
        card.evaluate((el) => ({
          ry: parseFloat(el.style.getPropertyValue("--tilt-ry") || "0"),
          tilting: el.classList.contains("is-tilting"),
          innerTilt: el.querySelector(".project-art")?.hasAttribute("data-tilt"),
        })),
      )
      .toMatchObject({ tilting: true, innerTilt: false });
    const hovering = await card.evaluate((el) =>
      parseFloat(el.style.getPropertyValue("--tilt-ry") || "0"),
    );
    expect(hovering).not.toBe(0);
    expect(await art.getAttribute("data-tilt")).toBeNull();
    await page.mouse.move(24, 24);
    await expect
      .poll(async () =>
        card.evaluate((el) =>
          Math.abs(parseFloat(el.style.getPropertyValue("--tilt-ry") || "0")),
        ),
      )
      .toBeLessThan(0.2);
    expect(
      await card.evaluate((el) => el.classList.contains("is-tilting")),
    ).toBe(false);
  });

  test("motion off skips tilt vars on project cards", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "kinetic-garden-preferences-v1",
        JSON.stringify({
          style: "default",
          transition: "pixels",
          motion: false,
          sound: false,
          night: false,
          blueprint: false,
          lightPalette: "garden",
          darkPalette: "garden",
        }),
      );
    });
    await page.goto("/work");
    const card = page.locator(".project-item").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover({ position: { x: 16, y: 24 } });
    await waitFrame(page);
    const tilt = await card.evaluate((el) => ({
      rx: el.style.getPropertyValue("--tilt-rx"),
      tilting: el.classList.contains("is-tilting"),
      motion: document.documentElement.dataset.motion,
    }));
    expect(tilt.motion).toBe("off");
    expect(tilt.tilting).toBe(false);
    expect(tilt.rx === "" || parseFloat(tilt.rx) === 0).toBe(true);
  });

  test("default writing rows stay flat while cartoon writing cards tilt", async ({
    page,
  }) => {
    await page.goto("/writing");
    const row = page.locator(".writing-item").first();
    await row.scrollIntoViewIfNeeded();
    await row.hover({ position: { x: 24, y: 20 } });
    await waitFrame(page);
    const plain = await row.evaluate((el) => ({
      transform: getComputedStyle(el).transform,
      tilting: el.classList.contains("is-tilting"),
    }));
    expect(plain.tilting).toBe(false);
    expect(
      plain.transform === "none" || plain.transform === "matrix(1, 0, 0, 1, 0, 0)",
    ).toBe(true);

    await page.addInitScript(() => {
      localStorage.setItem(
        "kinetic-garden-preferences-v1",
        JSON.stringify({
          style: "cartoon",
          transition: "pixels",
          motion: true,
          sound: false,
          night: false,
          blueprint: false,
          lightPalette: "garden",
          darkPalette: "garden",
        }),
      );
    });
    await page.reload();
    const writing = page.locator(".writing-item").first();
    await expect(page.locator("html")).toHaveAttribute("data-style", "cartoon");
    await writing.scrollIntoViewIfNeeded();
    const box = await writing.boundingBox();
    expect(box).toBeTruthy();
    await writing.hover({
      position: { x: 16, y: Math.max(24, (box?.height || 40) - 16) },
    });
    await expect
      .poll(async () =>
        writing.evaluate((el) => ({
          transform: getComputedStyle(el).transform,
          tilting: el.classList.contains("is-tilting"),
        })),
      )
      .toMatchObject({ tilting: true });
    const cartoon = await writing.evaluate((el) =>
      getComputedStyle(el).transform,
    );
    expect(cartoon).toMatch(/matrix3d|perspective|rotate/i);
  });

  test("portrait frame tilts on about", async ({ page }) => {
    await page.goto("/about");
    const frame = page.locator(".portrait-frame");
    await frame.scrollIntoViewIfNeeded();
    const box = await frame.boundingBox();
    expect(box).toBeTruthy();
    await frame.hover({
      position: { x: 18, y: Math.max(40, (box?.height || 80) - 20) },
    });
    await expect
      .poll(async () =>
        parseFloat(
          await frame.evaluate(
            (el) => el.style.getPropertyValue("--tilt-ry") || "0",
          ),
        ),
      )
      .not.toBe(0);
    expect(
      await frame.evaluate((el) => el.classList.contains("is-tilting")),
    ).toBe(true);
  });
});
