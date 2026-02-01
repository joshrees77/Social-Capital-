import { test, expect } from "@playwright/test";

const routes = ["/", "/lend", "/borrow"];

for (const route of routes) {
  test(`route ${route} loads`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });
}
