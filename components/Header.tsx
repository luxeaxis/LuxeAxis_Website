'use client';

/**
 * Header — sticky, glass, condensing nav (design system §3.3; 3D spec §2.3,
 * N1 "Header condense").
 *
 * The whole component is a Client Component rather than a Server Component
 * shell around one small client sub-part: the condense state is read off
 * `window.scrollY` (needs an effect + listener), and `aria-current="page"`
 * needs the current route via `usePathname`, itself a client-only hook. Both
 * of those are genuine per-render concerns of Header's own markup, not of
 * some inner leaf — splitting out a wrapper would just move the boundary
 * without shrinking the client bundle, since Button/Link/LangSwitch/
 * MobileSheet below it are already client leaves. Same trade-off Button.tsx
 * documents for why it accepts `"use client"` despite mostly-static markup.
 */

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Button } from './Button';
import { Link } from './Link';
import { LangSwitch } from './LangSwitch';
import { MobileSheet } from './MobileSheet';
import { Cluster, Container } from './layout';
import { usePathname } from '@/i18n/navigation';
import { NAV_ITEMS, BOOK_AUDIT } from '@/lib/nav';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

// Design system §3.3: "Condense on scroll >80px". Not a colour/space/
// duration/easing value, so there is no token family it could reference —
// it is a JS scroll-trigger threshold taken verbatim from the spec text.
const CONDENSE_THRESHOLD_PX = 80;

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [condensed, setCondensed] = useState(false);
  // `?? '/'`: the underlying PathnameContext is `null` outside a mounted
  // Next.js router (e.g. an isolated unit-test render) — see LangSwitch.tsx.
  const pathname = usePathname() ?? '/';
  const locale = useLocale();

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > CONDENSE_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const homeHref = locale === 'ta' ? '/ta' : '/';

  return (
    <header
      className={cx(
        'lx-glass sticky top-0 z-header w-full',
        // "height + blur only — no layout shift of content" (§3.3): the
        // transition only ever touches these two properties.
        'transition-[height] duration-ui ease-standard motion-reduce:transition-none',
        condensed && 'lx-glass--condensed',
        condensed ? 'h-[var(--component-nav-height-condensed)]' : 'h-[var(--component-nav-height)]',
      )}
    >
      <Container className="h-full">
        <div className="flex h-full items-center justify-between gap-4">
          {/* Logo slot — text wordmark placeholder. The real mark
              (logo-horizontal.svg, spec §3.6) is blocked on vectorising the
              supplied raster; this stands in for it and should be the first
              thing swapped out once that asset lands. Coloured to match the
              intended two-tone lockup (gold "LUXE" / on-surface "AXIS") so
              it reads as the brand mark-in-waiting, not a stray label. */}
          <Link href={homeHref} variant="standalone" className="shrink-0" aria-label="Luxe Axis — home">
            <span className="font-display text-[length:var(--typography-h3-font-size)] tracking-[var(--font-tracking-wider)]">
              <span className="text-accent">LUXE</span> <span className="text-on-surface">AXIS</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <Cluster as="ul" gap={6} className="list-none">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    variant="standalone"
                    aria-current={isActiveRoute(pathname, item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </Cluster>
          </nav>

          <Cluster gap={4} align="center" className="shrink-0">
            <div className="hidden md:block">
              <LangSwitch />
            </div>
            {/* Two real buttons, not one responsively-resized one: `md` size
                reads right at desktop scale, but the primary CTA still has
                to be a single one-tap control on mobile (spec "reachable in
                one action on mobile") where header real estate is tight —
                `hidden`/`md:hidden` keeps exactly one in the accessibility
                tree at a time, so there is never a duplicate tab stop. */}
            <Button as="a" href={BOOK_AUDIT.href} className="hidden md:inline-flex">
              {BOOK_AUDIT.label}
            </Button>
            <Button as="a" href={BOOK_AUDIT.href} size="sm" className="md:hidden">
              {BOOK_AUDIT.label}
            </Button>
            <MobileSheet />
          </Cluster>
        </div>
      </Container>
    </header>
  );
}
