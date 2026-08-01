import type { MetadataRoute } from 'next';
import { canonicalFor } from '@/lib/seo/hreflang';
import { INDEXABLE_ROUTES } from '@/lib/seo/routes';

/**
 * The sitemap, derived rather than authored.
 *
 * `components/Footer.tsx` has linked `/sitemap.xml` since the nav shipped, and
 * that link 404'd until this file existed.
 *
 * Which routes belong here comes from `INDEXABLE_ROUTES` (lib/seo/routes.ts),
 * which tests/unit/routes.test.ts pins to the actual route files, so a page
 * cannot be added or deleted without this file following.
 *
 * No `lastModified`: this is a static site with no content dates to read, and a
 * fabricated "now" on every build tells crawlers the whole site changed each
 * deploy. It becomes real when the content layer carries genuine publish dates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({ url: canonicalFor(route).canonical }));
}
