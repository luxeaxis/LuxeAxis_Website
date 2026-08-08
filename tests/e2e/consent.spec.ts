import { expect, test } from '@playwright/test';

/**
 * The DPDPA consent gate (Build Backlog T-20).
 *
 * The binding assertion here is the negative one: nothing analytics-shaped may
 * leave the browser before a visitor has said yes. Everything else is about the
 * banner asking honestly.
 */

/** Hosts that would indicate a tracker loaded. Deliberately broad — the point
 *  is to catch a provider being wired in later without the consent gate. */
const TRACKER =
  /google-analytics|googletagmanager|posthog|segment|hotjar|facebook|doubleclick/i;

test('no analytics request is made before consent is given', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (TRACKER.test(request.url())) requests.push(request.url());
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Pricing' }).first().click();
  await page.waitForLoadState('networkidle');

  expect(
    requests,
    `tracker requests before consent:\n${requests.join('\n')}`,
  ).toEqual([]);
});

test('no analytics request is made after declining, either', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (TRACKER.test(request.url())) requests.push(request.url());
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'No thanks' }).click();
  await page.goto('/pricing');
  await page.waitForLoadState('networkidle');

  expect(requests).toEqual([]);
});

test('the banner asks once and remembers the answer', async ({ page }) => {
  await page.goto('/');
  const banner = page.getByRole('region', { name: 'Cookies and analytics' });
  await expect(banner).toBeVisible();

  await page.getByRole('button', { name: 'That’s fine' }).click();
  await expect(banner).toHaveCount(0);

  // Same cookie jar, fresh navigation: a banner that re-asks is a banner people
  // learn to click through without reading.
  await page.goto('/pricing');
  await expect(
    page.getByRole('region', { name: 'Cookies and analytics' }),
  ).toHaveCount(0);
});

test('declining is exactly as easy as accepting', async ({ page }) => {
  // Not a styling preference. Under the DPDP Act consent must be freely given,
  // and a refusal that is visibly harder than acceptance is a dark pattern that
  // makes the resulting "consent" worthless. Asserted structurally: both are
  // real buttons of the same size.
  await page.goto('/');
  const accept = page.getByRole('button', { name: 'That’s fine' });
  const decline = page.getByRole('button', { name: 'No thanks' });

  const acceptBox = await accept.boundingBox();
  const declineBox = await decline.boundingBox();
  expect(acceptBox?.height).toBe(declineBox?.height);
  // Widths differ only by label length; neither may be a text link.
  expect(await accept.evaluate((node) => node.tagName)).toBe('BUTTON');
  expect(await decline.evaluate((node) => node.tagName)).toBe('BUTTON');
});

test('the banner does not trap focus or block the page', async ({ page }) => {
  // T-20: "keyboard-accessible, not a focus trap, dismissible". Analytics is
  // blocked until the visitor answers, so there is nothing to protect by
  // holding the page hostage.
  await page.goto('/');
  await expect(
    page.getByRole('region', { name: 'Cookies and analytics' }),
  ).toBeVisible();

  // The page behind is fully usable with the banner still up.
  await page.getByRole('link', { name: 'Pricing' }).first().click();
  await expect(page).toHaveURL(/\/pricing$/);

  // And it did not steal focus on mount.
  await page.goto('/');
  const focused = await page.evaluate(
    () => document.activeElement?.tagName ?? '',
  );
  expect(['BODY', 'HTML']).toContain(focused);
});

test('the organisation and local-business nodes ship, with the real address', async ({
  page,
}) => {
  // This asserted the ABSENCE of a LocalBusiness node until the studio supplied
  // an address — an invented one is fed straight into Google's local index and
  // Maps, where it can send someone to the wrong building. With a real address
  // it is the highest-value markup on a local-services site, so the assertion
  // inverts and now checks the substance rather than the type name.
  await page.goto('/');
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const nodes = blocks.map((block) => JSON.parse(block));
  const types = nodes.map((node) => node['@type']);

  expect(types).toContain('Organization');
  expect(types).toContain('LocalBusiness');

  const business = nodes.find((node) => node['@type'] === 'LocalBusiness');
  expect(business.address.postalCode).toBe('600006');
  expect(business.address.addressCountry).toBe('IN');
  expect(business.telephone).toBe('+918124600321');
  // Still absent, still not guessed: coordinates approximated from a postcode
  // put the map pin on the wrong building.
  expect(business).not.toHaveProperty('geo');
});
