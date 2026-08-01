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

/**
 * The persistence half of the spec's "Language switch (EN / தமிழ்) … persists
 * via cookie" (3D Website Spec §2.3, Design System §3.3).
 *
 * The switch wrote `lx-locale` from the day it shipped, but nothing read it, so
 * the preference had no observable effect on any later navigation — the
 * requirement was half-built and looked done. middleware.ts now honours it.
 */
test.describe('the language choice persists', () => {
  test('a returning Tamil reader lands on /ta without touching the switch', async ({ page, context }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'தமிழ்', exact: true }).click();
    await expect(page).toHaveURL(/\/ta$/);

    // Simulates the return visit: same cookie jar, fresh navigation to the
    // unprefixed root, no switch involved.
    await page.goto('/');
    await expect(page).toHaveURL(/\/ta$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ta');

    expect(
      (await context.cookies()).find((cookie) => cookie.name === 'lx-locale')?.value,
      'the app writes its own cookie, never next-intl NEXT_LOCALE',
    ).toBe('ta');
  });

  test('choosing English back is honoured, not overridden on the next visit', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'தமிழ்', exact: true }).click();
    await page.getByRole('link', { name: 'EN', exact: true }).click();
    await expect(page).toHaveURL(/\/$/);

    // `lx-locale=en` is a real recorded choice, and its correct effect is that
    // nothing happens. A naive "redirect to whatever the cookie says" would
    // have no English target to aim at under localePrefix: 'as-needed'.
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('the cookie never sends a visitor to an unpublished Tamil route', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'தமிழ்', exact: true }).click();

    // /pricing has no reviewed Tamil translation. The cookie says "ta", but the
    // publication gate outranks it — otherwise this redirect and the /ta ->
    // English one in middleware.ts would each undo the other, forever. That is
    // the exact loop next-intl's localeDetection caused and this design avoids
    // by construction, so it is asserted, not assumed.
    const response = await page.goto('/pricing');
    expect(response?.request().redirectedFrom(), 'expected no redirect at all').toBeNull();
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
