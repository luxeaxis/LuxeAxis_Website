import { describe, expect, it } from 'vitest';
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

const APP_DIR = join(process.cwd(), 'app', '[locale]');

/** Walks app/[locale] and returns the route path of every page.tsx found.
 *  Dynamic segments are skipped: a bracketed directory is not a fixed URL, so
 *  it cannot appear in a sitemap. Today that is only the [...rest] catch-all,
 *  which exists purely to 404. */
function routesOnDisk(dir: string = APP_DIR, prefix = ''): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name === 'page.tsx') {
      found.push(prefix === '' ? '/' : prefix);
      continue;
    }
    if (!entry.isDirectory() || entry.name.startsWith('[')) continue;
    found.push(...routesOnDisk(join(dir, entry.name), `${prefix}/${entry.name}`));
  }
  return found;
}

describe('the SEO route lists match the routes that actually exist', () => {
  const onDisk = routesOnDisk().sort();
  const classified = [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES].sort();

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

  it('does not confuse the nav list for the route list', async () => {
    // lib/nav.ts deliberately links to routes that do not exist yet (it says
    // so). Sourcing the sitemap from it — an easy-looking simplification —
    // would put ~30 dead URLs in front of a crawler.
    const { NAV_ITEMS } = await import('@/lib/nav');
    const unbuilt = NAV_ITEMS.filter((item) => !onDisk.includes(item.href));
    expect(unbuilt.length).toBeGreaterThan(0);
    for (const item of unbuilt) {
      expect(INDEXABLE_ROUTES as readonly string[]).not.toContain(item.href);
    }
  });
});
