import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n/published';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  // Both default to true and MUST stay disabled — do not "fix" this back on
  // without re-reading this comment.
  //
  // localeDetection: with this on, next-intl redirects an unprefixed route
  // to /ta/<route> for any visitor whose Accept-Language (or NEXT_LOCALE
  // cookie) prefers Tamil. Our own middleware (middleware.ts) separately
  // 307s any *unpublished* /ta/<route> straight back to the unprefixed
  // route — lib/i18n/published.ts's PUBLISHED.ta gate, since a human-
  // reviewed Tamil translation exists for only '/'. Those two redirects
  // fire on every route except the one published one, forever: verified
  // against a running server at 12 hops, curl -L exiting 47. It is also
  // sticky — next-intl's syncCookie writes NEXT_LOCALE=ta with a one-year
  // maxAge the first time a visitor reaches /ta, so a Tamil-preferring
  // visitor who ever lands on the published home is then locked into the
  // loop on every other route for a year, even sending Accept-Language:
  // en-US on later requests.
  //
  // Disabling localeDetection makes the publication gate (PUBLISHED.ta) the
  // single authority on locale routing: nothing auto-redirects based on
  // request headers or cookies, only on what's actually published. The
  // accepted trade-off: a Tamil-preferring visitor is served English even
  // at '/', which IS published in Tamil — they get no automatic nudge to
  // /ta and must follow an explicit link or type it themselves. That is
  // deliberate, correctness over convenience, and is exactly what
  // tests/e2e/locale.spec.ts's "Accept-Language: ta on the published root"
  // case pins down. Re-enabling this will silently reintroduce the loop for
  // every unpublished route.
  localeDetection: false,
  // alternateLinks: with this on (the default), next-intl emits a `Link`
  // header advertising /ta/<route> alternates for every route, including
  // unpublished ones — a URL that our middleware immediately 307s away
  // from. lib/seo/hreflang.ts's alternatesFor() is the actual source of
  // truth for hreflang alternates (it consults the same PUBLISHED.ta gate
  // and deliberately omits the ta alternate for unpublished routes), so a
  // second, disagreeing source telling crawlers to index a redirecting URL
  // is a lie by omission of context. Disabling this makes alternatesFor()
  // the single source of alternate-language links.
  alternateLinks: false,
});
