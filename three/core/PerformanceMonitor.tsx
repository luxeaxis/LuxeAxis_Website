'use client';

/**
 * Frame-rate monitoring and automatic degradation.
 *
 * The performance spec names this component ("`PerformanceMonitor`", §1 and
 * §3) and sets the contract: 60fps on T3, a **30fps hard floor** before
 * auto-downgrade. Until now nothing measured anything — the tier was resolved
 * once from `navigator` hints and never revisited, so a device that passed the
 * cheap checks and then thermally throttled had no way back down.
 *
 * ## The trap: `frameloop="demand"` makes naive FPS measurement wrong
 *
 * The canvas only renders when something calls `invalidate()`. So the interval
 * between two `useFrame` callbacks is NOT the frame time — most of the time it
 * is the gap between one navigation and the next, which can be minutes.
 * Averaging those deltas would read as roughly 0fps on a perfectly healthy
 * machine and degrade a desktop to poster quality while it sat idle.
 *
 * The fix is to measure only CONTINUOUS runs. A frame counts as part of a run
 * if it arrived within `MAX_CONTINUOUS_MS` of the previous one; anything longer
 * is an idle gap and resets the window. This means the monitor only forms an
 * opinion while the scene is actually animating — which is precisely when the
 * frame rate matters and the only time degrading it would help.
 *
 * ## Why degradation is easy and recovery is hard
 *
 * Falling a rung needs `DEGRADE_WINDOWS` consecutive bad windows. Climbing back
 * needs `RECOVER_WINDOWS` consecutive good ones — six times as many — and a
 * rung that has been lost twice is never offered again for the rest of the
 * session.
 *
 * Without that asymmetry the monitor oscillates: it degrades, the scene gets
 * cheaper, the frame rate recovers *because* it degraded, it climbs back, and
 * the cycle repeats. Particles blinking in and out every few seconds is far
 * more noticeable and more irritating than particles that are simply absent.
 */

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  degrade,
  getQualityStep,
  recover,
  Step,
  type QualityStep,
} from './quality';
import { useSceneTier } from './tier';

/** Frames further apart than this are an idle gap, not a slow frame. */
const MAX_CONTINUOUS_MS = 100;

/** Frames per measurement window. ~1s of continuous animation at 60fps. */
const WINDOW_FRAMES = 60;

/** Below this, the window is bad. The spec's hard floor. */
const FLOOR_FPS = 30;

/**
 * Above this, the window is good enough to count toward recovery. Deliberately
 * well above the floor rather than just over it, so recovery is only offered to
 * a device with real headroom — climbing back at 32fps would immediately
 * degrade again.
 */
const RECOVER_FPS = 55;

const DEGRADE_WINDOWS = 2;
const RECOVER_WINDOWS = 12;

export function PerformanceMonitor({
  /** Reports every completed window. For the Playwright performance suite and
   *  local diagnostics; not used in production paths. */
  onSample,
}: {
  onSample?: (fps: number, step: QualityStep) => void;
} = {}) {
  const tier = useSceneTier();

  const lastTime = useRef(0);
  const frames = useRef(0);
  const accumulated = useRef(0);
  const badWindows = useRef(0);
  const goodWindows = useRef(0);
  /** How many times each rung has been fallen from. Two strikes and it is
   *  never climbed back to — a rung we keep losing is not one this device can
   *  hold, and repeatedly proving that costs the visitor frames each time. */
  const strikes = useRef<Map<QualityStep, number>>(new Map());

  useEffect(() => {
    // A tier change (the OS reduced-motion setting flipping, say) invalidates
    // everything measured so far.
    lastTime.current = 0;
    frames.current = 0;
    accumulated.current = 0;
    badWindows.current = 0;
    goodWindows.current = 0;
  }, [tier]);

  useFrame(() => {
    const now = performance.now();

    if (lastTime.current === 0) {
      lastTime.current = now;
      return;
    }

    const delta = now - lastTime.current;
    lastTime.current = now;

    if (delta > MAX_CONTINUOUS_MS) {
      // Idle gap. Discard the partial window rather than let a pause pollute it.
      frames.current = 0;
      accumulated.current = 0;
      return;
    }

    frames.current += 1;
    accumulated.current += delta;

    if (frames.current < WINDOW_FRAMES) return;

    const fps = 1000 / (accumulated.current / frames.current);
    frames.current = 0;
    accumulated.current = 0;

    const step = getQualityStep();
    onSample?.(fps, step);

    if (fps < FLOOR_FPS) {
      goodWindows.current = 0;
      badWindows.current += 1;

      if (badWindows.current >= DEGRADE_WINDOWS) {
        badWindows.current = 0;
        const from = getQualityStep();
        const next = degrade();
        if (next !== from) {
          strikes.current.set(from, (strikes.current.get(from) ?? 0) + 1);
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `[perf] ${fps.toFixed(0)}fps sustained below the ${FLOOR_FPS}fps floor — degrading ${from} → ${next}.`,
            );
          }
        }
      }
      return;
    }

    if (fps >= RECOVER_FPS) {
      badWindows.current = 0;
      goodWindows.current += 1;

      if (goodWindows.current >= RECOVER_WINDOWS) {
        goodWindows.current = 0;
        const target = (getQualityStep() - 1) as QualityStep;
        if (target >= Step.Full && (strikes.current.get(target) ?? 0) < 2) {
          recover();
        }
      }
      return;
    }

    // Between the floor and the recovery threshold: coping, but without the
    // headroom to be given anything back. Hold this rung and reset both
    // counters so a long mediocre stretch drifts in neither direction.
    badWindows.current = 0;
    goodWindows.current = 0;
  });

  return null;
}
