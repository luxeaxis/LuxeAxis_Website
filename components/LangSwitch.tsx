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

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from './Link';
import { Cluster } from './layout';
import { isPublished, normalise } from '@/lib/i18n/published';

const COOKIE_NAME = 'lx-locale';

/** Writes an app-owned "last chosen language" cookie — a remembered
 *  preference only. Nothing anywhere reads it yet; it is NOT next-intl's
 *  `NEXT_LOCALE` and must never be wired into an auto-redirect. With
 *  `localeDetection: false` (i18n/routing.ts), the only thing permitted to
 *  decide a locale redirect is the `isPublished` gate — cookie-driven
 *  redirection is exactly the mechanism that comment documents as having
 *  caused the infinite-loop bug this repo already fixed once. */
function rememberLocale(locale: 'en' | 'ta') {
  document.cookie = `${COOKIE_NAME}=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

export function LangSwitch({ className }: { className?: string }) {
  const locale = useLocale();
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
