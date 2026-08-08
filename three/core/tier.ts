'use client';

/**
 * Tier, as the WebGL layer sees it.
 *
 * `lib/tier/resolve.ts` decides the tier from cheap navigator signals before
 * anything renders, and `three/stage.tsx` refuses to mount below T2. So by the
 * time any code under `three/core/` runs, the tier is always 'T2' or 'T3' —
 * this hook narrows the store's four-value type to the two that can actually
 * reach here, so rigs and materials can switch on a total union instead of
 * carrying dead branches for T0 and T1.
 *
 * The fallback is 'T2', not 'T3'. Same reason `lib/store.ts` starts at T1: the
 * pessimistic answer is the safe one, because guessing high means shipping
 * shadows and transmission to a phone that cannot draw them at 30fps, and the
 * visitor's first impression is a stutter.
 */

import { useAppStore } from '@/lib/store';

export type SceneTier = 'T2' | 'T3';

export function useSceneTier(): SceneTier {
  const tier = useAppStore((state) => state.tier);
  return tier === 'T3' ? 'T3' : 'T2';
}

/**
 * Per-tier rendering allowances, in one table.
 *
 * Kept here rather than scattered through the rigs so that "what does T2
 * actually turn off?" has a single readable answer, and so the runtime
 * downgrade path (`PerformanceMonitor` dropping T3 to T2 mid-session) changes
 * one value and everything downstream follows.
 */
export const TIER_BUDGET: Record<
  SceneTier,
  {
    /** Upper devicePixelRatio clamp. The single biggest thermal lever there is. */
    maxDpr: number;
    /** Shadow maps at all. */
    shadows: boolean;
    /** Bloom and other postprocessing passes. */
    postprocessing: boolean;
    /** `transmission` on glass — costs an extra scene render per glass object. */
    transmission: boolean;
    /** Ceiling the asset loader enforces before it will decode a GLB. */
    maxSceneBytes: number;
  }
> = {
  T2: {
    maxDpr: 1.5,
    shadows: false,
    postprocessing: false,
    transmission: false,
    maxSceneBytes: 1_500_000,
  },
  T3: {
    maxDpr: 2,
    shadows: true,
    postprocessing: true,
    transmission: true,
    maxSceneBytes: 2_500_000,
  },
};
