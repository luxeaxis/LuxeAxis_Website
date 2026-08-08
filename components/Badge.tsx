/**
 * Badge — status/tier/filter label (design system §3.5). A Server Component:
 * a badge is just styled text (+ an optional icon); nothing here reads
 * state or takes a handler, unlike its dismissible sibling `Chip`
 * (components/Chip.tsx), which needs `"use client"` for its close button.
 *
 * `tone` covers both the four status tones (success/warning/error/info,
 * shared with InlineAlert/Toast via `lib/status.ts`) and two non-status
 * tones (`neutral`/`accent`) for tier/filter labels that aren't reporting a
 * state at all — those two don't get an automatic icon, because the badge's
 * own text already carries the meaning (e.g. TierCard's "Recommended" label,
 * components/Card.tsx) rather than standing in for a colour-coded status.
 * The four status tones DO get an automatic icon (§5 "never colour-only" —
 * the same rule Field's error/success rows already enforce), pulled from
 * the same `STATUS_ICON` map InlineAlert and Toast use, so a status badge
 * can never silently ship as colour-only even if a caller forgets `icon`.
 */

import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { STATUS_ICON, STATUS_TEXT_CLASS, type StatusTone } from '@/lib/status';

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(' ');

export type BadgeTone = StatusTone | 'neutral' | 'accent';

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: 'border-border-subtle text-on-surface-2',
  accent: 'border-accent text-accent',
  success: cx('border-success', STATUS_TEXT_CLASS.success),
  warning: cx('border-warning', STATUS_TEXT_CLASS.warning),
  error: cx('border-error', STATUS_TEXT_CLASS.error),
  info: cx('border-info', STATUS_TEXT_CLASS.info),
};

function isStatusTone(tone: BadgeTone): tone is StatusTone {
  return (
    tone === 'success' ||
    tone === 'warning' ||
    tone === 'error' ||
    tone === 'info'
  );
}

export type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
  /** Overrides the automatic status icon; has no effect for `neutral`/
   *  `accent` tones, which have no automatic icon to override. */
  icon?: IconName;
  className?: string;
};

export function Badge({
  tone = 'neutral',
  children,
  icon,
  className,
}: BadgeProps) {
  const resolvedIcon =
    icon ?? (isStatusTone(tone) ? STATUS_ICON[tone] : undefined);

  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-pill border-hairline px-3 py-1',
        'font-ui text-overline uppercase tracking-[var(--font-tracking-wide)]',
        TONE_CLASS[tone],
        className,
      )}
    >
      {resolvedIcon && <Icon name={resolvedIcon} size="sm" decorative />}
      {children}
    </span>
  );
}
