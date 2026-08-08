'use client';

/**
 * Tooltip — short hint on hover *and* focus (design system §3.5). Needs
 * `"use client"`: the open-delay timer and hover/focus state are genuine
 * per-instance behaviour, not pure CSS (unlike Button/Card's hover states),
 * so — same reasoning Button.tsx documents — the leaf itself owns the
 * boundary rather than forcing every page that uses one to already be a
 * Client Component.
 *
 * `content` is `string`, not `ReactNode` — §3.5 a11y is explicit: "never
 * contains essential-only info or interactive content." Typing it as plain
 * text makes "no buttons/links inside a tooltip" true by construction
 * rather than a review note, the same move Icon.tsx makes for its
 * label/decorative split.
 *
 * The trigger is cloned (`cloneElement`), not wrapped in a focusable span of
 * its own: `aria-describedby` has to live on the actual interactive element
 * for assistive tech to associate it correctly, and composing onto whatever
 * handlers the trigger already carries (rather than wrapping and hoping
 * bubbling covers it) keeps this usable on any element type, not just plain
 * buttons.
 */

import {
  Children,
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { readDurationMs } from '@/lib/motion/readDurationMs';

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

// §3.5: "240ms open delay, 0 close." 240ms happens to equal `duration.ui`
// (tokens/luxe-axis.tokens.json — "Menus, toggles, tooltips"), so this reads
// the live custom property rather than repeating the number as a bare
// literal — if that token ever changes, the timer stays in lockstep with it
// the same way StatCounter's value-tween does (see readDurationMs.ts).
const OPEN_DELAY_FALLBACK_MS = 240;

type Handler<E> = ((event: E) => void) | undefined;

function compose<E>(
  existing: Handler<E>,
  added: () => void,
): (event: E) => void {
  return (event: E) => {
    existing?.(event);
    added();
  };
}

export type TooltipProps = {
  content: string;
  children: ReactElement<Record<string, unknown>>;
};

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  // `open` gates mounting; `visible` is the animation phase, flipped a frame
  // after mount so the browser registers the "from" state before
  // transitioning to the "to" state (§2.3 "Menu/tooltip open: ui + entrance,
  // fade + rise") — the same two-phase pattern Toast uses for its entrance.
  const [visible, setVisible] = useState(false);
  // `number`, not `ReturnType<typeof setTimeout>` — see Toast.tsx's
  // `timerRef` comment for why `Window.setTimeout`'s unambiguous `number`
  // return type is used here instead.
  const openTimerRef = useRef<number | undefined>(undefined);
  const tooltipId = useId();

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => () => window.clearTimeout(openTimerRef.current), []);

  const show = () => {
    window.clearTimeout(openTimerRef.current);
    const delay = readDurationMs('--duration-ui', OPEN_DELAY_FALLBACK_MS);
    openTimerRef.current = window.setTimeout(() => setOpen(true), delay);
  };

  const hide = () => {
    window.clearTimeout(openTimerRef.current);
    setOpen(false); // 0 close delay — no timer, no lingering exit animation
  };

  // Esc dismisses an open tooltip for keyboard users (§5 "Esc closes
  // layers") — not itself named in §3.5's row, but consistent with every
  // other transient layer in this system (Modal, MobileSheet).
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') hide();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const trigger = Children.only(children);
  const triggerProps: Record<string, unknown> = {
    'aria-describedby': open
      ? tooltipId
      : (trigger.props['aria-describedby'] as string | undefined),
    onMouseEnter: compose(
      trigger.props.onMouseEnter as Handler<MouseEvent>,
      show,
    ),
    onMouseLeave: compose(
      trigger.props.onMouseLeave as Handler<MouseEvent>,
      hide,
    ),
    onFocus: compose(trigger.props.onFocus as Handler<FocusEvent>, show),
    onBlur: compose(trigger.props.onBlur as Handler<FocusEvent>, hide),
  };

  return (
    <span className="relative inline-block">
      {cloneElement(trigger, triggerProps)}
      {open && (
        <span
          role="tooltip"
          id={tooltipId}
          // ~240px is the spec's own literal (§3.5 "glass; max ~240px") —
          // no `size.*` token names it (the space scale stops at 128px,
          // container/measure are page-level values), so this is carried
          // over verbatim from the spec text, not a token reference.
          className={cx(
            'lx-glass pointer-events-none absolute bottom-full left-1/2 z-tooltip mb-2 w-max max-w-[240px] -translate-x-1/2',
            'rounded-md border border-border-subtle px-3 py-2 text-small text-on-surface shadow-1',
            'transition-[opacity,transform] duration-ui ease-entrance motion-reduce:transition-none',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1',
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
