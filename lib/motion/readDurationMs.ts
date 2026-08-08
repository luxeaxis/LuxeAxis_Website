/**
 * Reads a `duration.*` token's resolved millisecond value off the root
 * element at runtime, instead of duplicating the bare number in a JS timer.
 * The token pipeline only ever emits CSS custom properties
 * (styles/tokens.css), never a JS-importable constant, so this is the
 * bridge for the few places a duration token has to drive a `setTimeout`
 * rather than a CSS `transition-duration` class.
 *
 * Mirrors `components/StatCounter.tsx`'s private `readDurationMs` (same
 * body, same reasoning) — duplicated rather than refactoring that already-
 * shipped, already-tested component to import this, which is out of scope
 * for the feedback/status/loading set this file was added for. Tooltip is
 * the current consumer (§3.5: "240ms open delay, 0 close").
 */
export function readDurationMs(varName: string, fallbackMs: number): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallbackMs;
}
