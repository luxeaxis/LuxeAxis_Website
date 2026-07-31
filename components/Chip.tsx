'use client';

/**
 * Chip — a removable/selectable Badge (design system §3.5: "removable chips
 * have a 44px hit close"; §3.7 "Chip select: filter chip fills + tiny check
 * draws on select"). Split out from `components/Badge.tsx` rather than
 * folded into one file: Chip's close button is a real `onClick` handler, so
 * (same reasoning as Button/Field) it needs `"use client"` — putting it in
 * Badge's file would drag every plain, non-interactive Badge usage into the
 * client bundle too, exactly the "don't mark a whole component client for
 * one interactive child" mistake the brief calls out.
 *
 * Chip itself holds no state — `selected`/`onSelect`/`onRemove` are all
 * caller-controlled, the same division Field uses for `error`/`success`
 * text. That keeps Chip a plain leaf control usable from any client
 * boundary, not an owner of selection state.
 *
 * The outer element is deliberately NEVER itself a `<button>`, even when
 * `onSelect` is passed: `onSelect` and `onRemove` are independent booleans
 * (a chip can be selectable AND removable at once), and a real `<button>`
 * cannot legally contain another `<button>` (the close affordance) — the
 * first version of this file did exactly that and jsdom's own DOM-nesting
 * validation caught it (`validateDOMNesting: <button> cannot appear as a
 * descendant of <button>`) the moment a test exercised both props together.
 * Select and remove are instead two independent, SIBLING controls inside a
 * non-interactive shell — the pill's border/fill lives on the shell, not on
 * either control, so the two combine visually without either containing the
 * other.
 */

import { Icon } from './Icon';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export type ChipProps = {
  children: string;
  /** Filter-chip selected state (§3.7 "Chip select") — fills + shows a
   *  check, paired with `aria-pressed` so the state is never colour-only. */
  selected?: boolean;
  onSelect?: () => void;
  /** Presence, not a boolean, decides whether the close affordance renders —
   *  same "shape carries the state" pattern as Field's `error`/`success`. */
  onRemove?: () => void;
  /** Required whenever `onRemove` is passed — an icon-only close button
   *  needs its own accessible name (§3.5 a11y: "if dismissible, aria-label
   *  on close"), the same non-optional pairing Button's icon-only variant
   *  enforces in its own types. */
  removeLabel?: string;
  className?: string;
};

export function Chip({ children, selected = false, onSelect, onRemove, removeLabel, className }: ChipProps) {
  if (onRemove && !removeLabel) {
    // A compile-time union could make this impossible the way Button.tsx
    // does for `variant="icon"`, but Chip's `onSelect`/`onRemove` are
    // independent, orthogonal booleans — a discriminated union would have
    // to enumerate every combination. A loud runtime failure in development
    // keeps the same guarantee (no silent icon-only control) without that
    // blow-up.
    throw new Error('Chip: `removeLabel` is required whenever `onRemove` is passed.');
  }

  const isSelectable = Boolean(onSelect);

  return (
    <span
      className={cx(
        'inline-flex items-center rounded-pill border-hairline py-1',
        onRemove ? 'pl-3 pr-1' : 'px-3',
        'font-ui text-overline uppercase tracking-[var(--font-tracking-wide)]',
        'transition-colors duration-micro ease-standard',
        selected ? 'border-accent bg-accent text-accent-contrast' : 'border-border-subtle text-on-surface-2',
        className,
      )}
    >
      {isSelectable ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={onSelect}
          className={cx(
            'relative inline-flex items-center gap-1.5 rounded-pill',
            'focus-visible:outline focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring',
            // sm-button-style invisible hit-area pad — the visible chip
            // (~28px tall) is short of the 44px touch minimum (§5); see
            // Button.tsx's TEXT_HIT_PAD for the identical `before:`
            // pseudo-element approach.
            "before:absolute before:content-[''] before:-inset-y-2 before:inset-x-0",
          )}
        >
          {selected && <Icon name="check" size="sm" decorative />}
          {children}
        </button>
      ) : (
        children
      )}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cx(
            'relative ml-1.5 mr-1.5 inline-flex shrink-0 items-center justify-center rounded-round',
            'transition-colors duration-micro ease-standard hover:text-on-surface',
            'focus-visible:outline focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring',
            // The close glyph itself is tiny; its hit area is padded out to
            // the 44px minimum via an invisible `::before`, same technique
            // as Button's icon-only `sm` size (§5 "targets ≥44px").
            "before:absolute before:content-[''] before:-inset-3",
          )}
        >
          <Icon name="close" size="sm" decorative />
        </button>
      )}
    </span>
  );
}
