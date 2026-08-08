'use client';

/**
 * StatCounter — the animated number for proof-strip Stat cards (design
 * system §3.2/§3.7 "Value tween": "number counts to target, `ui`; visual
 * only (final value in DOM for AT)").
 *
 * The accessible value and the animated visual are two separate DOM nodes,
 * not one node whose text gets mutated in place:
 *
 * - A `sr-only` span holds the final, fully-formatted number from the very
 *   first render (server-rendered, before any client JS has run). This is
 *   what assistive tech reads — it never depends on the animation having
 *   started, run, or finished, satisfying "the final number must be in the
 *   DOM for assistive tech immediately — never only reachable after the
 *   animation finishes."
 * - An `aria-hidden` span is the sighted, purely decorative counter — it
 *   starts at the same final text and only starts ticking up from 0 once an
 *   IntersectionObserver confirms the card scrolled into view (§3.2 "Count-up
 *   on scroll-in"), runs once, and is skipped entirely under
 *   `prefers-reduced-motion: reduce`, per §2.4 and the brief's "under
 *   reduced-motion it renders the final value with no animation at all."
 *
 * Mutating a single node's `textContent` in place (the more obvious
 * approach) would leave a window — between mount and animation-complete —
 * where the only rendered value is a wrong, in-progress one; if that node is
 * also what AT reads, a screen reader arriving mid-animation announces the
 * wrong number. Two nodes make "final value immediately" true by
 * construction rather than by timing.
 */

import { useEffect, useRef, useState } from 'react';

export type StatCounterProps = {
  /** The target value the count-up lands on. */
  value: number;
  decimals?: number;
  /** e.g. "₹" */
  prefix?: string;
  /** e.g. "+", "%" */
  suffix?: string;
  className?: string;
};

function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// §2.3's "Value tween" pattern names its own duration token verbatim
// ("number counts to target, `ui`") — `duration.ui` is 240ms
// (tokens/luxe-axis.tokens.json). The token pipeline only ever emits CSS
// custom properties (styles/tokens.css), never a JS-importable constant, so
// this reads the resolved `--duration-ui` value off the root element at
// animation start instead of duplicating "240" as a bare number — if the
// token changes, the rAF loop keeps pace with it instead of silently
// drifting out of sync. `fallbackMs` only fires if the custom property is
// somehow missing or unparsable (e.g. in a test environment with no
// stylesheet loaded), so the animation degrades gracefully rather than
// breaking.
function readDurationMs(varName: string, fallbackMs: number): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallbackMs;
}

export function StatCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: StatCounterProps) {
  const finalText = `${prefix}${formatNumber(value, decimals)}${suffix}`;
  // Starts already ON the final text — correct with no JS at all (progressive
  // enhancement) and correct for the reduced-motion path, which never
  // touches this state.
  const [display, setDisplay] = useState(finalText);
  const visualRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = visualRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return; // stays at finalText — no observer, no tick.

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const durationMs = readDurationMs('--duration-ui', 240);
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min(1, (now - start) / durationMs);
          if (progress < 1) {
            setDisplay(
              `${prefix}${formatNumber(value * progress, decimals)}${suffix}`,
            );
            requestAnimationFrame(tick);
          } else {
            setDisplay(finalText); // land exactly on the formatted final text
          }
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, decimals, prefix, suffix, finalText]);

  return (
    <span className={className}>
      <span className="sr-only">{finalText}</span>
      <span ref={visualRef} aria-hidden="true">
        {display}
      </span>
    </span>
  );
}
