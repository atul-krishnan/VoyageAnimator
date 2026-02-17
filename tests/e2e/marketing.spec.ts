import { expect, test } from "@playwright/test";

test("home to waitlist flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Turn Every Journey Into a Story/i })).toBeVisible();
  await page.getByRole("link", { name: /Join Waitlist/i }).first().click();
  await expect(page).toHaveURL(/\/waitlist$/);
  await expect(page.getByRole("heading", { name: /Secure your early creator slot/i })).toBeVisible();
});

test("hub listing and article flow", async ({ page }) => {
  await page.goto("/hub");
  await expect(page.getByRole("heading", { name: /Creator playbooks/i })).toBeVisible();
  await page.getByRole("link", { name: /Read article/i }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
