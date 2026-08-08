import type { ElementType, ReactNode } from 'react';

/**
 * Layout primitives. Six of them, deliberately — every page composes from these
 * rather than inventing ad-hoc flex/grid CSS, which is what keeps spacing
 * rhythm consistent without anyone policing it.
 *
 * Gaps are a closed set mapped to space tokens rather than an open `number`,
 * because Tailwind cannot resolve a class name built at runtime — `gap-${n}`
 * silently produces no CSS. A union type turns that failure into a compile
 * error instead of invisible zero spacing.
 */

export type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const GAP: Record<Space, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  7: 'gap-7',
  8: 'gap-8',
  9: 'gap-9',
  10: 'gap-10',
};

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

type BaseProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

/** Vertical rhythm. The workhorse — most page sections are a Stack. */
export function Stack({
  children,
  className,
  as: Tag = 'div',
  gap = 4,
}: BaseProps & { gap?: Space }) {
  return (
    <Tag className={cx('flex flex-col', GAP[gap], className)}>{children}</Tag>
  );
}

/** Horizontal grouping that wraps rather than overflowing — nav items, chips,
 *  button rows. Wrapping is the default because a row that cannot wrap is a
 *  horizontal-scroll bug waiting for a longer translation. */
export function Cluster({
  children,
  className,
  as: Tag = 'div',
  gap = 3,
  align = 'center',
}: BaseProps & {
  gap?: Space;
  align?: 'start' | 'center' | 'end' | 'baseline';
}) {
  const alignment = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
  }[align];
  return (
    <Tag className={cx('flex flex-wrap', alignment, GAP[gap], className)}>
      {children}
    </Tag>
  );
}

/** Responsive columns. `cols` is the desktop count; it steps down to 1 on
 *  mobile and (for 3+) an intermediate count at md, so callers never write
 *  breakpoint logic for the common case. */
export function Grid({
  children,
  className,
  as: Tag = 'div',
  cols = 3,
  gap = 5,
}: BaseProps & { cols?: 1 | 2 | 3 | 4; gap?: Space }) {
  const columns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols];
  return (
    <Tag className={cx('grid', columns, GAP[gap], className)}>{children}</Tag>
  );
}

/** Max content width with the fluid gutter. The gutter is `clamp(16px, 5vw,
 *  96px)`, so margins breathe on large screens without a media query. */
export function Container({ children, className, as: Tag = 'div' }: BaseProps) {
  return (
    <Tag className={cx('mx-auto w-full max-w-container px-gutter', className)}>
      {children}
    </Tag>
  );
}

/** Full-viewport-width section whose inner content stays in the measure.
 *  Reserves the full-bleed tracks the 3D scenes will later occupy, so adding
 *  a scene never reflows the page around it. */
export function Bleed({ children, className, as: Tag = 'section' }: BaseProps) {
  return (
    <Tag className={cx('relative w-full', className)}>
      <Container>{children}</Container>
    </Tag>
  );
}

/** Constrains to a readable line length (68ch). Prose that runs the full
 *  container width is the single most common readability failure. */
export function Center({ children, className, as: Tag = 'div' }: BaseProps) {
  return (
    <Tag className={cx('mx-auto w-full max-w-measure', className)}>
      {children}
    </Tag>
  );
}
