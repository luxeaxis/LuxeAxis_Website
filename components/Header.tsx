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
 * without shrinking the client bundle, since Button/Link/MobileSheet below it
 * are already client leaves. Same trade-off Button.tsx
 * documents for why it accepts `"use client"` despite mostly-static markup.
 */

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Link } from './Link';
import { Logo } from './Logo';
import { MobileSheet } from './MobileSheet';
import { NavDropdown } from './NavDropdown';
import { Cluster, Container } from './layout';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, BOOK_AUDIT } from '@/lib/nav';

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// Design system §3.3: "Condense on scroll >80px". Not a colour/space/
// duration/easing value, so there is no token family it could reference —
// it is a JS scroll-trigger threshold taken verbatim from the spec text.
const CONDENSE_THRESHOLD_PX = 80;

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [condensed, setCondensed] = useState(false);
  const [openMenuHref, setOpenMenuHref] = useState<string | null>(null);
  // `?? '/'`: `next/navigation`'s PathnameContext is `null` outside a mounted
  // Next.js router, which is exactly the case in an isolated unit-test render.
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > CONDENSE_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cx(
        'lx-glass relative w-full',
        // "height + blur only — no layout shift of content" (§3.3): the
        // transition only ever touches these two properties.
        'transition-[height] duration-ui ease-standard motion-reduce:transition-none',
        condensed && 'lx-glass--condensed',
        condensed
          ? 'h-[var(--component-nav-height-condensed)]'
          : 'h-[var(--component-nav-height)]',
      )}
    >
      <Container className="h-full">
        <div className="flex h-full items-center justify-between gap-4">
          {/* The real mark at last (spec §3.6), from the studio's Illustrator
              master. The monogram is SVG; the wordmark stays HTML text so it
              remains selectable, searchable and translatable, and so it uses
              the display font the rest of the site does rather than the master's
              JavaneseText, which no visitor has. `aria-hidden` on the mark: the
              link's own label already says the brand name, and announcing it
              twice is noise. */}
          <Link
            href="/"
            variant="standalone"
            className="shrink-0 no-underline hover:no-underline focus-visible:no-underline !no-underline"
            aria-label="Luxe Axis — home"
          >
            <span className="flex items-center gap-3">
              <Logo className="h-icon-lg w-auto text-accent" />
              <span className="flex flex-col justify-center leading-none">
                <span className="font-display text-[length:var(--typography-h3-font-size)] tracking-[var(--font-tracking-wider)] font-bold">
                  <span className="text-accent">LUXE</span>{' '}
                  <span className="text-accent">AXIS</span>
                </span>
                <span className="font-ui text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-accent/85 font-bold mt-0.5">
                  DESIGNING DREAMS
                </span>
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex md:items-center md:h-full"
          >
            <Cluster as="ul" gap={6} className="list-none items-center">
              {NAV_ITEMS.map((item) =>
                item.megaMenu || item.subItems ? (
                  <NavDropdown
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    isOpen={openMenuHref === item.href}
                    onOpen={() => setOpenMenuHref(item.href)}
                    onClose={() =>
                      setOpenMenuHref((href) =>
                        href === item.href ? null : href,
                      )
                    }
                  />
                ) : (
                  <li key={item.href} className="relative flex items-center">
                    <Link
                      href={item.href}
                      variant="standalone"
                      aria-current={
                        isActiveRoute(pathname, item.href) ? 'page' : undefined
                      }
                      className="inline-flex items-center gap-1.5 py-2 font-medium no-underline hover:no-underline aria-[current=page]:no-underline"
                    >
                      <span>{item.label}</span>
                    </Link>
                    {isActiveRoute(pathname, item.href) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full shadow-[0_0_8px_rgba(255,193,7,0.8)]" />
                    )}
                  </li>
                ),
              )}
            </Cluster>
          </nav>

          <Cluster gap={4} align="center" className="shrink-0">
            {/* Standard header button styling */}
            <Button
              as="a"
              href={BOOK_AUDIT.href}
              className="hidden md:inline-flex"
            >
              {BOOK_AUDIT.label}
            </Button>
            <Button
              as="a"
              href={BOOK_AUDIT.href}
              size="sm"
              className="md:hidden"
            >
              {BOOK_AUDIT.label}
            </Button>
            <MobileSheet />
          </Cluster>
        </div>
      </Container>
    </header>
  );
}
