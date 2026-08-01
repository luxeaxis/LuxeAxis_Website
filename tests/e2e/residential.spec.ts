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

test('every tier is reachable from the overview and prerendered', async ({ page }) => {
  await page.goto('/residential');
  for (const tier of ['Essential', 'Signature', 'Elite']) {
    const link = page.getByRole('link', { name: new RegExp(tier) }).first();
    await expect(link).toHaveAttribute('href', `/residential/${tier.toLowerCase()}`);
  }
});

test('a tier page states its scope and repeats the action', async ({ page }) => {
  await page.goto('/residential/signature');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Signature');
  await expect(page.getByRole('heading', { name: 'What is included' })).toBeVisible();
  // TierSummary repeats the CTA so a visitor never has to scroll back up to act
  // on what they have just read.
  await expect(page.getByRole('link', { name: 'Book Audit' }).first()).toBeVisible();
});

test('a tier outside the published set is a 404, not a blank page', async ({ request }) => {
  // `dynamicParams = false` should make this a routing-layer 404 rather than
  // something the page body has to defend against.
  const response = await request.get('/residential/platinum');
  expect(response.status()).toBe(404);
});

test('no tier page invents a price', async ({ page }) => {
  // The studio's differentiator is that it publishes prices. Until real ones
  // exist, the honest statement is that they are published elsewhere — never a
  // placeholder figure. This fails the day someone seeds one without also
  // seeding the real rate card.
  for (const tier of ['essential', 'signature', 'elite']) {
    await page.goto(`/residential/${tier}`);
    await expect(page.locator('main')).not.toContainText('₹');
  }
});

test('the Fee Calculator is absent until a real rate card exists', async ({ page }) => {
  // Deliberately asserting the ABSENCE. `getCalculatorConfig()` returns null,
  // so the section does not render — a calculator returning invented rates is
  // the single most damaging thing this site could ship, since a visitor
  // budgets against it.
  //
  // When real rates land this test fails, which is the intended prompt: replace
  // it with the keyboard run T-15 asks for (tab to the area field, type, arrow
  // through the tier radios, confirm the announced <output> updates). The
  // semantics that run would check are already covered in
  // tests/unit/fee-calculator.test.tsx.
  await page.goto('/residential');
  await expect(page.getByRole('heading', { name: 'Estimate your project' })).toHaveCount(0);
});
