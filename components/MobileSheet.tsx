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
import { LangSwitch } from './LangSwitch';
import { Stack } from './layout';
import { usePathname } from '@/i18n/navigation';
import { NAV_ITEMS, BOOK_AUDIT } from '@/lib/nav';
import type { Locale } from '@/lib/i18n/published';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileSheet({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const panelId = useId();
  const titleId = useId();
  // `?? '/'`: the underlying PathnameContext is `null` outside a mounted
  // Next.js router (e.g. an isolated unit-test render) — see LangSwitch.tsx.
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
            <h2
              id={titleId}
              className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface"
            >
              Menu
            </h2>
            <Button variant="icon" icon="close" aria-label="Close menu" onClick={closeSheet} />
          </div>

          <nav aria-label="Primary" className="flex-1 overflow-y-auto p-4">
            <Stack as="ul" gap={1} className="list-none">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    variant="standalone"
                    aria-current={isActiveRoute(pathname, item.href) ? 'page' : undefined}
                    className="block py-3 text-[length:var(--typography-h3-font-size)]"
                    onClick={closeSheet}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </Stack>
            <div className="mt-6">
              <LangSwitch locale={locale} />
            </div>
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
