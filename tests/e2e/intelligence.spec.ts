import { expect, test } from '@playwright/test';

/**
 * The Intelligence hub and its four feature pages (Build Backlog T-17).
 *
 * These are the "moat" pages — the capabilities the studio differentiates on —
 * so the assertions here are about the claims being present and honest rather
 * than about layout.
 */

const FEATURES = [
  { slug: 'vastu-tech', name: 'Vastu-Tech' },
  { slug: 'space-score', name: 'Space Score' },
  { slug: 'space-os', name: 'Space OS' },
  { slug: 'virtual-staging', name: 'Virtual Staging' },
];

test('the hub links to every feature, and the nav links to the hub', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('banner').getByRole('link', { name: 'Intelligence' }).click();
  await expect(page).toHaveURL(/\/intelligence$/);

  for (const feature of FEATURES) {
    await expect(
      page.getByRole('link', { name: new RegExp(feature.name) }).first(),
    ).toHaveAttribute('href', `/intelligence/${feature.slug}`);
  }
});

for (const feature of FEATURES) {
  test(`${feature.slug} renders as its own page with one h1`, async ({ page }) => {
    await page.goto(`/intelligence/${feature.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(feature.name);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('Vastu-Tech shows the human-in-the-loop promise, not just the AI claim', async ({ page }) => {
  // Spec P4 — "AI assists, humans decide" — and §5.3 asks for this as a
  // visible chip specifically. It is the reassurance that makes an AI reading
  // of someone's home credible rather than alarming, so its absence would be a
  // content regression rather than a styling one.
  await page.goto('/intelligence/vastu-tech');
  await expect(page.getByText('Reviewed by a designer')).toBeVisible();
  await expect(page.getByText(/The AI narrows the question; a person answers it/)).toBeVisible();
});

test('Space Score names all four measures', async ({ page }) => {
  await page.goto('/intelligence/space-score');
  for (const measure of ['Wellness', 'Function', 'Aesthetics', 'Sustainability']) {
    await expect(page.getByText(measure, { exact: true })).toBeVisible();
  }
});

test('the how-it-works stepper is real text, not an image', async ({ page }) => {
  // T-17 requires "diagrams have text-equivalent steppers", and §5.3 makes the
  // stepper the reduced-motion fallback for the scan. Written first rather than
  // derived from a diagram, so it can never lag behind the picture.
  await page.goto('/intelligence/vastu-tech');
  const steps = page.locator('#how-it-works ol li');
  await expect(steps).toHaveCount(4);
  await expect(steps.first()).toContainText('Share the plan');
});

test('a feature with no documented process names the gap rather than inventing one', async ({
  page,
}) => {
  // The sitemap describes Virtual Staging in five words and no spec section
  // expands on it. Writing a plausible four-step process would be authoring
  // product behaviour, not rendering it.
  await page.goto('/intelligence/virtual-staging');
  await expect(page.getByText(/To be published/)).toBeVisible();
  await expect(page.locator('#how-it-works ol')).toHaveCount(0);
});

test('features with a scene reserve its slot; the one without does not', async ({ page }) => {
  // T-17: "each page reserves the scene slot for T-32". Reserving now is what
  // lets the live scene drop in later with no layout change. Virtual Staging
  // has no scene in the registry, so reserving space for it would just be a
  // hole in the page.
  await page.goto('/intelligence/vastu-tech');
  await expect(page.locator('main img')).toHaveCount(1);

  await page.goto('/intelligence/virtual-staging');
  await expect(page.locator('main img')).toHaveCount(0);
});

test('an unknown capability is a 404, not a blank page', async ({ request }) => {
  expect((await request.get('/intelligence/telepathy')).status()).toBe(404);
});
