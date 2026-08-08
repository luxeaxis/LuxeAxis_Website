import { expect, test } from '@playwright/test';

/**
 * `/residential` and the three tier pages (Build Backlog T-15).
 *
 * This is the primary persona's path — Spec §2.1 routes "IT professional
 * (2/3BHK, OMR corridor)" down Home → Residential → Fee Calculator → Audit —
 * so it is the highest-value journey on the site after the home page itself.
 */

test('the home page persona router actually lands here', async ({ page }) => {
  // The router is only worth having if its tiles resolve. This walks the real
  // journey rather than visiting /residential directly.
  await page.goto('/');
  await page.getByRole('link', { name: /I own a flat in Chennai/ }).click();
  await expect(page).toHaveURL(/\/residential$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Your home, designed to a published price',
  );
});

test('every tier is reachable from the overview and prerendered', async ({
  page,
}) => {
  await page.goto('/residential');
  for (const tier of ['Essential', 'Signature', 'Elite']) {
    const link = page.getByRole('link', { name: new RegExp(tier) }).first();
    await expect(link).toHaveAttribute(
      'href',
      `/residential/${tier.toLowerCase()}`,
    );
  }
});

test('a tier page states its scope and repeats the action', async ({
  page,
}) => {
  await page.goto('/residential/signature');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Signature');
  await expect(
    page.getByRole('heading', { name: 'What is included' }),
  ).toBeVisible();
  // TierSummary repeats the CTA so a visitor never has to scroll back up to act
  // on what they have just read.
  await expect(
    page.getByRole('link', { name: 'Book Audit' }).first(),
  ).toBeVisible();
});

test('a tier outside the published set is a 404, not a blank page', async ({
  request,
}) => {
  // `dynamicParams = false` should make this a routing-layer 404 rather than
  // something the page body has to defend against.
  const response = await request.get('/residential/platinum');
  expect(response.status()).toBe(404);
});

test('every tier page publishes its floor', async ({ page }) => {
  // The inverse of what this asserted before the price list existed, when the
  // only honest statement was that prices were published elsewhere. Each floor
  // is checked by value rather than merely for a rupee sign, so a tier picking
  // up the wrong figure fails here.
  const floors: Record<string, string> = {
    essential: '₹3.5L',
    signature: '₹7L',
    elite: '₹25L',
  };
  for (const [tier, floor] of Object.entries(floors)) {
    await page.goto(`/residential/${tier}`);
    await expect(page.locator('main'), tier).toContainText(floor);
    await expect(page.getByText('Fee band:'), tier).toHaveCount(0);
  }
});

test('the Fee Calculator renders the published list', async ({ page }) => {
  // The rates landed, so this is now the keyboard run T-15 asks for. Driven by
  // focus and Space rather than a click: the radios are sr-only so the card
  // around them can be styled, and keyboard-completeness is the binding
  // requirement.
  await page.goto('/residential');
  await expect(
    page.getByRole('heading', { name: 'Estimate your project' }),
  ).toBeVisible();

  const villa = page.getByRole('radio', { name: /Villa/ });
  await villa.focus();
  await page.keyboard.press('Space');
  await expect(villa).toBeChecked();

  const output = page.locator('#calculator output');
  await expect(output).toContainText('₹25L to ₹80L');
  await expect(output).toContainText('Signature or Elite');
});
