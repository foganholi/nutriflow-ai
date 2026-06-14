import { expect, test } from "@playwright/test";
test("landing page exposes responsible positioning", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("alimentação");
  await expect(page.getByText(/não substitui nutricionista/i)).toBeVisible();
});
test("private route redirects without configuration or session", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
test("registration requires explicit consent", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByRole("checkbox")).toHaveCount(3);
});
test("scientific sources are loaded from the public catalog", async ({ page }) => {
  await page.goto("/science");
  await expect(page.getByRole("heading", { name: /Guia Alimentar/i })).toBeVisible();
  await expect(page.getByText("Ministério da Saúde")).toBeVisible();
});
test("LGPD export requires authentication", async ({ page }) => {
  await page.goto("/api/export/data");
  await expect(page).toHaveURL(/\/login/);
});
