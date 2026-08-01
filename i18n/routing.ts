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
  // Tamil discovery — how a visitor reaches /ta at all, given the above.
  // (This paragraph replaces an earlier one that said no language switcher
  // existed anywhere in the app and that typing the URL was the only way in.
  // Both were true when written and neither is true now; components/
  // LangSwitch.tsx shipped in df86b0d. Left recorded because the constraints
  // below are the reason that component is shaped the way it is.)
  //
  // Two mechanisms, both explicit, neither leaning on next-intl:
  //
  // 1. components/LangSwitch.tsx — an EN / தமிழ் control in Header and
  //    MobileSheet. It navigates directly to `/ta<route>` and only offers
  //    Tamil where isPublished() says the current route has one, so it can
  //    never point at a URL middleware.ts would immediately 307 away from.
  //
  // 2. The `lx-locale` cookie that switch writes, honoured in middleware.ts.
  //    This is the app's OWN cookie, not next-intl's `NEXT_LOCALE`: with
  //    localeDetection: false, next-intl ignores NEXT_LOCALE entirely — it
  //    will neither read it to redirect nor treat it as persistence — so the
  //    spec's "persists via cookie" wording (3D Website Spec §2.3, Design
  //    System §3.3) has to be satisfied by a cookie we own end to end.
  //
  // Mechanism 2 is the shape this comment previously prescribed for
  // recovering auto-detection without the loop, and it is worth restating why
  // it is loop-free: middleware.ts only ever redirects to `/ta<route>` when
  // isPublished(route, 'ta') is true, and the /ta -> English redirect fires
  // only when it is FALSE. The two conditions are exact complements, so a
  // request can never satisfy both and no request can bounce between them.
  // Re-enabling `localeDetection` would NOT share that property — it
  // redirects on Accept-Language regardless of publication, which is the
  // precise bug that produced 12 hops and curl exiting 47. The flag stays off
  // even now that discovery works again.
  //
  // Deliberately still cookie-driven and not header-driven: the cookie only
  // ever exists because a visitor clicked the switch, so honouring it repeats
  // a choice they actually made. Accept-Language would instead guess from a
  // browser setting most people have never seen, and guessing Tamil for a
  // Chennai visitor who wants English is the more annoying error.
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
