import { beforeAll, describe, expect, it } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { INDEXABLE_ROUTES, NOINDEX_ROUTES } from '@/lib/seo/routes';

/**
 * The drift guard lib/seo/routes.ts is written against: a sitemap is a promise
 * that every URL in it resolves, and the two ways to break that promise are
 * both silent — adding a page and forgetting to list it (invisible to search),
 * or deleting one and leaving it advertised (a 404 in the sitemap).
 *
 * So the list is checked against the route files themselves rather than
 * trusted. Same shape as tests/unit/registry.test.ts, which pins the poster
 * registry to the files on disk for the same reason.
 */

const APP_DIR = join(process.cwd(), 'app');

/**
 * Walks app/ and returns the route path of every page.tsx found, EXPANDING
 * dynamic segments through the same `generateStaticParams` Next itself calls.
 *
 * Expanding rather than skipping matters: `/residential/[tier]` is not a URL,
 * but the three it produces are, and they are what the sitemap advertises. A
 * walker that ignored bracketed directories would let the tier pages be listed
 * for a crawler with nothing checking they still exist — precisely the drift
 * this file is here to catch. It also means deleting a tier from
 * lib/content/source.ts fails here, since the params come from the same source
 * the page builds from.
 *
 * Catch-all segments (`[...rest]`) are still skipped: they match everything and
 * enumerate nothing, so they are never sitemap entries. There are none today.
 */
async function routesOnDisk(dir: string = APP_DIR, prefix = ''): Promise<string[]> {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name === 'page.tsx') {
      found.push(prefix === '' ? '/' : prefix);
      continue;
    }
    if (!entry.isDirectory()) continue;

    const isDynamic = entry.name.startsWith('[');
    if (!isDynamic) {
      found.push(...(await routesOnDisk(join(dir, entry.name), `${prefix}/${entry.name}`)));
      continue;
    }
    if (entry.name.startsWith('[...') || entry.name.startsWith('[[')) continue;

    const paramName = entry.name.slice(1, -1);
    const pagePath = join(dir, entry.name, 'page.tsx');
    // Imported by plain absolute path, not a file:// URL — pathToFileURL
    // percent-encodes the brackets (`%5Btier%5D`) and Vite's resolver then
    // cannot find the file.
    const module_ = (await import(/* @vite-ignore */ pagePath.replace(/\\/g, '/'))) as {
      generateStaticParams?: () => Promise<Array<Record<string, string>>>;
    };
    // A dynamic route with no generateStaticParams cannot be prerendered and so
    // has no fixed URLs to advertise. Failing loudly beats silently dropping it.
    if (!module_.generateStaticParams) {
      throw new Error(`${pagePath} is a dynamic route with no generateStaticParams`);
    }
    for (const params of await module_.generateStaticParams()) {
      found.push(`${prefix}/${params[paramName]}`);
    }
  }
  return found;
}

describe('the SEO route lists match the routes that actually exist', () => {
  let onDisk: string[] = [];
  const classified = [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES].sort();

  beforeAll(async () => {
    onDisk = (await routesOnDisk()).sort();
  });

  it('finds the routes it is supposed to be checking', () => {
    // Guards the guard: a walker that silently returns [] would make every
    // assertion below vacuously true.
    expect(onDisk.length).toBeGreaterThan(0);
    expect(onDisk).toContain('/');
  });

  it('classifies every page as either indexable or deliberately noindex', () => {
    // Fails when a page is added without a decision being made about whether
    // crawlers should see it — which is the point: that decision should be
    // explicit, not defaulted.
    expect(classified).toEqual(onDisk);
  });

  it('never advertises a route with no page behind it', () => {
    for (const route of INDEXABLE_ROUTES) {
      expect(onDisk, `${route} is in the sitemap but has no page.tsx`).toContain(route);
    }
  });

  it('keeps the two lists disjoint', () => {
    const overlap = INDEXABLE_ROUTES.filter((route) =>
      (NOINDEX_ROUTES as readonly string[]).includes(route),
    );
    expect(overlap).toEqual([]);
  });

  it('expands a dynamic segment into its real URLs', async () => {
    // The tier pages exist only as /residential/[tier] on disk. If this ever
    // reports the bracketed form, the walker has stopped expanding and every
    // assertion about dynamic routes below has gone vacuous.
    expect(onDisk).toContain('/residential/essential');
    expect(onDisk.some((route) => route.includes('['))).toBe(false);
  });

  it('every nav link now has a page behind it', async () => {
    // This assertion used to be its own inverse. lib/nav.ts deliberately linked
    // ahead of the build to routes that did not exist, so the test checked that
    // at least one was still unbuilt and that none of those had leaked into the
    // sitemap — the risk then being that someone would "simplify" the sitemap by
    // sourcing it from the nav and hand a crawler thirty dead URLs.
    //
    // Every nav destination is now built, so the useful invariant flips: a nav
    // item pointing at a route that does not exist is a dead link in the site
    // chrome, which is the most visible kind. tests/e2e/pages.spec.ts walks the
    // footer against a live server for the same reason; this catches it at unit
    // speed, before a build.
    //
    // The sitemap is still NOT sourced from the nav. The two happen to coincide
    // today; they are different lists for different jobs, and conflating them
    // would break again the moment nav links ahead of the build once more.
    const { NAV_ITEMS, BOOK_AUDIT } = await import('@/lib/nav');
    const missing = [...NAV_ITEMS, BOOK_AUDIT].filter((item) => !onDisk.includes(item.href));
    expect(missing.map((item) => item.href)).toEqual([]);
  });
});
