import { expect, test, type Response } from '@playwright/test';

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

// The build used to write .next/server/app/ta/pricing.html containing
// <html lang="ta"> around an English <h1> — English under lang="ta", shipped to
// disk, kept unreachable only by middleware. generateStaticParams now filters to
// published locales so the artifact is never produced, and assertPublished()
// 404s at render time if such a route is reached by a path middleware never
// inspected (its matcher skips any path containing a dot).
test('an unpublished Tamil route never serves English under lang="ta"', async ({ request }) => {
  const response = await request.get('/ta/pricing', { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  // Belt and braces: even the redirect's own body must not be an English page
  // wearing a Tamil lang attribute.
  expect(await response.text()).not.toMatch(/<html[^>]*lang="ta"/);
});

/** Walks `request().redirectedFrom()` back to the initial request and counts
 *  the hops. A test that only checks the final response is 200 would pass
 *  even at 12 hops (the infinite-loop bug this guards against resolved to a
 *  200 eventually too, just after too many redirects for curl/browsers to
 *  follow) — this makes hop count an explicit, asserted fact. */
function countRedirectHops(response: Response): number {
  let hops = 0;
  let redirected = response.request().redirectedFrom();
  while (redirected) {
    hops += 1;
    redirected = redirected.redirectedFrom();
  }
  return hops;
}

// Regression coverage for the infinite-redirect loop: next-intl's
// `localeDetection` (now disabled in i18n/routing.ts) used to redirect an
// unprefixed route to /ta/<route> for any Tamil-preferring visitor, while
// our own middleware redirects any *unpublished* /ta/<route> straight back —
// two middlewares redirecting each other forever. Playwright defaults to
// `en-US` and never sets NEXT_LOCALE, so the three tests above never
// exercised this path.
test.describe('Accept-Language: ta on an unpublished route', () => {
  test.use({ extraHTTPHeaders: { 'Accept-Language': 'ta' } });

  test('resolves to English without looping', async ({ page }) => {
    const response = await page.goto('/pricing');
    expect(response, 'expected a response').not.toBeNull();
    expect(countRedirectHops(response!)).toBe(0);
    expect(response!.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe('/pricing');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

// Decision (see i18n/routing.ts for full rationale): locale detection is
// disabled repo-wide, so even on the one route that IS published in Tamil,
// a Tamil-preferring visitor is served English at '/' rather than
// auto-redirected to /ta. They can still reach /ta explicitly.
test.describe('Accept-Language: ta on the published root', () => {
  test.use({ extraHTTPHeaders: { 'Accept-Language': 'ta' } });

  test('serves English at "/" rather than auto-redirecting to /ta', async ({ page }) => {
    const response = await page.goto('/');
    expect(response, 'expected a response').not.toBeNull();
    expect(countRedirectHops(response!)).toBe(0);
    expect(response!.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test.describe('NEXT_LOCALE=ta cookie on an unpublished route', () => {
  test('resolves without looping', async ({ page, context }) => {
    await context.addCookies([{ name: 'NEXT_LOCALE', value: 'ta', domain: 'localhost', path: '/' }]);
    const response = await page.goto('/pricing');
    expect(response, 'expected a response').not.toBeNull();
    expect(countRedirectHops(response!)).toBe(0);
    expect(response!.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe('/pricing');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
