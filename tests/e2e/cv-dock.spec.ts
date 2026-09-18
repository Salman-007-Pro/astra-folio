import { test, expect } from "@playwright/test";

test("CV pill sits above Styles and downloads a PDF", async ({
  page,
  request,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("garden-cv-pointer-v2", "1"),
  );
  await page.goto("/about");
  const cv = page.getByRole("link", { name: "Download CV", exact: true });
  const styles = page.getByRole("button", {
    name: "Experience settings",
    exact: true,
  });
  await expect(cv).toBeVisible();
  const stacked = await page.evaluate(() => {
    const download = document
      .querySelector(".cv-download-trigger")!
      .getBoundingClientRect();
    const settings = document
      .querySelector(".settings-trigger")!
      .getBoundingClientRect();
    const footer = document
      .querySelector(".site-footer")!
      .getBoundingClientRect();
    const dock = document.querySelector(".chrome-dock")!.getBoundingClientRect();
    return {
      cvAbove: download.bottom <= settings.top + 1,
      footerGap: Math.round(footer.top - dock.bottom),
    };
  });
  expect(stacked.cvAbove).toBe(true);
  expect(stacked.footerGap).toBeGreaterThanOrEqual(16);
  const href = await cv.getAttribute("href");
  expect(href).toBe("/download/cv");
  const response = await request.get("/download/cv");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect(response.headers()["content-disposition"]).toMatch(/attachment/i);
  await expect(styles).toBeVisible();
});

test("first-arrival pointer shows above the CV pill then stays gone", async ({
  page,
}) => {
  await page.goto("/about");
  const pointer = page.locator(".cv-dock-pointer");
  await expect(pointer).toBeVisible();
  const geometry = await page.evaluate(() => {
    const hint = document.querySelector(".cv-dock-pointer")!;
    const cv = document.querySelector(".cv-download-trigger")!;
    const label = document.querySelector(".cv-dock-pointer-label")!;
    const hintBox = hint.getBoundingClientRect();
    const cvBox = cv.getBoundingClientRect();
    return {
      above: hintBox.bottom <= cvBox.top + 2,
      overPill: hintBox.right >= cvBox.left && hintBox.left <= cvBox.right,
      writingMode: getComputedStyle(label).writingMode,
    };
  });
  expect(geometry.above).toBe(true);
  expect(geometry.overPill).toBe(true);
  expect(geometry.writingMode).toMatch(/vertical/);
  await expect(pointer).toBeHidden({ timeout: 7000 });
  await page.reload();
  await expect(pointer).toBeHidden();
});

test("homepage exposes a large social image", async ({ page }) => {
  await page.goto("/");
  const og = page.locator('meta[property="og:image"]');
  await expect(og).toHaveAttribute("content", /\/og\.jpg$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
});
