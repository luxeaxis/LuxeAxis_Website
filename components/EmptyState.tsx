/**
 * EmptyState — motif + one sentence + one action; never a dead end (design
 * system §3.5). A Server Component: static markup, `action` is a caller-
 * supplied `ReactNode` slot (same delegation as InlineAlert's `action`), so
 * nothing here needs a handler of its own.
 *
 * §3.5 specifies "Line-art motif (logo vignette icons)" — a set of brand-
 * specific illustrations, not the generic UI glyph set in Icon.tsx. Those
 * vignettes don't exist yet; they are blocked on the same unvectorised logo
 * mark the brand loader is blocked on (see the brief and Header.tsx's own
 * logo-slot comment). This renders a plain `Icon` from the existing set as
 * a stand-in motif instead — `icon` is required (not defaulted) so each
 * call site picks the glyph that actually fits its context rather than
 * inheriting an arbitrary default; it should be the first thing swapped for
 * a real vignette once that asset lands.
 */

import type { ElementType, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export type EmptyStateProps = {
  icon: IconName;
  title: string;
  body?: string;
  action?: ReactNode;
  /** The heading level for `title` — most empty states sit inside a section
   *  that already owns an `h2`, so this defaults to `h3` to keep the
   *  document outline from skipping a level (§1.3 "never skip heading
   *  levels"); pass `h2` for a standalone/full-page empty state. */
  headingAs?: Extract<ElementType, 'h2' | 'h3'>;
  className?: string;
};

export function EmptyState({ icon, title, body, action, headingAs: Heading = 'h3', className }: EmptyStateProps) {
  return (
    <div
      className={cx(
        'flex flex-col items-center gap-4 rounded-lg border border-border-subtle bg-surface-raised p-10 text-center',
        className,
      )}
    >
      <Icon name={icon} size="lg" decorative className="text-on-surface-muted" />
      <div className="flex flex-col gap-2">
        <Heading className="font-ui text-[length:var(--typography-h3-font-size)] font-semibold text-on-surface">
          {title}
        </Heading>
        {body && <p className="text-small text-on-surface-2">{body}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
