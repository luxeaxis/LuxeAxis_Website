'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Progress } from '@/components/Progress';

/**
 * BrandLoader (Build Backlog T-24) — the mark draws on while something heavy
 * loads, with a determinate percentage and a way out if it never arrives.
 *
 * ## What this must never be used for
 *
 * **It must not gate the static HTML.** Every page on this site is prerendered
 * and ships 94–108 kB of first-load JS; the content is in the document before
 * any of this code runs. Wrapping a page in a loader would mean holding
 * finished, painted markup behind an animation — and the spec's own
 * `MIN_DISPLAY_MS` guard, which exists so a loader that does appear does not
 * flash, would become a mandatory 600 ms delay added to a page that had none.
 * That is slower for every visitor and worse for LCP, in exchange for a
 * brand moment nobody asked for.
 *
 * The guard is right for what a loader is actually for here: the 3D scene layer
 * (T-25/T-27), which loads a WebGL bundle and assets on demand, behind a flag,
 * after the page is already readable and usable. There the wait is real, so
 * showing progress is honest and the anti-flash guard earns its keep.
 *
 * ## The min-display guard
 *
 * A loader that appears for 80 ms and vanishes reads as a glitch rather than as
 * feedback. So once shown, it stays for `MIN_DISPLAY_MS` even if the work
 * finishes sooner. The guard only ever *extends* a loader that is already
 * visible — it never delays a load that completed before the first paint, which
 * is the version of this idea that makes sites slower.
 */

/** Once visible, stay visible this long. Anti-flash, not an artificial delay. */
export const MIN_DISPLAY_MS = 600;

/** Past this, stop claiming it is still coming and offer a way out. */
export const TIMEOUT_MS = 15_000;

export type LoaderPhase = 'loading' | 'timed-out';

/**
 * Decides whether the loader should still be on screen.
 *
 * Split out from the component because the interesting behaviour is entirely
 * temporal and this is what makes it testable without a DOM: given "the work
 * finished at 100 ms", does it stay up until 600?
 */
export function useMinimumDisplay(done: boolean, minMs: number = MIN_DISPLAY_MS): boolean {
  // Not state: the loader is on screen from the first render, and reading the
  // clock in a ref avoids a re-render that would do nothing but record a
  // timestamp.
  const shownAt = useRef<number | null>(null);
  if (shownAt.current === null) shownAt.current = Date.now();

  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!done) {
      setHeld(false);
      return;
    }
    const elapsed = Date.now() - shownAt.current!;
    if (elapsed >= minMs) {
      setHeld(false);
      return;
    }
    // Finished early. Hold the rest of the window out, then release.
    setHeld(true);
    const timer = setTimeout(() => setHeld(false), minMs - elapsed);
    return () => clearTimeout(timer);
  }, [done, minMs]);

  return !done || held;
}

export function BrandLoader({
  /** 0–100. Real progress — this is a determinate bar, so a fake ramp would be
   *  the one dishonest thing a loading state can do. */
  value,
  done = false,
  label = 'Loading the scene',
  onRetry,
  className,
}: {
  value: number;
  done?: boolean;
  label?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const visible = useMinimumDisplay(done);
  const [phase, setPhase] = useState<LoaderPhase>('loading');

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => setPhase('timed-out'), TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [done]);

  if (!visible) return null;

  return (
    <div
      // `aria-busy` on the region that is loading, and `polite` so the timeout
      // message is announced when it replaces the progress bar rather than
      // interrupting whatever the visitor is reading — the page around this is
      // already complete and readable.
      aria-busy={phase === 'loading'}
      aria-live="polite"
      className={`flex h-full w-full flex-col items-center justify-center gap-5 p-6 ${className ?? ''}`}
    >
      <Logo
        // Decorative here: the progress bar below already carries the accessible
        // name, and announcing "Luxe Axis" as well would say the brand twice to
        // a screen reader for one loading state.
        // The draw timing lives in the stylesheet, on the
        // `--duration-signature` token — §6 puts the draw at ≤1200ms and that
        // token is already 1200ms. Passing it as an inline style would put a
        // duration literal back into a component, which the token rule exists
        // to prevent.
        className="lx-draw-on h-icon-lg w-auto text-accent"
      />

      {phase === 'loading' ? (
        <Progress value={value} label={label} className="max-w-xs" />
      ) : (
        <div className="flex max-w-measure flex-col items-center gap-3 text-center">
          <p className="text-small text-on-surface-2">
            This is taking longer than it should. The rest of the page works
            normally — only the visual is missing.
          </p>
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
