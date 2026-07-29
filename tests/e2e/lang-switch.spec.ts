import { expect, test } from '@playwright/test';

test.describe('LangSwitch', () => {
  test('is present on the published root and navigates to /ta explicitly', async ({ page }) => {
    await page.goto('/');
    const taLink = page.getByRole('link', { name: 'தமிழ்', exact: true });
    await expect(taLink).toBeVisible();
    await expect(taLink).toHaveAttribute('href', '/ta');

    await taLink.click();
    await expect(page).toHaveURL(/\/ta$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  });

  test('on /ta, EN links back to plain English rather than an unpublished /ta route', async ({ page }) => {
    await page.goto('/ta');
    const enLink = page.getByRole('link', { name: 'EN', exact: true });
    await expect(enLink).toHaveAttribute('href', '/');
    await enLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  // The core constraint from i18n/routing.ts: offering a switch into a route
  // with no reviewed Tamil translation would 307 straight back
  // (middleware.ts), which is worse than not offering it at all — so on a
  // route with no Tamil translation, the whole switch is absent.
  test('is absent entirely on a route with no Tamil translation', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('nav[aria-label="Language"]')).toHaveCount(0);
    await expect(page.getByText('தமிழ்')).toHaveCount(0);
  });

  test('is absent on /style, another route with no Tamil translation', async ({ page }) => {
    await page.goto('/style');
    await expect(page.locator('nav[aria-label="Language"]')).toHaveCount(0);
  });
});
