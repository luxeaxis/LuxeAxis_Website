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
  //
  // IMPORTANT — there is currently no language switcher anywhere in the app
  // (grepped app/, components/, features/, lib/ for `/ta`: the only hit is
  // lib/seo/hreflang.ts, which is metadata, not a link a visitor can click).
  // So today "follow an explicit link" is not actually available — typing
  // the URL is the *only* way a visitor reaches Tamil. Before this change,
  // Accept-Language detection was the sole working discovery path and it
  // worked correctly at '/'; that path is now gone with nothing replacing
  // it. Both docs/specs/LuxeAxis_3D_Website_Spec.md §2.3 and
  // docs/specs/LuxeAxis_Design_System.md §3.3 require a "Language switch
  // (EN / தமிழ்) … persists via cookie" utility, so a switcher is not
  // optional polish here — it is mandatory, and the trade-off above is only
  // acceptable until it ships. See "Not in this plan" in
  // docs/superpowers/plans/2026-07-27-foundations.md for the tracked
  // follow-up.
  //
  // Whoever builds that switcher: it must navigate directly to `/ta<route>`
  // (an explicit link/router-push), and it must NOT lean on next-intl's
  // locale detection or the `NEXT_LOCALE` cookie to do so. With
  // localeDetection: false, next-intl ignores NEXT_LOCALE entirely — it
  // will neither read it to redirect nor treat it as a persistence
  // mechanism. So the spec's "persists via cookie" wording needs the
  // switcher to set and read its OWN cookie (app-owned, not next-intl's),
  // and use it purely to remember the visitor's last choice for the next
  // explicit navigation — never to auto-redirect.
  //
  // If the UX regression from no auto-detection ever proves unacceptable,
  // the correct fix is NOT flipping this flag back to true — that
  // reintroduces the exact loop this commit fixed, on every unpublished
  // route. The correct fix is to move detection into middleware.ts, which
  // already imports isPublished, and have it auto-redirect an unprefixed
  // request to /ta<route> only when isPublished(route, 'ta') is true. That
  // kills the loop by construction — the only auto-redirect target is one
  // that is guaranteed not to bounce back — while still recovering
  // auto-detected Tamil at '/'.
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
