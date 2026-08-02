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

test('pricing publishes the real price list', async ({ page }) => {
  // This asserted the ABSENCE of any figure until the studio published its
  // list — a placeholder price would have discredited the "we publish ours"
  // claim this page's own heading makes. Now that real numbers exist, the
  // useful assertion is that they are the published ones, and that the page no
  // longer says a fee band is pending.
  await page.goto('/pricing');
  await expect(page.locator('main')).toContainText('₹3.5L');
  await expect(page.getByText('Fee band:')).toHaveCount(0);
});

test('the calculator answers with both the project cost and the fee inside it', async ({
  page,
}) => {
  // Showing only the total makes a visitor suspect the design fee is buried in
  // it; showing only the fee hides the number they need to budget. §5.7 calls
  // this the published-pricing trust signal, and the trust is in showing both.
  await page.goto('/pricing');
  await page
    .getByRole('radio', { name: /2BHK/ })
    .locator('..')
    .click();

  const output = page.locator('#calculator output');
  await expect(output).toContainText('₹7L to ₹15L');
  await expect(output).toContainText('₹75,000 to ₹1.8L');
  await expect(output).toContainText('Essential or Signature');
});

test('guarantee terms are published, and differ by tier where they do', async ({ page }) => {
  // This asserted the terms were named as OUTSTANDING, which was right while
  // none were written. Now that they are, the assertion that matters is that
  // the per-tier commitments are stated rather than flattened into one figure:
  // the timeline is 45 days on Essential, 60 on Signature and milestone-based
  // on Elite, so a single headline would overstate one and misdescribe another.
  await page.goto('/pricing');
  const guarantees = page.locator('#guarantees');
  await expect(guarantees).toContainText('45-day handover');
  await expect(guarantees).toContainText('60-day handover');
  await expect(guarantees).toContainText('Milestone-based');
  // The warranty states response times rather than promising to look into it.
  await expect(guarantees).toContainText('same day');
});

test('a genuinely unwritten term still shows as a gap', async ({ page }) => {
  // The supply-chain fee's conditions have not been published. It renders as an
  // explicit gap rather than disappearing or acquiring drafted terms.
  await page.goto('/pricing');
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

  // Find the FAQPage block by type rather than by position. The page carries
  // several JSON-LD nodes (Organization ships site-wide from the layout), and
  // `.first()` silently started returning the wrong one the moment a second was
  // added — which is exactly the kind of test that passes for years and then
  // asserts nothing.
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed = blocks
    .map((block) => JSON.parse(block))
    .find((node) => node['@type'] === 'FAQPage');
  expect(parsed, 'no FAQPage node on /pricing').toBeDefined();
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
  await expect(handover.getByText('Timeline guarantee')).toBeVisible();
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

test('nested pages carry breadcrumbs whose markup matches what is on screen', async ({ page }) => {
  // Generated from one derived list, never two hand-kept copies — Google treats
  // structured data that disagrees with the visible page as a spam signal, and a
  // parallel list is exactly how that disagreement arrives.
  await page.goto('/intelligence/vastu-tech');

  const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(nav).toBeVisible();
  // Home is deliberately not rendered: it repeats the header logo and is one
  // more thing to tab past. It stays in the JSON-LD at position 1.
  await expect(nav.getByRole('link', { name: 'Intelligence' })).toHaveAttribute(
    'href',
    '/intelligence',
  );
  await expect(nav.locator('[aria-current="page"]')).toHaveText('Vastu-Tech');

  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const crumbs = blocks
    .map((block) => JSON.parse(block))
    .find((node) => node['@type'] === 'BreadcrumbList');
  expect(crumbs, 'no BreadcrumbList on a nested page').toBeDefined();
  expect(crumbs.itemListElement.map((item: { name: string }) => item.name)).toEqual([
    'Home',
    'Intelligence',
    'Vastu-Tech',
  ]);
});

test('every breadcrumb link resolves', async ({ page, request }) => {
  // A BreadcrumbList naming a URL that 404s is worse than none at all. Safe to
  // derive from the path only because every intermediate segment of this site's
  // URLs is a real page, which tests/unit/routes.test.ts enforces — this checks
  // the promise rather than trusting it.
  for (const path of [
    '/residential/signature',
    '/intelligence/space-os',
    '/commercial/healthcare',
    '/nri/singapore',
  ]) {
    await page.goto(path);
    const hrefs = await page
      .getByRole('navigation', { name: 'Breadcrumb' })
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(hrefs.length, `${path} has no breadcrumb links`).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect((await request.get(href)).status(), `${path} -> ${href}`).toBe(200);
    }
  }
});

test('service pages describe themselves as a Service, without inventing an offer', async ({
  page,
}) => {
  await page.goto('/residential/signature');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const service = blocks
    .map((block) => JSON.parse(block))
    .find((node) => node['@type'] === 'Service');

  expect(service, 'no Service node').toBeDefined();
  expect(service.provider.name).toBe('Luxe Axis');
  expect(service.areaServed.name).toBe('Chennai');
  // `offers` needs a price, and none is published. A Service node claiming one
  // would put an invented figure into a search index.
  expect(service).not.toHaveProperty('offers');
});
