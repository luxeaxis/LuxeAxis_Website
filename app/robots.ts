import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/seo/origin';
import { NOINDEX_ROUTES } from '@/lib/seo/routes';

/**
 * robots.txt — previously absent entirely, so every crawler fell back to
 * "fetch anything" and had no pointer to the sitemap.
 *
 * `disallow` is generated from `NOINDEX_ROUTES` rather than written out, so
 * the file cannot drift from the pages that actually set
 * `robots: { index: false }` in their own metadata. The two are belt and
 * braces on purpose and are NOT redundant: the meta directive only takes
 * effect once a crawler has fetched and parsed the page, while this stops the
 * fetch. Neither is a security control — `/style` is public either way; this
 * is about keeping a developer reference out of search results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: [...NOINDEX_ROUTES] }],
    sitemap: new URL('/sitemap.xml', SITE_ORIGIN).href,
    host: SITE_ORIGIN,
  };
}
