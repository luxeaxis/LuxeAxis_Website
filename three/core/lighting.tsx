'use client';

/**
 * The lighting rigs.
 *
 * ## "Light is the narrator" — and it is also the frame budget
 *
 * `LuxeAxis_Cinematic_Direction.md` §4 makes light the storytelling device.
 * The performance spec makes it the cost centre: every real-time light
 * multiplies the fragment work of every lit pixel, and every shadow-casting
 * light adds a full depth pass over the scene. The scenes under
 * `three/scenes/` currently declare up to four lights each, inline, with no
 * tier awareness — on a T2 phone that is roughly double the fragment cost the
 * 30fps floor can absorb.
 *
 * The resolution is the one the spec already prescribes in
 * `LuxeAxis_Performance_A11y_QA.md` §5: "Bake lighting/AO to maps (fewer
 * runtime lights = faster *and* richer)." So these rigs are deliberately
 * sparse — three lights, one of which is ambient fill — and they assume the
 * GLB assets arrive with baked AO in their material maps. The runtime lights
 * carry direction and mood; the baked maps carry contact and depth.
 *
 * ## Three lights, each with one job
 *
 *   key   — the narrator. Warm gold, the only shadow caster, the light the
 *           story points with.
 *   fill  — ambient, emerald-tinted, low. Stops shadowed sides going to pure
 *           black, which on an OLED phone reads as a hole in the image.
 *   rim   — cool teal from behind. Separates furniture silhouettes from the
 *           wall behind them. This is what makes a room look photographed
 *           rather than modelled, and it is the light most often missing.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { DirectionalLight } from 'three';
import { PALETTE, ATMOSPHERE } from './palette';
import { applyQualityTier } from './materials';
import { useSceneTier } from './tier';

/**
 * Named lighting moods.
 *
 * A closed set for the same reason the material list is closed: five rooms
 * lit five slightly different ways look like five different websites. The
 * mood is chosen per room, and the rig it selects is shared.
 */
export type LightingMood =
  /** Warm, low, late-afternoon. Living rooms and bedrooms. */
  | 'domesticWarm'
  /** Bright, neutral, task-lit from above. Kitchens. */
  | 'taskBright'
  /** Cool, even, daylight-through-glazing. Offices. */
  | 'commercialDay'
  /** Dramatic, high-contrast, single strong key. Receptions and set-pieces. */
  | 'galleryDramatic';

type RigSpec = {
  keyPosition: [number, number, number];
  keyIntensity: number;
  keyColor: string;
  fillIntensity: number;
  fillColor: string;
  rimPosition: [number, number, number];
  rimIntensity: number;
  rimColor: string;
};

const RIGS: Record<LightingMood, RigSpec> = {
  domesticWarm: {
    keyPosition: [4, 5.5, 3],
    keyIntensity: 2.4,
    keyColor: PALETTE.goldChampagne,
    fillIntensity: 0.45,
    fillColor: PALETTE.emeraldRaised,
    rimPosition: [-5, 3, -4],
    rimIntensity: 0.9,
    rimColor: PALETTE.teal,
  },
  taskBright: {
    keyPosition: [2, 6.5, 2],
    keyIntensity: 3.2,
    keyColor: PALETTE.clayHi,
    fillIntensity: 0.7,
    fillColor: PALETTE.clay,
    rimPosition: [-3, 2.5, -5],
    rimIntensity: 1.1,
    rimColor: PALETTE.tealBright,
  },
  commercialDay: {
    keyPosition: [6, 7, 5],
    keyIntensity: 2.8,
    keyColor: PALETTE.clayHi,
    fillIntensity: 0.6,
    fillColor: PALETTE.emeraldHi,
    rimPosition: [-6, 4, -5],
    rimIntensity: 1.0,
    rimColor: PALETTE.tealBright,
  },
  galleryDramatic: {
    keyPosition: [3, 7, 1.5],
    keyIntensity: 4.0,
    keyColor: PALETTE.gold,
    // Deliberately the lowest fill in the set. Drama is contrast, and contrast
    // is what you do NOT light.
    fillIntensity: 0.22,
    fillColor: PALETTE.emerald,
    rimPosition: [-4, 2, -6],
    rimIntensity: 1.4,
    rimColor: PALETTE.tealBright,
  },
};

/**
 * The shared three-light rig plus atmosphere.
 *
 * Mounted by `RoomShell`, so a room scene never declares a light itself. That
 * is the rule this file enforces by being the only place lights are created:
 * scenes describe *what is in the room*, the rig decides *how it is lit*.
 */
export function LightingRig({
  mood = 'domesticWarm',
  /** Scales the whole rig without changing its balance — for scenes that dim
   *  as the camera settles into a CTA, per the "Settle" camera move. */
  intensity = 1,
  fog = true,
}: {
  mood?: LightingMood;
  intensity?: number;
  fog?: boolean;
}) {
  const spec = RIGS[mood];
  const tier = useSceneTier();
  const keyRef = useRef<DirectionalLight>(null);
  const scene = useThree((state) => state.scene);

  // Shadows are T3-only and this is where that is decided, once, rather than
  // per-mesh. A directional shadow map is a full extra render pass of the
  // scene; on the mid-range phones T2 is meant to describe, it is the
  // difference between holding the 30fps floor and not.
  const castShadow = tier === 'T3';

  useEffect(() => {
    applyQualityTier(tier);
  }, [tier]);

  useEffect(() => {
    if (!fog) {
      scene.fog = null;
      return;
    }
    // Imported lazily rather than at module scope so a scene that opts out of
    // fog does not pay for the class. Fog is also load-bearing beyond mood:
    // it is what lets a room hide its far wall and its LOD swaps.
    let cancelled = false;
    void import('three').then(({ Fog }) => {
      if (cancelled) return;
      scene.fog = new Fog(
        ATMOSPHERE.fogColor,
        ATMOSPHERE.fogNear,
        ATMOSPHERE.fogFar,
      );
    });
    return () => {
      cancelled = true;
      scene.fog = null;
    };
  }, [scene, fog]);

  const shadowConfig = useMemo(
    () =>
      castShadow
        ? {
            'shadow-mapSize-width': 1024,
            'shadow-mapSize-height': 1024,
            'shadow-camera-near': 0.5,
            'shadow-camera-far': 30,
            'shadow-camera-left': -10,
            'shadow-camera-right': 10,
            'shadow-camera-top': 10,
            'shadow-camera-bottom': -10,
            // Without a bias, a large shadow camera over a flat floor produces
            // moire acne across the entire room. -0.0005 is tuned for the
            // 1024 map above; changing one means retuning the other.
            'shadow-bias': -0.0005,
          }
        : {},
    [castShadow],
  );

  return (
    <>
      <ambientLight
        intensity={spec.fillIntensity * intensity}
        color={spec.fillColor}
      />
      <directionalLight
        ref={keyRef}
        position={spec.keyPosition}
        intensity={spec.keyIntensity * intensity}
        color={spec.keyColor}
        castShadow={castShadow}
        {...shadowConfig}
      />
      <directionalLight
        position={spec.rimPosition}
        intensity={spec.rimIntensity * intensity}
        color={spec.rimColor}
      />
    </>
  );
}
