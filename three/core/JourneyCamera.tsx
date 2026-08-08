'use client';

/**
 * The cinematic camera for the guided journey.
 *
 * ## The whole design in one sentence
 *
 * It reads `station` from the store and moves the camera to that station's
 * pose. It never writes `station`, never listens to input, and never scrolls
 * anything.
 *
 * That one-way dependency is what makes the journey accessible rather than
 * merely accessible-ish. Navigation is the cause; camera movement is the
 * effect. Delete this file and the site is a normal anchored page with a
 * working table of contents — nothing structural is lost, no fallback path has
 * to be written, and no "3D mode" has to be exited. The fallback is not a mode;
 * it is what remains when the effect is removed from the cause.
 *
 * ## Why this is not `CameraSystem`
 *
 * `three/core/camera.tsx` drives a camera from a CONTINUOUS progress value
 * scrubbed by scroll — right for a single scene whose timeline the visitor
 * scrubs. A journey is DISCRETE: nine named poses, and a transition between
 * whichever two are involved in the move the visitor just made. Blending nine
 * poses by document scroll position would tie composition to section height,
 * so a tall section would linger and a short one would flash past.
 *
 * The two share their damping vocabulary and their two structural rules — no
 * roll, FOV clamped 35–45 — and nothing else.
 *
 * ## Transitions
 *
 * A station change starts a transition with its own clock rather than snapping
 * the target and letting the damper chase it. That is what makes a jump from
 * station 1 to station 9 (a rail click, not a scroll) take the same authored
 * time as a step from 1 to 2, instead of tearing across the scene at a speed
 * proportional to the distance. Cinematic means authored duration.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { useAppStore } from '@/lib/store';
import { stationById } from '@/lib/journey/stations';
import type { JourneyMove, Station } from '@/lib/journey/types';

const FOV_MIN = 35;
const FOV_MAX = 45;

/**
 * Transition duration per arriving move, in seconds.
 *
 * `settle` is the longest because §2 requires deceleration to a dead rest
 * before a call to action. `pushIn` is the shortest because a push-in that
 * lingers stops reading as emphasis and starts reading as a slow zoom, which is
 * on the vestibular-hazard list.
 */
const DURATION: Record<JourneyMove, number> = {
  descent: 1.5,
  pushIn: 1.1,
  pullBack: 1.35,
  orbit: 0.9,
  rackFocus: 1.2,
  crane: 1.7,
  settle: 2.0,
};

/** Cubic in-out — the spec's `--ease-spatial`, matching `camera.tsx`. */
function easeSpatial(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function JourneyCamera({
  stations,
  /** Pointer parallax, ≤3°, off on coarse pointers. */
  parallax = true,
}: {
  stations: readonly Station[];
  parallax?: boolean;
}) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const invalidate = useThree((state) => state.invalidate);

  const stationId = useAppStore((state) => state.station);
  const direction = useAppStore((state) => state.stationDirection);
  const reducedMotion = useAppStore((state) => state.reducedMotion);

  const station = useMemo(
    () => stationById(stations, stationId),
    [stations, stationId],
  );

  // The transition: where we came from, where we are going, and how far along.
  const fromPosition = useRef(new Vector3());
  const fromTarget = useRef(new Vector3());
  const fromFov = useRef(40);
  const toPosition = useRef(new Vector3());
  const toTarget = useRef(new Vector3());
  const toFov = useRef(40);
  const elapsed = useRef(Number.POSITIVE_INFINITY);
  const duration = useRef(1);

  const currentTarget = useRef(new Vector3());
  const pointer = useRef({ x: 0, y: 0 });
  const initialised = useRef(false);

  useEffect(() => {
    if (!parallax) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [parallax, invalidate]);

  // Begin a transition whenever the station changes.
  useEffect(() => {
    if (!station) return;

    const pose = station.pose;

    if (!initialised.current) {
      initialised.current = true;

      // An authored opening move, but only where it is actually an arrival:
      // the first station of the journey, on a fresh load, with motion allowed.
      //
      // Everywhere else the camera composes immediately. A deep link to
      // `/#pricing` must not fly in past six stations the visitor never asked
      // to see, and an entry animation on a mid-journey station would replay
      // its opening every time the visitor scrolled back to it.
      const isFirstStation = stations[0]?.id === station.id;
      const canEnter =
        isFirstStation && !reducedMotion && pose.entryFrom !== undefined;

      if (canEnter) {
        fromPosition.current.set(...pose.entryFrom!);
        fromTarget.current.set(...(pose.entryTarget ?? pose.target));
        fromFov.current = MathUtils.clamp(pose.fov, FOV_MIN, FOV_MAX);

        toPosition.current.set(...pose.position);
        toTarget.current.set(...pose.target);
        toFov.current = MathUtils.clamp(pose.fov, FOV_MIN, FOV_MAX);

        camera.position.copy(fromPosition.current);
        currentTarget.current.copy(fromTarget.current);
        camera.fov = fromFov.current;
        camera.updateProjectionMatrix();
        camera.lookAt(currentTarget.current);

        duration.current = pose.entryDuration ?? 3;
        elapsed.current = 0;
        invalidate();
        return;
      }

      camera.position.set(...pose.position);
      currentTarget.current.set(...pose.target);
      camera.fov = MathUtils.clamp(pose.fov, FOV_MIN, FOV_MAX);
      camera.updateProjectionMatrix();
      camera.lookAt(currentTarget.current);
      elapsed.current = Number.POSITIVE_INFINITY;
      invalidate();
      return;
    }

    fromPosition.current.copy(camera.position);
    fromTarget.current.copy(currentTarget.current);
    fromFov.current = camera.fov;

    toPosition.current.set(...pose.position);
    toTarget.current.set(...pose.target);
    toFov.current = MathUtils.clamp(pose.fov, FOV_MIN, FOV_MAX);

    // Travelling backwards is slightly quicker. Retracing ground the visitor
    // has already seen at the same pace as the first pass feels sluggish —
    // this is the camera equivalent of a back button being faster than a
    // forward navigation.
    const base = DURATION[pose.move];
    duration.current = direction === 'back' ? base * 0.75 : base;

    elapsed.current = 0;
    invalidate();
  }, [station, stations, direction, reducedMotion, camera, invalidate]);

  /**
   * Reduced motion is handled here, not by unmounting.
   *
   * `three/stage.tsx` already refuses to mount the canvas at all when reduced
   * motion is set, so in practice this branch is belt-and-braces for a visitor
   * who changes the OS setting mid-session — `useDeviceTier` listens for that
   * and updates the store live. When it flips, the camera stops interpolating
   * and cuts straight to each station. The journey still works; it simply has
   * no motion between stops, which is exactly what the setting asks for.
   */
  useFrame((_, delta) => {
    if (!station) return;

    if (reducedMotion) {
      camera.position.set(...station.pose.position);
      currentTarget.current.set(...station.pose.target);
      camera.fov = MathUtils.clamp(station.pose.fov, FOV_MIN, FOV_MAX);
      camera.updateProjectionMatrix();
      camera.lookAt(currentTarget.current);
      return;
    }

    const running = elapsed.current < duration.current;

    if (running) {
      elapsed.current += delta;
      const t = easeSpatial(Math.min(1, elapsed.current / duration.current));

      camera.position.lerpVectors(fromPosition.current, toPosition.current, t);
      currentTarget.current.lerpVectors(
        fromTarget.current,
        toTarget.current,
        t,
      );

      const nextFov = MathUtils.lerp(fromFov.current, toFov.current, t);
      if (Math.abs(camera.fov - nextFov) > 0.001) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }

    // Parallax is applied to the TARGET, never the body, and always — including
    // after the transition has finished, which is what keeps a settled station
    // feeling alive without the camera drifting off its composition.
    const lookAt = currentTarget.current;
    if (parallax) {
      lookAt.x += pointer.current.x * 0.16;
      lookAt.y -= pointer.current.y * 0.16;
    }

    // The only write to camera orientation, through lookAt with the default
    // (0,1,0) up. Roll is structurally impossible; there is no code path here
    // that can tilt the horizon.
    camera.lookAt(lookAt);

    if (parallax) {
      lookAt.x -= pointer.current.x * 0.16;
      lookAt.y += pointer.current.y * 0.16;
    }

    // Keep asking for frames only while the transition runs. `frameloop` is
    // "demand", so a settled camera costs nothing until the next navigation.
    if (running) invalidate();
  });

  return null;
}
