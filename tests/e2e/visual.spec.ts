import { expect, test } from "@playwright/test";

test("home hero visual snapshot", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("home-hero.png", { fullPage: true });
});

test("plans visual snapshot", async ({ page }) => {
  await page.goto("/plans");
  await expect(page).toHaveScreenshot("plans-page.png", { fullPage: true });
});

test("studio visual snapshot", async ({ page }) => {
  await page.goto("/studio");
  await expect(page).toHaveScreenshot("studio-page.png", { fullPage: true });
});
