'use client';

/**
 * The camera system — the seven moves from `LuxeAxis_Cinematic_Direction.md` §2,
 * as one rig driven by scroll.
 *
 * ## This is the consumer that was missing
 *
 * `components/SmoothScroll.tsx` has been publishing `scrollProgress` to the
 * store since the foundations commit, and its own doc comment says it does so
 * "for the camera rig (T-26) to consume". Nothing consumed it. This file is
 * T-26. Until it existed, the 3D layer had no connection to scroll at all —
 * `SceneSlot`'s IntersectionObserver switched scenes on and off at a 0.3
 * threshold, which is a slide projector, not the scrubbed film the spec
 * describes.
 *
 * ## Two rules are enforced structurally, not by convention
 *
 * **No roll.** The spec bans horizon tilt outright (nausea risk). Rather than
 * trusting every shot author to leave `rotation.z` alone, the rig only ever
 * poses the camera through `lookAt` with a fixed world up of (0,1,0), which
 * cannot produce roll. There is no code path here that can tilt the horizon.
 *
 * **FOV stays architectural.** Clamped to 35–45° on write. A wider lens is the
 * single fastest way to make an interior read as a games console rather than a
 * building, so the clamp is applied to the value, not left to the shot table.
 *
 * ## Damping, and why `demand` needs care
 *
 * The canvas runs `frameloop="demand"`, so `useFrame` only executes on a
 * requested frame. A damped camera therefore has to keep asking for frames
 * until it has settled, or it freezes mid-move the instant scrolling stops —
 * which looks exactly like a bug. `invalidate()` is called while the pose is
 * still converging and then deliberately stops, which is what keeps an idle
 * canvas at zero cost.
 *
 * Damping uses `MathUtils.damp` (framerate-independent) rather than a fixed
 * lerp factor. That matters because T2 devices are allowed to run at 30fps: a
 * per-frame lerp would make the camera move at half speed on exactly the
 * devices that can least afford a longer transition.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { useAppStore } from '@/lib/store';
import type { JourneyMove, Vec3 } from '@/lib/journey/types';

export type { Vec3 };

/**
 * The seven moves. Each is a named easing + FOV behaviour, not a position —
 * positions live in the shot table so the same move can serve any scene.
 *
 * Defined canonically in `lib/journey/types.ts` and re-exported here. It has to
 * live there because the journey's station data names these moves and is read
 * by `components/`, which the ESLint seam forbids from importing anything under
 * `three/` — including types. One list, two consumers, no drift.
 */
export type CameraMove = JourneyMove;

/**
 * Per-move damping constants, in units of "how fast the camera catches up".
 *
 * Higher is snappier. `settle` is the slowest on purpose — the spec requires
 * deceleration to a dead rest before every call to action, "so decisions are
 * made from stillness, not motion". `orbit` is the fastest because it is
 * user-dragged and any lag there reads as input latency rather than as weight.
 */
const DAMPING: Record<CameraMove, number> = {
  descent: 2.2,
  pushIn: 2.8,
  pullBack: 2.4,
  orbit: 9,
  rackFocus: 3.2,
  crane: 2.0,
  settle: 1.2,
};

export type Shot = {
  /** Normalised scene progress at which the camera should be in this pose. */
  at: number;
  move: CameraMove;
  position: Vec3;
  /** What the camera looks at. Never a rotation — see the no-roll note above. */
  target: Vec3;
  /** Clamped to 35–45 on write. */
  fov?: number;
};

const FOV_MIN = 35;
const FOV_MAX = 45;

/** Cubic in-out. The spec's `--ease-spatial`, expressed numerically so the
 *  camera and the DOM motion tokens agree on what "spatial" feels like. */
function easeSpatial(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Find the two shots bracketing `progress` and blend between them.
 *
 * The blend is eased by the *incoming* shot's move, which is what makes a
 * `settle` feel like a settle: the easing belongs to the arrival, not the
 * departure.
 */
function resolvePose(shots: Shot[], progress: number) {
  if (shots.length === 0) return null;
  if (shots.length === 1 || progress <= shots[0]!.at) {
    const only = shots[0]!;
    return {
      position: only.position,
      target: only.target,
      fov: only.fov ?? 40,
      move: only.move,
    };
  }

  const last = shots[shots.length - 1]!;
  if (progress >= last.at) {
    return {
      position: last.position,
      target: last.target,
      fov: last.fov ?? 40,
      move: last.move,
    };
  }

  let index = 0;
  for (let i = 0; i < shots.length - 1; i += 1) {
    if (progress >= shots[i]!.at && progress <= shots[i + 1]!.at) {
      index = i;
      break;
    }
  }

  const from = shots[index]!;
  const to = shots[index + 1]!;
  const span = to.at - from.at;
  const local =
    span <= 0 ? 1 : easeSpatial(clamp01((progress - from.at) / span));

  const blend = (a: Vec3, b: Vec3): Vec3 => [
    MathUtils.lerp(a[0], b[0], local),
    MathUtils.lerp(a[1], b[1], local),
    MathUtils.lerp(a[2], b[2], local),
  ];

  return {
    position: blend(from.position, to.position),
    target: blend(from.target, to.target),
    fov: MathUtils.lerp(from.fov ?? 40, to.fov ?? 40, local),
    move: to.move,
  };
}

/**
 * Pointer parallax — the camera *target* drifts up to 3°, never the body.
 *
 * Moving the target rather than the position is what keeps this from becoming
 * a second camera move fighting the director's. Disabled entirely on coarse
 * pointers, where there is no hover state to respond to and the only effect
 * would be the camera lurching on every tap.
 */
function usePointerParallax(enabled: boolean) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  return pointer;
}

/** Maximum parallax deflection in world units at the target plane — tuned to
 *  land inside the spec's ≤3° allowance at the rig's working distances. */
const PARALLAX_UNITS = 0.18;

export function CameraSystem({
  shots,
  /** Overrides the global scroll progress. Room scenes that own a pinned stage
   *  pass their own normalised value; everything else rides the page. */
  progress,
  parallax = true,
  /** Additive orbit yaw in radians, supplied by the interaction manager when a
   *  scene has opted into drag-to-orbit. Applied around the camera target so
   *  the subject stays framed however far the visitor swings. */
  orbitYaw = 0,
}: {
  shots: Shot[];
  progress?: number;
  parallax?: boolean;
  orbitYaw?: number;
}) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const invalidate = useThree((state) => state.invalidate);
  const storeProgress = useAppStore((state) => state.scrollProgress);
  const value = progress ?? storeProgress;

  const pointer = usePointerParallax(parallax);

  // Scratch vectors, allocated once. Allocating a Vector3 inside useFrame is
  // three allocations per frame per axis — at 60fps that is the kind of
  // garbage-collection pressure that shows up as periodic frame drops rather
  // than as a low average.
  const desiredPosition = useRef(new Vector3());
  const desiredTarget = useRef(new Vector3());
  const currentTarget = useRef(new Vector3());
  const settled = useRef(false);

  const shotList = useMemo(
    () => [...shots].sort((a, b) => a.at - b.at),
    [shots],
  );

  // Any change in the driving value means the pose is stale, so ask for frames
  // again. Without this the camera simply would not move: `demand` renders
  // nothing until something requests it.
  useEffect(() => {
    settled.current = false;
    invalidate();
  }, [value, orbitYaw, invalidate]);

  useFrame((_, delta) => {
    const pose = resolvePose(shotList, clamp01(value));
    if (!pose) return;

    const damping = DAMPING[pose.move];

    desiredPosition.current.set(
      pose.position[0],
      pose.position[1],
      pose.position[2],
    );
    desiredTarget.current.set(pose.target[0], pose.target[1], pose.target[2]);

    // Orbit rotates the camera around the target on the world Y axis. Y-only,
    // so the horizon cannot tip however hard the visitor drags.
    if (orbitYaw !== 0) {
      desiredPosition.current.sub(desiredTarget.current);
      desiredPosition.current.applyAxisAngle(new Vector3(0, 1, 0), orbitYaw);
      desiredPosition.current.add(desiredTarget.current);
    }

    if (parallax) {
      desiredTarget.current.x += pointer.current.x * PARALLAX_UNITS;
      desiredTarget.current.y -= pointer.current.y * PARALLAX_UNITS;
    }

    const before = camera.position.distanceToSquared(desiredPosition.current);

    camera.position.x = MathUtils.damp(
      camera.position.x,
      desiredPosition.current.x,
      damping,
      delta,
    );
    camera.position.y = MathUtils.damp(
      camera.position.y,
      desiredPosition.current.y,
      damping,
      delta,
    );
    camera.position.z = MathUtils.damp(
      camera.position.z,
      desiredPosition.current.z,
      damping,
      delta,
    );

    currentTarget.current.x = MathUtils.damp(
      currentTarget.current.x,
      desiredTarget.current.x,
      damping,
      delta,
    );
    currentTarget.current.y = MathUtils.damp(
      currentTarget.current.y,
      desiredTarget.current.y,
      damping,
      delta,
    );
    currentTarget.current.z = MathUtils.damp(
      currentTarget.current.z,
      desiredTarget.current.z,
      damping,
      delta,
    );

    // The only place the camera's orientation is ever written, and it goes
    // through lookAt with the default (0,1,0) up — which is what makes roll
    // structurally impossible rather than merely discouraged.
    camera.lookAt(currentTarget.current);

    const nextFov = MathUtils.clamp(pose.fov, FOV_MIN, FOV_MAX);
    if (Math.abs(camera.fov - nextFov) > 0.01) {
      camera.fov = MathUtils.damp(camera.fov, nextFov, damping, delta);
      camera.updateProjectionMatrix();
    }

    // Keep requesting frames until the pose has converged, then stop. The
    // threshold is squared distance, so 1e-6 is a millimetre at this scale.
    const after = camera.position.distanceToSquared(desiredPosition.current);
    const converged = after < 1e-6 && Math.abs(after - before) < 1e-9;
    if (!converged) {
      settled.current = false;
      invalidate();
    } else {
      settled.current = true;
    }
  });

  return null;
}

/**
 * Shot-list helpers.
 *
 * Named constructors rather than raw object literals, so a scene reads as a
 * sequence of moves ("descend, then push in, then settle") and the vocabulary
 * stays the seven the spec defines. A scene that wants an eighth move has to
 * come here and add it, which is the point.
 */
export const shot = {
  descent: (at: number, position: Vec3, target: Vec3, fov = 42): Shot => ({
    at,
    move: 'descent',
    position,
    target,
    fov,
  }),
  pushIn: (at: number, position: Vec3, target: Vec3, fov = 35): Shot => ({
    at,
    move: 'pushIn',
    position,
    target,
    fov,
  }),
  pullBack: (at: number, position: Vec3, target: Vec3, fov = 45): Shot => ({
    at,
    move: 'pullBack',
    position,
    target,
    fov,
  }),
  orbit: (at: number, position: Vec3, target: Vec3, fov = 40): Shot => ({
    at,
    move: 'orbit',
    position,
    target,
    fov,
  }),
  rackFocus: (at: number, position: Vec3, target: Vec3, fov = 40): Shot => ({
    at,
    move: 'rackFocus',
    position,
    target,
    fov,
  }),
  crane: (at: number, position: Vec3, target: Vec3, fov = 42): Shot => ({
    at,
    move: 'crane',
    position,
    target,
    fov,
  }),
  settle: (at: number, position: Vec3, target: Vec3, fov = 38): Shot => ({
    at,
    move: 'settle',
    position,
    target,
    fov,
  }),
};
