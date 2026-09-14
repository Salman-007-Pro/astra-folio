import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("worldwide hiring details use the correct WhatsApp and calling channels", async ({
  page,
  isMobile,
}) => {
  for (const route of ["/contact", "/", "/about", "/reading"]) {
    await page.goto(route);
    const contacts = page.getByRole("group", {
      name: "Ways to contact Salman",
    });
    const whatsapp = contacts.getByRole("link", { name: /Saudi Arabia/ });
    await expect(
      contacts.getByRole("link", { name: /Pakistan/ }),
    ).toHaveAttribute("href", /wa\.me\/923321318363/);
    const destination = new URL((await whatsapp.getAttribute("href"))!);
    expect(destination.origin).toBe("https://wa.me");
    expect(destination.pathname).toBe("/966563791037");
    expect(destination.searchParams.get("text")).toContain(
      "full-stack engineering opportunity",
    );
    await expect(whatsapp).toHaveAttribute("target", "_blank");
    await expect(contacts.getByRole("link", { name: /Phone/ })).toHaveAttribute(
      "href",
      "tel:+923321318363",
    );
    await expect(
      contacts.getByRole("link", {
        name: "salmanasif36@gmail.com",
        exact: true,
      }),
    ).toHaveAttribute("href", "mailto:salmanasif36@gmail.com");
    await expect(page.locator('a[href^="tel:+966"]')).toHaveCount(0);
  }
  await page.goto("/contact");
  await expect(page.getByLabel("Work availability")).toContainText(
    "Open to relocation",
  );
  await expect(page.getByLabel("Work availability")).toContainText("USD / EUR");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toContainText(/copied/i);
  if (isMobile) {
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    const drawer = page.getByRole("dialog", { name: "Find your way." });
    await expect(
      drawer.getByRole("link", { name: "WhatsApp", exact: true }),
    ).toHaveAttribute("href", /wa\.me\/966563791037/);
    await expect(
      drawer.getByRole("link", { name: "Call me", exact: true }),
    ).toHaveAttribute("href", "tel:+923321318363");
    await drawer.getByRole("link", { name: "Contact details" }).click();
    await expect(drawer).not.toBeVisible();
  }
});

test("case study navigation follows scrolling and direct section links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const route = "/work/metadata-driven-connectors";
  await page.goto(route);
  const nav = page.getByRole("navigation", { name: "Case study sections" });
  const current = nav.locator('[aria-current="location"]');

  for (const id of [
    "problem",
    "decisions",
    "architecture",
    "reflection",
    "constraints",
  ]) {
    await page
      .locator(`#${id}`)
      .evaluate((section) =>
        section.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute("href", `#${id}`);
    await expect(current).toBeInViewport();
    await expect(page).toHaveURL(new RegExp(`${route}/?$`));
  }

  await nav.locator('a[href="#contribution"]').click();
  await expect(current).toHaveAttribute("href", "#contribution");
  await expect(page).toHaveURL(/#contribution$/);
  await page.reload();
  await expect(current).toHaveAttribute("href", "#contribution");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    ),
  ).toBe(false);
});

test("core routes, project filtering, and writing navigation", async ({
  page,
}) => {
  await page.goto("/work");
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await expect(page.locator(".project-item:visible")).toHaveCount(1);
  await page.getByRole("link", { name: "Read CargoBarn case study" }).click();
  await expect(
    page.getByRole("heading", { name: "Logistics, within reach." }),
  ).toBeVisible();
  await page.goto("/writing/html-before-webgl");
  await expect(page.locator("pre")).toBeVisible();
  await expect(page.locator(".prose h2")).toHaveCount(4);
});
test("reading mode has no canvas and CV download is current", async ({
  page,
  request,
}) => {
  await page.goto("/reading");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Selected engineering work" }),
  ).toBeVisible();
  await page.goto("/cv");
  const link = page.locator("#cv-download");
  await expect(link).toBeVisible();
  const response = await request.get((await link.getAttribute("href"))!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});
test("keyboard modal, reduced motion, and WebGL fallback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?webgl=off");
  await expect(page.getByText("A quieter kind of garden.")).toBeVisible();
  await page
    .getByRole("button", { name: "Experience settings", exact: true })
    .click();
  await expect(page.locator("#pref-motion")).not.toBeChecked();
  await expect(page.locator("#pref-sound")).not.toBeChecked();
  await page.keyboard.press("Escape");
  await expect(page.locator("#experience-settings")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Experience settings", exact: true }),
  ).toBeFocused();
});
test("no horizontal page overflow and no serious accessibility violations", async ({
  page,
}) => {
  for (const route of ["/reading", "/work", "/contact"]) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(overflow, route).toBe(false);
    const results = await new AxeBuilder({ page })
      .exclude("astro-dev-toolbar")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
test("home scene controls and mobile menu", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Unfold the signal seed" }).click();
  await expect(page.getByText("A little room to grow.")).toBeVisible();
  if (isMobile) {
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    await page
      .locator("#mobile-menu")
      .getByRole("link", { name: "Recruiter view" })
      .click();
    await expect(page).toHaveURL(/\/reading/);
  } else {
    await page.locator("[data-machine=engine]").click();
    await expect(page.locator("[data-machine-heading]")).toHaveText(
      "Build & delivery modernization",
    );
  }
  expect(errors).toEqual([]);
});
