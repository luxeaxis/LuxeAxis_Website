import { DEFAULT_LOCALE, isPublished, normalise, type Locale } from '@/lib/i18n/published';
// Shared with app/sitemap.ts and app/robots.ts — see lib/seo/origin.ts for why
// this is one constant rather than three matching literals.
import { SITE_ORIGIN as ORIGIN } from './origin';

/**
 * Builds the canonical URL and hreflang alternates for one route in one locale.
 *
 * `locale` is not optional in spirit: a page that omits it canonicalises to its
 * English URL, which is exactly the bug this parameter exists to prevent — every
 * Tamil page pointing `rel=canonical` at its English twin tells Google `/ta` is a
 * duplicate and gets it dropped, negating the bilingual routing entirely. It
 * defaults to `en` only so existing English call sites keep working unchanged.
 */
export function alternatesFor(
  route: string,
  locale: Locale = DEFAULT_LOCALE,
): { languages: Record<string, string>; canonical: string } {
  // Normalise once, through the same function that decides publication
  // (lib/i18n/published.ts), so every URL below is derived from a single
  // canonical route string. Root normalises to '/', everything else loses
  // its trailing slash.
  const normalisedRoute = normalise(route);

  const enHref = new URL(normalisedRoute, ORIGIN).href;
  const taHref = new URL(
    normalisedRoute === '/' ? '/ta' : `/ta${normalisedRoute}`,
    ORIGIN,
  ).href;

  const languages: Record<string, string> = { en: enHref };
  if (isPublished(normalisedRoute, 'ta')) languages.ta = taHref;
  // x-default always points at the default locale, whichever locale is being
  // rendered — it names the fallback for unmatched languages, not "this page".
  languages['x-default'] = enHref;

  // Each locale canonicalises to itself. A Tamil page is a translation, not a
  // duplicate, and only says so if its canonical is its own URL.
  return { languages, canonical: locale === 'ta' ? taHref : enHref };
}
