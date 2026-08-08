'use client';

/**
 * The degradation ladder.
 *
 * `LuxeAxis_Performance_A11y_QA.md` §3 and Cinematic Direction §10.3 both fix
 * the order things are dropped when a device cannot hold frame rate, and they
 * agree: **particles → bloom/DoF → parallax → resolution → static poster.**
 * That order is a design decision, not an implementation detail — it drops the
 * purely atmospheric first and the load-bearing last, so a struggling device
 * loses beauty before it loses meaning.
 *
 * This module is that ladder as a single number, plus the capability table it
 * resolves to. Keeping it in one place is what stops the ladder being
 * re-derived slightly differently in five components.
 *
 * ## Why a three/-local store rather than `lib/store.ts`
 *
 * Quality is a WebGL concern end to end: it is measured inside the render loop
 * and consumed inside the render loop. Nothing in `components/` should be able
 * to read or write it, and putting it in the app store would give the DOM side
 * an API for forcing render quality that no page has any business calling.
 * Same reasoning as the pointer-event arbitration in `interaction.tsx`.
 */

import { useSyncExternalStore } from 'react';
import type { SceneTier } from './tier';

/**
 * Rungs of the ladder. Higher means more has been taken away.
 *
 * Note that `Step.Poster` is a real destination, not a theoretical floor: a
 * device that cannot hold 30fps with everything else already off is better
 * served by the still image the poster contract guarantees than by a canvas
 * stuttering underneath it.
 */
export const Step = {
  Full: 0,
  NoParticles: 1,
  NoPostprocessing: 2,
  NoParallax: 3,
  LowResolution: 4,
  Poster: 5,
} as const;

export type QualityStep = (typeof Step)[keyof typeof Step];

export type Capabilities = {
  particles: boolean;
  postprocessing: boolean;
  parallax: boolean;
  /** Multiplier applied to the tier's own dpr ceiling. */
  resolutionScale: number;
  /** False means: stop rendering, let the poster stand alone. */
  canvas: boolean;
};

export function capabilitiesFor(
  step: QualityStep,
  tier: SceneTier,
): Capabilities {
  return {
    // A T2 device never gets particles or postprocessing regardless of how well
    // it is coping — the tier ceiling and the runtime ladder are independent
    // limits, and the lower of the two always wins.
    particles: step < Step.NoParticles && tier === 'T3',
    postprocessing: step < Step.NoPostprocessing && tier === 'T3',
    parallax: step < Step.NoParallax,
    resolutionScale: step < Step.LowResolution ? 1 : 0.7,
    canvas: step < Step.Poster,
  };
}

let step: QualityStep = Step.Full;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getQualityStep(): QualityStep {
  return step;
}

/** Read the current rung. Components re-render when it changes. */
export function useQualityStep(): QualityStep {
  return useSyncExternalStore(
    subscribe,
    () => step,
    // The server renders no canvas at all, so full quality is the only
    // coherent server snapshot; returning anything else would produce a
    // hydration mismatch on the first client render.
    () => Step.Full,
  );
}

export function useCapabilities(tier: SceneTier): Capabilities {
  return capabilitiesFor(useQualityStep(), tier);
}

/** Drop one rung. No-op at the bottom. */
export function degrade(): QualityStep {
  if (step >= Step.Poster) return step;
  step = (step + 1) as QualityStep;
  emit();
  return step;
}

/**
 * Climb one rung back.
 *
 * Recovery is deliberately harder to earn than degradation is to trigger (see
 * `PerformanceMonitor`). A device that oscillates between two rungs looks
 * broken — particles blinking in and out is far more noticeable than their
 * simply being absent — so the monitor requires a long, clean run before
 * calling this, and never climbs back to a rung it has already fallen from
 * twice.
 */
export function recover(): QualityStep {
  if (step <= Step.Full) return step;
  step = (step - 1) as QualityStep;
  emit();
  return step;
}

export function resetQuality(): void {
  step = Step.Full;
  emit();
}
