'use client';

/**
 * MobileSheet — hamburger trigger + full-screen nav sheet for <md (design
 * system §3.3; 3D spec §2.3 "Mobile: hamburger → full-screen sheet…", N6).
 *
 * The panel stays mounted through its own close transition instead of
 * unmounting the instant `open` flips to `false`: `onTransitionEnd` performs
 * the actual unmount once the CSS transition finishes. That works unmodified
 * under `prefers-reduced-motion` — globals.css's safety net collapses every
 * transition to ~0ms (not to *no* transition), so `transitionend` still
 * fires, just immediately — rather than needing a parallel branch that skips
 * the "wait for it to finish" step.
 *
 * While `mounted` (open or still closing) the panel is a real, focusable
 * part of the DOM and the body scroll-locks; while genuinely `open` it also
 * traps focus and answers Esc. Unmounting on close (rather than leaving it
 * `translate-y-full` off-screen but still present) is what guarantees a
 * closed sheet is never Tab-reachable — an off-screen-but-mounted panel
 * would still accept keyboard focus, which is the classic version of this
 * bug.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Button } from './Button';
import { Link } from './Link';
import { Logo } from './Logo';
import { Stack } from './layout';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, BOOK_AUDIT } from '@/lib/nav';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileSheet() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const panelId = useId();
  const titleId = useId();
  // `?? '/'`: `next/navigation`'s PathnameContext is `null` outside a mounted
  // Next.js router, which is exactly the case in an isolated unit-test render.
  const pathname = usePathname() ?? '/';

  const openSheet = () => {
    setMounted(true);
    setOpen(true);
  };

  // Stable identity (triggerId never changes) so the focus-trap effect below
  // can depend on it without re-binding its listener every render.
  const closeSheet = useCallback(() => {
    setOpen(false); // starts the close transition; onTransitionEnd unmounts
    document.getElementById(triggerId)?.focus(); // return focus to the trigger
  }, [triggerId]);

  // Body scroll lock spans the whole mounted window (open + closing) so the
  // page behind never jumps mid-close-transition.
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  // Initial focus + Esc + Tab trap — active only while genuinely `open`
  // (not mid-close), matching "focus trapped … Esc closes" (§3.3).
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSheet();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      // Pull focus back in if it is not inside the panel at all. Checking only
      // the first/last boundaries below is not enough: focus can legitimately
      // sit OUTSIDE while this is open — returning from browser chrome or the
      // address bar lands on the document's first focusable, which is the skip
      // link, not the panel. Neither boundary branch fires there, so Tab would
      // walk the whole background. `aria-modal` hides that content from
      // screen readers but has no effect on keyboard order.
      // Re-read the ref rather than closing over the narrowed `panel`:
      // `onKeyDown` is a hoisted function declaration, so TypeScript cannot
      // prove the outer `if (!panel) return` guard still holds when it runs.
      const root = panelRef.current;
      if (root && !root.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeSheet]);

  return (
    <div className="md:hidden">
      <Button
        id={triggerId}
        variant="icon"
        icon={open ? 'close' : 'menu'}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls={mounted ? panelId : undefined}
        onClick={() => (open ? closeSheet() : openSheet())}
      />

      {mounted && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && !open) setMounted(false);
          }}
          className={cx(
            'fixed inset-0 z-drawer flex flex-col bg-surface',
            // "Full-screen sheet slides up (enter, entrance)" (§3.3/N6).
            'transition-transform duration-enter ease-entrance motion-reduce:transition-none',
            open ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          <div className="flex items-center justify-between border-b-hairline border-border-subtle p-4">
            <div className="flex items-center gap-3">
              <Logo className="h-icon-md w-auto text-accent" />
              <h2
                id={titleId}
                className="font-display text-[length:var(--typography-h3-font-size)] font-bold text-accent tracking-[var(--font-tracking-wider)]"
              >
                LUXE AXIS
              </h2>
            </div>
            <Button variant="icon" icon="close" aria-label="Close menu" onClick={closeSheet} />
          </div>

          <nav aria-label="Primary" className="flex-1 overflow-y-auto p-4">
            <Stack as="ul" gap={1} className="list-none">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="border-b border-border-subtle/40 pb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      variant="standalone"
                      aria-current={isActiveRoute(pathname, item.href) ? 'page' : undefined}
                      className="block py-3 text-[length:var(--typography-h3-font-size)] font-semibold"
                      onClick={closeSheet}
                    >
                      {item.label}
                    </Link>
                  </div>

                  {item.megaMenu ? (
                    <div className="pl-3 pb-3 space-y-3">
                      {item.megaMenu.groups.map((group) => (
                        <div key={group.title} className="space-y-1">
                          <p className="text-[10px] font-ui uppercase font-bold tracking-widest text-accent/80 pt-1">
                            {group.title}
                          </p>
                          <ul className="list-none space-y-1">
                            {group.items.map((sub) => (
                              <li key={sub.href + sub.label}>
                                <Link
                                  href={sub.href}
                                  variant="standalone"
                                  aria-current={isActiveRoute(pathname, sub.href) ? 'page' : undefined}
                                  className="flex items-center justify-between py-1 text-small text-on-surface-2 hover:text-accent"
                                  onClick={closeSheet}
                                >
                                  <span>{sub.label}</span>
                                  {sub.badge && (
                                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 bg-accent/20 text-accent rounded border border-accent/30">
                                      {sub.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : item.subItems ? (
                    <ul className="pl-4 pb-2 list-none grid grid-cols-1 gap-1">
                      {item.subItems.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            variant="standalone"
                            aria-current={isActiveRoute(pathname, sub.href) ? 'page' : undefined}
                            className="block py-1.5 text-body text-on-surface-2 hover:text-accent"
                            onClick={closeSheet}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </Stack>
          </nav>

          {/* Sticky Book Audit bar pinned to the bottom safe-area (§3.3). */}
          <div className="sticky bottom-0 border-t-hairline border-border-subtle bg-surface p-4 pb-[max(var(--space-4),env(safe-area-inset-bottom))]">
            <Button as="a" href={BOOK_AUDIT.href} className="w-full" onClick={closeSheet}>
              {BOOK_AUDIT.label}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
