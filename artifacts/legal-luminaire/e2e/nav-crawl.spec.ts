import { test, expect } from "@playwright/test";
import { ALL_NAV_ITEMS, DEFAULT_CASE_ID } from "../src/config/navigation";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:4173";

/** Non-case-scoped routes render standalone; case-scoped routes need a case id. */
const targets = ALL_NAV_ITEMS.map((item) => ({
  label: item.labelEn,
  url: item.caseScoped ? `/case/${DEFAULT_CASE_ID}${item.path}` : item.path,
}));

test.describe("navigation crawl", () => {
  for (const t of targets) {
    test(`${t.label} (${t.url}) renders content`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));

      await page.goto(`${BASE}${t.url}`, { waitUntil: "networkidle" });

      const main = page.locator("main");
      await expect(main).toBeVisible();
      await expect
        .poll(async () => (await main.innerText()).trim().length, { timeout: 10_000 })
        .toBeGreaterThan(40);

      expect(errors, `console errors on ${t.url}`).toEqual([]);
    });
  }

  test("cold profile: flat legacy path redirects to the seeded case", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });

    await expect(page).toHaveURL(new RegExp(`/case/${DEFAULT_CASE_ID}/dashboard$`));
    await expect
      .poll(async () => (await page.locator("main").innerText()).trim().length, { timeout: 10_000 })
      .toBeGreaterThan(40);
  });

  test("/case/undefined/* normalises to the seeded case", async ({ page }) => {
    await page.goto(`${BASE}/case/undefined/dashboard`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(new RegExp(`/case/${DEFAULT_CASE_ID}/dashboard$`));
  });
});
