import type { MetadataRoute } from 'next';
import { alternatesFor } from '@/lib/seo/hreflang';
import { INDEXABLE_ROUTES } from '@/lib/seo/routes';
import { isPublished, LOCALES } from '@/lib/i18n/published';

/**
 * The sitemap, derived rather than authored.
 *
 * `components/Footer.tsx` has linked `/sitemap.xml` since the nav shipped, and
 * until now that link 404'd — the site's own footer advertising a URL the site
 * did not serve.
 *
 * Two rules it inherits instead of restating:
 * - Which routes exist at all comes from `INDEXABLE_ROUTES` (lib/seo/routes.ts),
 *   which a unit test pins to the actual route files.
 * - Which locales each route is available in comes from `isPublished`
 *   (lib/i18n/published.ts) — the same gate `middleware.ts` redirects on. An
 *   unpublished `/ta` URL in here would be a URL that 307s away the moment a
 *   crawler followed it.
 *
 * One entry PER LOCALE, not one per route, each carrying its own canonical URL
 * plus the full `alternates.languages` set — the same shape and the same source
 * (`alternatesFor`) as the `<link rel="alternate">` tags in each page's head, so
 * the sitemap and the pages cannot tell a crawler two different stories.
 *
 * No `lastModified`: this is a static export with no content dates to read, and
 * a fabricated "now" on every build tells crawlers the whole site changed each
 * deploy. Omitting it is the honest signal. It becomes real the moment the CMS
 * lands and pages carry genuine publish dates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.flatMap((route) =>
    LOCALES.filter((locale) => isPublished(route, locale)).map((locale) => {
      const { canonical, languages } = alternatesFor(route, locale);
      return { url: canonical, alternates: { languages } };
    }),
  );
}
