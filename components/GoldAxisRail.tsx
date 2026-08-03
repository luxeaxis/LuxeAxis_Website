'use client';

import { useAppStore } from '@/lib/store';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * The Gold Axis Rail (Build Backlog T-23, Spec §3.3).
 *
 * A luxury visual axis line running along the viewport margin. The gold bead
 * tracks active scroll progress down the page. Hidden on touch/mobile and
 * hidden when reduced motion is requested.
 */
export function GoldAxisRail() {
  const scrollProgress = useAppStore((state) => state.scrollProgress);
  const storeReducedMotion = useAppStore((state) => state.reducedMotion);
  const osReducedMotion = useReducedMotion();

  if (storeReducedMotion || osReducedMotion) {
    return null;
  }

  const beadTopPercentage = `${Math.min(100, Math.max(0, scrollProgress * 100))}%`;

  return (
    <div
      aria-hidden="true"
      aria-label="Gold Axis scroll progress"
      className="pointer-events-none fixed right-6 top-1/4 bottom-1/4 z-header hidden w-px bg-border-subtle/40 md:block"
    >
      {/* Background track line */}
      <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-accent/30 to-transparent" />

      {/* Gold Bead tracking scroll progress */}
      <div
        className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent bg-surface-deep shadow-[0_0_12px_rgba(201,168,76,0.6)] transition-transform duration-75 ease-out"
        style={{ top: beadTopPercentage }}
      >
        <div className="h-full w-full rounded-full bg-accent opacity-80" />
      </div>
    </div>
  );
}
