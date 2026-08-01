import { SITE_ORIGIN } from './origin';

/**
 * Canonical URLs.
 *
 * This module used to build hreflang alternates across `en`/`ta` and was the
 * single source of truth for which locales a route was published in. The i18n
 * stack is gone, so there is exactly one URL per route and the only thing left
 * worth stating is the canonical — kept as a module rather than inlined at each
 * page so the origin is read from one place (lib/seo/origin.ts) that the
 * sitemap and robots.txt also read.
 *
 * `alternates.languages` is deliberately NOT emitted any more. A single-locale
 * site that advertises language alternates is claiming translations it does not
 * have, and a `hreflang="en"` pointing at the same URL as the canonical is
 * noise at best.
 */
export function canonicalFor(route: string): { canonical: string } {
  return { canonical: new URL(normalise(route), SITE_ORIGIN).href };
}

/** Strips a trailing slash so '/pricing/' and '/pricing' cannot canonicalise
 *  to two different URLs. Root stays '/'. */
export function normalise(route: string): string {
  const trimmed = route.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}
