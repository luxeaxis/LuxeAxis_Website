'use client';

/**
 * LangSwitch — EN / தமிழ் (design system §3.3, 3D spec §2.3).
 *
 * i18n/routing.ts (`localeDetection: false`) explains at length why this
 * component must navigate to `/ta<route>` directly and must NOT lean on any
 * next-intl locale-detection or on `NEXT_LOCALE` as persistence — read that
 * comment before changing this file. `usePathname` (i18n/navigation.ts) is
 * read-only: it never calls next-intl's `useRouter`, so it can never trigger
 * that hook's `syncLocaleCookie` side effect, and it never touches
 * `NEXT_LOCALE`.
 *
 * "Only offer Tamil where the current route is actually published in Tamil"
 * — offering a switch that immediately 307s back (middleware.ts, driven by
 * lib/i18n/published.ts's PUBLISHED.ta gate) is worse than not offering it,
 * so on an unpublished route while reading English this renders nothing at
 * all rather than a switch with only one, already-active option.
 */

import { usePathname } from '@/i18n/navigation';
import { Link } from './Link';
import { Cluster } from './layout';
import { isPublished, normalise, type Locale } from '@/lib/i18n/published';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE_SECONDS } from '@/lib/i18n/cookie';

/** Writes the app-owned "last chosen language" cookie, which `middleware.ts`
 *  reads on the next unprefixed request to send a returning Tamil reader
 *  straight to `/ta<route>` — the spec's "persists via cookie" (§2.3, §3.3).
 *
 *  It is NOT next-intl's `NEXT_LOCALE`, and the redirect it drives is NOT
 *  next-intl's `localeDetection`. That distinction is the whole safety
 *  argument: middleware only ever honours this cookie for routes where
 *  `isPublished(route, 'ta')` is true, the exact complement of the condition
 *  under which it redirects /ta away, so the pair cannot cycle.
 *  `localeDetection` redirected irrespective of publication and did cycle.
 *  Read i18n/routing.ts and middleware.ts together before changing either.
 *
 *  Cookie attributes: `Path=/` because the preference is site-wide, not
 *  per-section. `SameSite=Lax` because it must survive a top-level navigation
 *  in from a search result or a shared link — that is precisely the return
 *  visit it exists to serve — while still being withheld from cross-site
 *  subrequests. No `Secure`: it would drop the cookie on plain-HTTP localhost
 *  and silently disable this path in development, and the value is a two-letter
 *  language tag, not a credential. No `HttpOnly`, necessarily — this is written
 *  from the browser. */
function rememberLocale(locale: 'en' | 'ta') {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Max-Age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function LangSwitch({ locale, className }: { locale: Locale; className?: string }) {
  // `next/navigation`'s underlying PathnameContext is `null` outside a real
  // Next.js router (e.g. an isolated unit test render) — `?? '/'` keeps this
  // component usable in that context instead of throwing on `.startsWith`.
  const route = normalise(usePathname() ?? '/');
  const taPublished = isPublished(route, 'ta');

  if (locale === 'en' && !taPublished) return null;

  const enHref = route;
  const taHref = route === '/' ? '/ta' : `/ta${route}`;

  return (
    <nav aria-label="Language" className={className}>
      <Cluster gap={2} align="baseline">
        {locale === 'en' ? (
          <span aria-current="true" className="text-small font-medium text-on-surface">
            EN
          </span>
        ) : (
          <Link
            href={enHref}
            variant="standalone"
            className="text-small"
            onClick={() => rememberLocale('en')}
          >
            EN
          </Link>
        )}
        <span aria-hidden="true" className="text-small text-border-strong">
          /
        </span>
        {locale === 'ta' ? (
          <span aria-current="true" lang="ta" className="text-small font-medium text-on-surface">
            தமிழ்
          </span>
        ) : (
          <Link
            href={taHref}
            variant="standalone"
            lang="ta"
            className="text-small"
            onClick={() => rememberLocale('ta')}
          >
            தமிழ்
          </Link>
        )}
      </Cluster>
    </nav>
  );
}
