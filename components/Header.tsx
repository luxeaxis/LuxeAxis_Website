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
import Image from 'next/image';
import { Button } from './Button';
import { Link } from './Link';
import { Logo } from './Logo';
import { MobileSheet } from './MobileSheet';
import { Cluster, Container } from './layout';
import { usePathname } from 'next/navigation';
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
        condensed ? 'h-[var(--component-nav-height-condensed)]' : 'h-[var(--component-nav-height)]',
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
          <Link href="/" variant="standalone" className="shrink-0" aria-label="Luxe Axis — home">
            <span className="flex items-center gap-3">
              <Logo className="h-icon-lg w-auto text-accent" />
              <span className="font-display text-[length:var(--typography-h3-font-size)] tracking-[var(--font-tracking-wider)] font-bold">
                <span className="text-accent">LUXE</span>{' '}
                <span className="text-accent">AXIS</span>
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <Cluster as="ul" gap={6} className="list-none">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    variant="standalone"
                    aria-current={isActiveRoute(pathname, item.href) ? 'page' : undefined}
                    className="inline-flex items-center gap-1.5 py-2"
                  >
                    <span>{item.label}</span>
                    {item.subItems && (
                      <span className="text-accent text-overline transition-transform duration-micro group-hover:rotate-180" aria-hidden="true">
                        ▾
                      </span>
                    )}
                  </Link>

                  {item.megaMenu ? (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block group-focus-within:block pt-2 w-[760px] max-w-[90vw] z-50 transition-all duration-300">
                      <div className="lx-liquid-glass rounded-2xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.9)] border border-accent/40 backdrop-blur-2xl bg-surface-deep/95 max-h-[72vh] overflow-y-auto scrollbar-thin">
                        <div className="grid grid-cols-12 gap-5 items-start">
                          {/* Main Links Area (7 cols or 12 cols) */}
                          <div className={item.megaMenu.featured ? 'col-span-7' : 'col-span-12'}>
                            <div className="grid grid-cols-1 gap-3.5">
                              {item.megaMenu.groups.map((group) => (
                                <div key={group.title}>
                                  <h4 className="font-ui text-[11px] uppercase tracking-[0.15em] text-accent font-bold mb-1.5 pb-0.5 border-b border-border-subtle/40">
                                    {group.title}
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                                    {group.items.map((sub) => (
                                      <Link
                                        key={sub.href + sub.label}
                                        href={sub.href}
                                        variant="standalone"
                                        aria-current={isActiveRoute(pathname, sub.href) ? 'page' : undefined}
                                        className="group/item flex items-center justify-between p-1 rounded hover:bg-surface-elevated/60 transition-colors"
                                      >
                                        <div className="min-w-0 pr-1">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[13px] font-semibold text-on-surface group-hover/item:text-accent transition-colors truncate">
                                              {sub.label}
                                            </span>
                                            {sub.badge && (
                                              <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-accent/20 text-accent border border-accent/30 shrink-0">
                                                {sub.badge}
                                              </span>
                                            )}
                                          </div>
                                          {sub.description && (
                                            <p className="text-[10px] text-on-surface-3 line-clamp-1 font-sans">
                                              {sub.description}
                                            </p>
                                          )}
                                        </div>
                                        <span className="text-accent opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all text-xs shrink-0">
                                          →
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Featured Spotlight Card (5 cols) */}
                          {item.megaMenu.featured && (
                            <div className="col-span-5 border-l border-border-subtle/50 pl-4 flex flex-col justify-between h-full">
                              <div>
                                <div className="relative rounded-lg overflow-hidden aspect-[16/9] border border-accent/30 mb-2 group/card">
                                  <Image
                                    src={item.megaMenu.featured.image}
                                    alt={item.megaMenu.featured.title}
                                    fill
                                    sizes="220px"
                                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/30 to-transparent" />
                                  <div className="absolute top-1.5 left-1.5">
                                    <span className="text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-accent text-surface-deep">
                                      Spotlight
                                    </span>
                                  </div>
                                </div>
                                <p className="text-overline text-accent uppercase font-bold tracking-wider text-[10px]">
                                  Featured Case Study
                                </p>
                                <h5 className="font-display text-small font-bold text-on-surface line-clamp-1 mb-1">
                                  {item.megaMenu.featured.title}
                                </h5>
                                <p className="text-[11px] text-on-surface-2 line-clamp-2 mb-2">
                                  {item.megaMenu.featured.tagline}
                                </p>
                              </div>
                              <Button as="a" href={item.megaMenu.featured.href} size="sm" className="w-full justify-center text-xs py-1.5">
                                {item.megaMenu.featured.ctaText}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : item.subItems ? (
                    <div className="absolute top-full left-0 hidden group-hover:block group-focus-within:block pt-2 w-[480px] max-w-[90vw] z-50 transition-all duration-300">
                      <div className="lx-liquid-glass rounded-xl p-4 shadow-2xl border border-accent/30 backdrop-blur-xl max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2 mb-2">
                          <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                            {item.label} Services
                          </span>
                          <Link href={item.href} variant="standalone" className="text-overline text-accent">
                            View All →
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              variant="standalone"
                              aria-current={isActiveRoute(pathname, sub.href) ? 'page' : undefined}
                              className="text-small py-1 text-on-surface-2 hover:text-accent font-medium transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
              ))}
            </Cluster>
          </nav>

          <Cluster gap={4} align="center" className="shrink-0">
            {/* Standard header button styling */}
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
