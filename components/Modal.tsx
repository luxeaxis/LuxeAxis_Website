'use client';

/**
 * Modal — centered dialog, glass scrim, focus-trapped (design system §3.5;
 * §1.7's third and last permitted glass usage — "Modal scrim + dialog: the
 * frosted scrim keeps the page faintly visible while focusing the dialog").
 * Needs `"use client"`: focus trap, `Esc`, scroll lock and the scrim-click
 * handler are all real per-instance behaviour.
 *
 * Controlled from outside (`open`/`onClose`), not self-triggering — unlike
 * MobileSheet (which owns a single, fixed trigger), a Modal's trigger varies
 * per call site, so "return focus to trigger on close" is implemented by
 * capturing `document.activeElement` at the moment `open` flips true and
 * restoring it the moment `open` flips back to false — that covers every
 * dismissal path uniformly (Esc, scrim click, the in-panel close button, or
 * the caller closing it programmatically) rather than each path having to
 * remember to call a `returnFocus()` helper itself.
 *
 * The panel stays mounted through its own close transition, unmounting on
 * `onTransitionEnd` — same technique as MobileSheet.tsx (see that file's
 * comment for why: an off-screen-but-mounted panel is still Tab-reachable,
 * which unmounting on close rules out by construction). Body scroll lock is
 * scoped to an effect keyed on `mounted` specifically so its cleanup runs on
 * every path that ends `mounted` — including the component unmounting
 * outright without `open` ever explicitly flipping false first.
 */

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from './Button';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  closeLabel?: string;
  className?: string;
};

export function Modal({ open, onClose, title, children, closeLabel = 'Close', className }: ModalProps) {
  const [mounted, setMounted] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(open);
  const titleId = useId();

  // Mount immediately on open — adjusted synchronously during render
  // (React's documented "adjust state when a prop changes" pattern), not in
  // an effect. An effect keyed on `[open]` would only fire on the SAME
  // commit that flips `open` true, but that commit still renders with the
  // OLD `mounted` (false) — so the dialog DOM (and `panelRef.current`)
  // wouldn't exist yet when the focus-trap effect below (also keyed on
  // `[open]`) runs in that same commit, and a `[open]`-keyed effect never
  // fires again on the following commit where `mounted` catches up, since
  // `open` itself hasn't changed a second time. Setting it here instead
  // guarantees `mounted` and `open` become true in the very same commit, so
  // the panel genuinely exists by the time that effect runs.
  if (open && !mounted) setMounted(true);

  // Focus capture/return: fires exactly once per open→close transition,
  // regardless of which path triggered `onClose`.
  useEffect(() => {
    if (open && !wasOpen.current) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
    } else if (!open && wasOpen.current) {
      previouslyFocused.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // Body scroll lock — spans the whole mounted window (open + closing) so
  // the page behind never jumps mid-close-transition, and its cleanup fires
  // on every exit path including unmount (React always runs the last
  // effect's cleanup then), not just an explicit `onClose` call.
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  // Initial focus + Esc + Tab trap — active only while genuinely `open`.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
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
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <>
      {/* Scrim — §1.7's third permitted glass usage, AND the "scrim-click
          closes" affordance in one element: a real `<button>`, not a `<div
          onClick>`, so it is natively keyboard-operable without a second
          listener jsx-a11y would otherwise require for a click handler on a
          non-interactive element. `aria-hidden` + `tabIndex={-1}` pull it
          back OUT of the accessibility tree and the tab order deliberately
          — `Esc` and the in-panel close button already cover keyboard/AT
          dismissal, and a screen-reader user tabbing through a modal has no
          reason to land on an unlabelled full-viewport button before
          reaching the dialog's real content. `border-0` cancels
          `.lx-glass`'s header-authored `border-bottom` (a stray hairline at
          the bottom of the viewport makes no sense on a full-bleed scrim);
          Tailwind utilities in `@layer utilities` already win over
          `.lx-glass`'s `@layer components` rule on a tie, the same cascade
          order Card.tsx's glass variant already relies on. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className={cx(
          'lx-glass fixed inset-0 z-overlay block appearance-none border-0 p-0',
          'transition-opacity motion-reduce:transition-none',
          open ? 'duration-ui ease-entrance opacity-100' : 'duration-ui ease-exit opacity-0',
        )}
      />
      {/* Centring wrapper — deliberately NOT the click-outside target
          (that's the scrim button behind it): `pointer-events-none` here,
          with `pointer-events-auto` restored on the panel itself, means a
          click anywhere in the empty space around the panel falls through
          to the scrim button beneath it instead of needing its own
          click-target-equality check. */}
      <div className="pointer-events-none fixed inset-0 z-modal flex items-center justify-center p-4">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && !open) setMounted(false);
          }}
          className={cx(
            'pointer-events-auto w-full max-w-md rounded-lg bg-surface-raised p-6 shadow-2',
            'transition-[opacity,transform] motion-reduce:transition-none',
            open
              ? 'duration-enter ease-entrance opacity-100 translate-y-0'
              : 'duration-ui ease-exit opacity-0 translate-y-[var(--motion-distance-rise)]',
            className,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
              {title}
            </h2>
            <Button variant="icon" size="sm" icon="close" aria-label={closeLabel} onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
