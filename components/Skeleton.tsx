/**
 * Skeleton — content-shaped loading placeholder (design system §3.6). A
 * Server Component: the shimmer is a pure CSS `animation` utility
 * (`animate-shimmer`, tailwind.config.ts), no JS state or timers involved.
 *
 * Two hard rules from the brief, both structural here rather than left to
 * caller discipline:
 * - "Reserve the final dimensions so it cannot cause layout shift" — `width`/
 *   `height` are real inline styles the caller supplies to match the content
 *   being replaced (the same division of responsibility as Field's `error`
 *   string: this component can't know what a "product card" or "avatar"
 *   should measure, only the caller can), defaulting to a plausible size per
 *   variant so a bare `<Skeleton />` never renders at 0×0.
 * - "Goes completely static under reduced-motion" — `motion-reduce:bg-none`
 *   strips the moving gradient's `background-image` outright (not just
 *   pausing it), leaving a flat `bg-surface-raised-2` block. Belt-and-braces
 *   with globals.css's blanket `animation-duration: 0.001ms` safety net,
 *   same reasoning as Button.tsx's `Spinner` (`motion-reduce:animate-none`
 *   alongside it) — the brief asks components not to depend on the global
 *   net alone.
 *
 * Purely decorative by default (`aria-hidden`) — a skeleton screen is
 * usually several of these at once, and having each one individually
 * announce to a screen reader would be noise, not signal. The optional
 * `label` prop wraps the whole thing in `role="status"` with one `sr-only`
 * announcement instead — same "no invented copy" rule as Field: this
 * component will not guess "Loading products…" on the caller's behalf, and
 * omitting `label` means the caller is announcing the wait some other way
 * (a heading, a page-level status region) rather than not announcing it at
 * all, which is the caller's call to make, not this component's to assume.
 */

import type { ReactNode } from 'react';

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

export type SkeletonVariant = 'text' | 'block' | 'circle';

const RADIUS: Record<SkeletonVariant, string> = {
  text: 'rounded-sm',
  block: 'rounded-md',
  circle: 'rounded-round',
};

const DEFAULT_SIZE: Record<SkeletonVariant, { width: string; height: string }> =
  {
    text: { width: '100%', height: '0.875em' },
    block: { width: '100%', height: '8rem' },
    circle: { width: '2.5rem', height: '2.5rem' },
  };

function Bone({
  width,
  height,
  variant,
  className,
}: {
  width: string;
  height: string;
  variant: SkeletonVariant;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width, height }}
      className={cx(
        'relative block shrink-0 overflow-hidden bg-surface-raised-2',
        'bg-[linear-gradient(90deg,transparent,var(--border)_50%,transparent)] bg-[length:200%_100%]',
        'animate-shimmer motion-reduce:animate-none motion-reduce:bg-none',
        RADIUS[variant],
        className,
      )}
    />
  );
}

export type SkeletonProps = {
  variant?: SkeletonVariant;
  /** CSS width (e.g. `'100%'`, `'12rem'`) — the final content's width. */
  width?: string;
  /** CSS height (e.g. `'1.5rem'`, `'220px'`) — the final content's height. */
  height?: string;
  /** `variant="text"` only: renders this many lines, the last one narrowed
   *  to 75% width so a multi-line paragraph placeholder doesn't read as a
   *  suspiciously uniform block of bars. */
  lines?: number;
  /** Optional accessible announcement — see the file comment on why this is
   *  opt-in, not automatic. */
  label?: string;
  className?: string;
};

export function Skeleton({
  variant = 'block',
  width,
  height,
  lines = 1,
  label,
  className,
}: SkeletonProps) {
  const defaults = DEFAULT_SIZE[variant];
  const w = width ?? defaults.width;
  const h = height ?? defaults.height;

  const content: ReactNode =
    variant === 'text' && lines > 1 ? (
      <span className={cx('flex flex-col gap-2', className)}>
        {/* Index as key is safe here: a static count, never reordered or
            spliced — these are placeholder lines, not identity-bearing
            data. */}
        {Array.from({ length: lines }, (_, index) => (
          <Bone
            key={index}
            variant={variant}
            width={index === lines - 1 ? '75%' : w}
            height={h}
          />
        ))}
      </span>
    ) : (
      <Bone variant={variant} width={w} height={h} className={className} />
    );

  if (!label) return content;

  return (
    <span role="status">
      <span className="sr-only">{label}</span>
      {content}
    </span>
  );
}
