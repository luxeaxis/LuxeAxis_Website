/**
 * Shared status-tone mapping for the feedback/status component set (design
 * system §3.5) — Badge, InlineAlert and Toast all pair the same four
 * semantic tones with the same icon and the same "never colour-only" rule.
 * Centralised here so the pairing is asserted once instead of drifting
 * across three components (see `error`/`success`/`warning`/`info` in
 * tokens/modes/*.json for the token side of this same promotion).
 */

import type { IconName } from '@/components/Icon';

export type StatusTone = 'success' | 'warning' | 'error' | 'info';

export const STATUS_ICON: Record<StatusTone, IconName> = {
  success: 'check',
  warning: 'alert-triangle',
  error: 'alert-circle',
  info: 'info',
};

// Tailwind text-colour utility per tone — `text-error`/`text-success` were
// already wired (tailwind.config.ts); `text-warning`/`text-info` are new
// alongside the token promotion above.
export const STATUS_TEXT_CLASS: Record<StatusTone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
};

export const STATUS_BORDER_CLASS: Record<StatusTone, string> = {
  success: 'border-success',
  warning: 'border-warning',
  error: 'border-error',
  info: 'border-info',
};

// role="alert" (assertive) is reserved for genuine errors — every other
// tone is role="status" (polite). Neither is ever the *only* channel for
// critical information (brief, "Announcement semantics are the whole point
// of this set"). Widened to accept `'neutral'` (not part of `StatusTone`)
// because Toast has a fifth, tone-less variant InlineAlert/Badge don't —
// a neutral toast is still exactly as "not an error" as a success/info one.
export function ariaRoleFor(tone: StatusTone | 'neutral'): 'alert' | 'status' {
  return tone === 'error' ? 'alert' : 'status';
}
