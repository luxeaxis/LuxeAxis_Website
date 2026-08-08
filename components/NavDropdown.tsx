'use client';

import { useEffect, useId, type ReactNode } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { Link } from './Link';
import type { NavItem } from '@/lib/nav';

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * A top-level nav item with a hover/focus/click-activated dropdown panel.
 *
 * Replaces pure CSS `group-hover` so touch devices (iPad at ≥768px) can open
 * the mega menu, and so the trigger carries `aria-expanded` / `aria-haspopup`.
 */
export function NavDropdown({
  item,
  pathname,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const hasMenu = item.megaMenu ?? item.subItems;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  let panel: ReactNode = null;

  if (item.megaMenu) {
    panel = (
      <div
        id={panelId}
        className={cx(
          'absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[760px] max-w-[90vw] z-50 transition-all duration-300 ease-out origin-top',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none',
        )}
      >
        <div className="lx-liquid-glass rounded-2xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.95)] border border-accent/40 backdrop-blur-2xl bg-surface-deep/95 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-12 gap-5 items-start">
            <div
              className={item.megaMenu.featured ? 'col-span-7' : 'col-span-12'}
            >
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
                          aria-current={
                            isActiveRoute(pathname, sub.href)
                              ? 'page'
                              : undefined
                          }
                          className="group/item flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-raised/70 transition-all duration-200"
                        >
                          <div className="min-w-0 pr-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-semibold text-on-surface group-hover/item:text-accent transition-colors truncate">
                                {sub.label}
                              </span>
                              {sub.badge && (
                                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 shrink-0">
                                  {sub.badge}
                                </span>
                              )}
                            </div>
                            {sub.description && (
                              <p className="text-[10px] text-on-surface-muted line-clamp-1 font-sans">
                                {sub.description}
                              </p>
                            )}
                          </div>
                          <span className="text-accent opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-200 text-xs shrink-0">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {item.megaMenu.featured && (
              <div className="col-span-5 border-l border-border-subtle/50 pl-4 flex flex-col justify-between h-full">
                <div>
                  <div className="relative rounded-lg overflow-hidden aspect-[16/9] border border-accent/30 mb-2 group/card">
                    <Image
                      src={item.megaMenu.featured.image}
                      alt={item.megaMenu.featured.title}
                      fill
                      sizes="220px"
                      className="object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/30 to-transparent" />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-accent text-surface-deep shadow-sm">
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
                <Button
                  as="a"
                  href={item.megaMenu.featured.href}
                  size="sm"
                  className="w-full justify-center text-xs py-1.5 font-bold"
                >
                  {item.megaMenu.featured.ctaText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else if (item.subItems) {
    panel = (
      <div
        id={panelId}
        className={cx(
          'absolute top-full left-0 pt-2 w-[480px] max-w-[90vw] z-50 transition-all duration-300 ease-out origin-top-left',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none',
        )}
      >
        <div className="lx-liquid-glass rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] border border-accent/40 backdrop-blur-2xl bg-surface-deep/95 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border-subtle/60 pb-2 mb-2">
            <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
              {item.label} Services
            </span>
            <Link
              href={item.href}
              variant="standalone"
              className="text-overline text-accent"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {item.subItems.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                variant="standalone"
                aria-current={
                  isActiveRoute(pathname, sub.href) ? 'page' : undefined
                }
                className="text-small py-1 text-on-surface-2 hover:text-accent font-medium transition-colors"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <li
      className="relative flex items-center"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onClose();
        }
      }}
    >
      <div className="inline-flex items-center gap-1.5 py-2">
        <Link
          href={item.href}
          variant="standalone"
          aria-current={isActiveRoute(pathname, item.href) ? 'page' : undefined}
          className="inline-flex items-center py-0 no-underline hover:no-underline aria-[current=page]:no-underline"
        >
          <span>{item.label}</span>
        </Link>
        {hasMenu && (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-controls={panelId}
            aria-label={`${item.label} menu`}
            className="inline-flex shrink-0 items-center justify-center self-center p-0 text-accent text-overline leading-none transition-colors duration-micro hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm"
            onClick={() => (isOpen ? onClose() : onOpen())}
          >
            <span
              className={cx(
                'inline-block transition-transform duration-micro',
                isOpen && 'rotate-180',
              )}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>
        )}
      </div>
      {isActiveRoute(pathname, item.href) && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full shadow-[0_0_8px_rgba(255,193,7,0.8)]" />
      )}
      {panel}
    </li>
  );
}
