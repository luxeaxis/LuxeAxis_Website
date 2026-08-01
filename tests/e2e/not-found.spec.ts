import { expect, test } from '@playwright/test';

/**
 * The 404 path, which had no coverage at all before app/not-found.tsx existed.
 *
 * These originally pointed at `/portfolio`, chosen because it was a real
 * NAV_ITEMS entry with no page behind it — so the tests doubled as proof that a
 * header link landed on the branded page rather than the framework fallback.
 * Every nav and footer destination is now built, so they use a genuinely absent
 * path instead.
 *
 * That a nonsense path is now the only way to reach a 404 is worth stating: it
 * is the property `tests/unit/routes.test.ts` (every nav link has a page) and
 * the footer walk in `pages.spec.ts` (every footer link answers 200) exist to
 * keep true.
 */

const ABSENT = '/no-such-page';

test('a path with no page answers 404, not 200', async ({ request }) => {
  // Status matters as much as the markup: a 404 page served with 200 invites a
  // crawler to index every dead URL as a valid one.
  const response = await request.get(ABSENT);
  expect(response.status()).toBe(404);
});

test('the 404 renders inside the app layout, not the framework fallback', async ({ page }) => {
  await page.goto(ABSENT);

  // Next's own fallback renders above app/layout.tsx and has none of this.
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not find that page');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  // SkipLink's target — it is rendered by the layout on every route, and is
  // useless if the page it lands on has no #main.
  await expect(page.locator('#main')).toBeAttached();
});

test('the 404 offers a way out that actually resolves', async ({ page }) => {
  await page.goto(ABSENT);
  // "never a dead end" (design system §3.5, EmptyState's rule) applied to the
  // 404: the recovery link must go somewhere that exists, or this page is just
  // a prettier dead end.
  await page.getByRole('link', { name: 'Back to the home page' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Your Chennai home, thoughtfully designed. Transparently priced.',
  );
});

test('robots.txt points at a sitemap that lists only resolvable URLs', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  const robotsBody = await robots.text();
  expect(robotsBody).toContain('Sitemap:');
  // /style sets robots:{index:false} in its own metadata; robots.txt is
  // generated from the same NOINDEX_ROUTES list, so the two cannot disagree.
  expect(robotsBody).toContain('Disallow: /style');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const urls = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  expect(urls.length).toBeGreaterThan(0);

  // A sitemap is a promise that every URL in it resolves. Check the promise
  // rather than the list: each entry is fetched against THIS server, so a route
  // deleted without updating lib/seo/routes.ts fails here rather than in Search
  // Console weeks later.
  for (const url of urls) {
    const response = await request.get(new URL(url).pathname, { maxRedirects: 0 });
    expect(response.status(), `${url} should resolve directly, without a redirect`).toBe(200);
  }
});
