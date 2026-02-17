import { expect, test } from "@playwright/test";

test("studio loads and shows controls", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByRole("heading", { name: /Voyagraph Studio/i })).toBeVisible();
  await expect(page.getByLabel("Project Name")).toBeVisible();
  await expect(page.getByText(/Route points/i)).toBeVisible();
});
