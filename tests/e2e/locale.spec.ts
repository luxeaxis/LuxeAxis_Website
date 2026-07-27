import { expect, test } from '@playwright/test';

test('English home renders with lang="en"', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Where Space Meets Intelligence');
});

test('published Tamil route renders with lang="ta"', async ({ page }) => {
  await page.goto('/ta');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
});

test('unpublished Tamil route 307s to English instead of showing English under lang="ta"', async ({ page }) => {
  const response = await page.goto('/ta/pricing');
  const redirect = await response?.request().redirectedFrom()?.response();
  expect(redirect?.status()).toBe(307);
  expect(new URL(page.url()).pathname).toBe('/pricing');
});
