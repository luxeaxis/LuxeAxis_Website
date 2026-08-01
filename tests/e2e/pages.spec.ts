import { expect, test } from '@playwright/test';

/**
 * The T-18 pages: pricing, process, NRI and the remaining routes.
 *
 * The through-line in these assertions is the same one the content layer holds:
 * a page may say a fact is coming, and may never state one it has not been
 * given. Most of what is checked here is the absence of an invention.
 */

test('every footer link resolves — no dead ends left in the site chrome', async ({
  page,
  request,
}) => {
  // The footer is the full sitemap (Spec §2.3). Until this build most of it
  // 404'd. Walking it is the broadest single check that the site is joined up.
  await page.goto('/');
  const hrefs = await page
    .getByRole('contentinfo')
    .getByRole('link')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));

  expect(hrefs.length).toBeGreaterThan(15);
  const dead: string[] = [];
  for (const href of hrefs) {
    if (!href.startsWith('/')) continue;
    const response = await request.get(href, { maxRedirects: 0 });
    if (response.status() !== 200) dead.push(`${href} -> ${response.status()}`);
  }
  expect(dead, `dead footer links:\n${dead.join('\n')}`).toEqual([]);
});

test('pricing leads with the calculator, then the tiers', async ({ page }) => {
  // Spec §10.4's order. The calculator comes first because the primary persona
  // arrives asking what it costs; three tier cards answer a question they have
  // not asked yet.
  await page.goto('/pricing');
  const headings = await page.locator('main h2').allTextContents();
  expect(headings.indexOf('Estimate your project')).toBeLessThan(headings.indexOf('Three tiers'));
});

test('pricing publishes no figure it has not been given', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.locator('main')).not.toContainText('₹');
  await expect(page.getByText('Fee band:').first()).toBeVisible();
});

test('guarantee terms are named as outstanding, never drafted', async ({ page }) => {
  // A guarantee is a contractual promise and its conditions are the part that
  // binds. Inventing them would commit the studio to an obligation a visitor
  // could later hold them to — a worse class of invention than a placeholder
  // statistic, and worth its own assertion.
  await page.goto('/pricing');
  await expect(page.getByText('60-Day Handover Guarantee').first()).toBeVisible();
  await expect(page.getByText('Full terms:').first()).toBeVisible();
});

test('the FAQ works without JavaScript and is marked up for search', async ({ page }) => {
  await page.goto('/pricing');
  // Native <details>/<summary>: the disclosure behaviour is the platform's, so
  // it survives a failed JS bundle — which matters most for a pure
  // reading task (Landing Blueprint §3.7).
  const first = page.locator('#faq details').first();
  await expect(first).not.toHaveAttribute('open', '');
  await first.getByRole('group').or(first.locator('summary')).first().click();
  await expect(first).toHaveAttribute('open', '');

  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  const parsed = JSON.parse(jsonLd ?? '{}');
  expect(parsed['@type']).toBe('FAQPage');
  // Structured data that disagrees with the visible page is a spam signal, so
  // it is generated from the same list the accordion renders.
  const visible = await page.locator('#faq summary').allTextContents();
  expect(parsed.mainEntity.length).toBe(visible.length);
});

test('process names the seven stages in the spec order', async ({ page }) => {
  await page.goto('/process');
  const stages = await page.locator('#stages ol > li h3').allTextContents();
  expect(stages).toEqual([
    'Discover',
    'Audit',
    'Concept',
    'Approve',
    'Build',
    'Handover',
    'Concierge',
  ]);
});

test('the handover guarantee is attached to its own stage', async ({ page }) => {
  // Spec §5.8: "each node … with the relevant guarantee attached". A guarantee
  // means more where it applies than in a block at the bottom of the page.
  await page.goto('/process');
  const handover = page.locator('#stages ol > li').filter({ hasText: 'Handover' }).first();
  await expect(handover.getByText('60-Day Handover Guarantee')).toBeVisible();
});

test('an NRI region page computes both clocks at request time', async ({ page }) => {
  // The only region-specific fact anyone has supplied is the region, so the
  // page earns its keep by computing something true from it. Baked-in times
  // would be wrong for half the year in several of these zones.
  await page.goto('/nri/singapore');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Singapore');
  const times = await page.locator('#timing p.font-mono').allTextContents();
  expect(times).toHaveLength(2);
  for (const time of times) {
    expect(time.trim()).toMatch(/^\d{1,2}:\d{2}\s?(am|pm)$/i);
  }
});

test('all six NRI regions resolve', async ({ request }) => {
  for (const region of ['singapore', 'uae', 'usa', 'uk', 'canada', 'australia']) {
    expect((await request.get(`/nri/${region}`)).status(), region).toBe(200);
  }
  expect((await request.get('/nri/mars')).status()).toBe(404);
});

test('commercial asks for a consult, not a home audit', async ({ page }) => {
  // Spec §10.8 adapts the CTA per path. Using the residential wording here
  // would read as a studio that does not know which business it is in.
  await page.goto('/commercial/workplace');
  await expect(page.getByRole('link', { name: 'Request a consult' }).first()).toBeVisible();
});

test('about states positions and names the company facts as outstanding', async ({ page }) => {
  // An invented founding year or team size is a fabricated company record — the
  // kind of detail a journalist or a procurement form relies on.
  await page.goto('/about');
  await expect(page.getByText('Founded:')).toBeVisible();
  await expect(page.getByText('The team:')).toBeVisible();
  await expect(page.getByText(/We publish the price/)).toBeVisible();
});

test('the journal is honestly empty rather than absent', async ({ page }) => {
  await page.goto('/journal');
  await expect(page.getByText('Nothing published yet')).toBeVisible();
});
