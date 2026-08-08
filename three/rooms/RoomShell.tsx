'use client';

/**
 * The shared room scaffold.
 *
 * Every room scene is `RoomShell` + furniture. The shell owns everything the
 * five rooms have in common — architecture, lighting, camera, material
 * lifecycle, the Suspense boundary, and the GLB upgrade path — so a room file
 * contains only what makes that room *that room*.
 *
 * ## Why the rooms are procedural today
 *
 * The repo contains no `.glb`. Rather than ship five empty scenes waiting for
 * an asset pipeline, each room composes real furniture from the primitives in
 * `./primitives.tsx`, using the shared material library. That renders something
 * defensible now and — because the shell already carries an `asset` slot — is
 * replaced by a single line in a room's config the moment an optimised GLB
 * exists. No scene file changes when the geometry gets real.
 *
 * This is the honest state of things and should not be mistaken for the
 * finished article: procedural furniture reads as *architecturally correct*,
 * not as photographic. Judging whether it clears the "premium" bar is a
 * decision to make against the rendered result, not against this file.
 *
 * ## Scale contract
 *
 * 1 world unit = 1 metre, everywhere, in every room. Cameras, fog distances,
 * lighting falloff and GLB imports all assume it. A room authored at a
 * different scale will light and fog incorrectly in ways that are tedious to
 * diagnose, so the shell takes real metric dimensions and derives the rest.
 */

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';
import { CameraSystem, type Shot } from '../core/camera';
import { LightingRig, type LightingMood } from '../core/lighting';
import {
  acquireMaterial,
  releaseMaterial,
  type MaterialId,
} from '../core/materials';
import { readAsset, retain, release } from '../core/assets';
import { useSceneTier } from '../core/tier';
import { ATMOSPHERE } from '../core/palette';
import { useAppStore } from '@/lib/store';

export type RoomDimensions = {
  /** Metres, X axis. */
  width: number;
  /** Metres, Z axis. */
  depth: number;
  /** Metres, Y axis. */
  height: number;
};

export type RoomConfig = {
  dimensions: RoomDimensions;
  mood: LightingMood;
  floor: MaterialId;
  walls: MaterialId;
  ceiling?: MaterialId;
  shots: Shot[];
  /**
   * Optional path to an optimised GLB. When present and it loads within
   * budget, it renders *instead of* the room's procedural children — the
   * upgrade path, in one field.
   */
  asset?: string;
};

/**
 * Acquire shared materials for the lifetime of a component.
 *
 * The paired release on unmount is the whole point: it is what lets the
 * director dispose scenes two back without leaking, and what makes it safe for
 * two rooms to hold the same gold during a cross-fade.
 */
export function useMaterials<T extends readonly MaterialId[]>(
  ids: T,
): Record<T[number], ReturnType<typeof acquireMaterial>> {
  // `ids` is expected to be a module-level constant array. Joining it as the
  // dependency key keeps this stable even if a caller passes a fresh literal,
  // which is the mistake that would otherwise thrash the GPU every render.
  const key = ids.join('|');

  const materials = useMemo(() => {
    const map = {} as Record<T[number], ReturnType<typeof acquireMaterial>>;
    for (const id of ids) map[id as T[number]] = acquireMaterial(id);
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    return () => {
      for (const id of ids) releaseMaterial(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return materials;
}

/** Suspense-reading GLB hook, with the retain/release pairing handled. */
function useRoomAsset(url: string | undefined) {
  const tier = useSceneTier();
  const asset = url ? readAsset(url, tier) : null;

  useEffect(() => {
    if (!url) return;
    retain(url);
    return () => release(url);
  }, [url]);

  return asset;
}

function LoadedRoom({ url }: { url: string }) {
  const asset = useRoomAsset(url);
  if (!asset) return null;
  return <primitive object={asset.scene} />;
}

/**
 * Floor, walls and ceiling, derived from the room's metric dimensions.
 *
 * Three walls, not four — the fourth is where the camera is. Modelling it
 * would only ever be seen from behind, costs draw calls, and would block every
 * shot in the room's shot list.
 */
function Architecture({
  dimensions,
  floor,
  walls,
  ceiling,
  castShadows,
}: {
  dimensions: RoomDimensions;
  floor: MaterialId;
  walls: MaterialId;
  ceiling?: MaterialId;
  castShadows: boolean;
}) {
  const ids = useMemo(
    () =>
      ceiling ? ([floor, walls, ceiling] as const) : ([floor, walls] as const),
    [floor, walls, ceiling],
  );
  const materials = useMaterials(ids);

  const { width, depth, height } = dimensions;
  const halfW = width / 2;
  const halfD = depth / 2;

  return (
    <group>
      {/* Floor. The only shadow receiver in the room — contact shadows on the
          floor carry almost all of the perceived grounding, and receiving on
          the walls as well doubles the cost for a fraction of the read. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow={castShadows}
        material={materials[floor]}
      >
        <planeGeometry args={[width, depth]} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -halfD]} material={materials[walls]}>
        <planeGeometry args={[width, height]} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-halfW, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={materials[walls]}
      >
        <planeGeometry args={[depth, height]} />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[halfW, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        material={materials[walls]}
      >
        <planeGeometry args={[depth, height]} />
      </mesh>

      {ceiling && (
        <mesh
          position={[0, height, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={materials[ceiling]}
        >
          <planeGeometry args={[width, depth]} />
        </mesh>
      )}
    </group>
  );
}

/**
 * The ambient "breath".
 *
 * §2 of the Cinematic Direction doc allows the camera a ≤6% idle drift so a
 * stopped scene does not look frozen. It is applied to the room rather than
 * the camera deliberately — moving the camera would fight the shot list and
 * the damping in `CameraSystem`, whereas a sub-degree rotation of the subject
 * reads identically and cannot desynchronise the two.
 *
 * Skipped entirely under reduced motion, and it does not call `invalidate()`
 * — so on an idle canvas the breath costs nothing at all. It animates only
 * while something else is already requesting frames.
 */
function useBreath(enabled: boolean) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!enabled || !ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.16) * 0.012;
    ref.current.position.y = Math.sin(t * 0.22) * 0.015;
  });

  return ref;
}

export function RoomShell({
  config,
  progress,
  breathe = true,
  children,
}: {
  config: RoomConfig;
  progress?: number;
  breathe?: boolean;
  children?: React.ReactNode;
}) {
  const tier = useSceneTier();
  const gl = useThree((state) => state.gl);
  const breathRef = useBreath(breathe);

  useEffect(() => {
    gl.setClearColor(ATMOSPHERE.clear, 0);
  }, [gl]);

  const castShadows = tier === 'T3';

  // Exactly one camera owner at a time. On a journey page `JourneyCamera` is
  // mounted by the canvas and drives the camera from the current station; a
  // scene-local `CameraSystem` running alongside it would write the same camera
  // every frame and the two would fight, producing a jitter that is very hard
  // to attribute back to its cause. The same store value decides both, so they
  // can never both believe they are in charge.
  const onJourney = useAppStore((state) => state.station) !== null;

  return (
    <group>
      <LightingRig mood={config.mood} />
      {!onJourney && <CameraSystem shots={config.shots} progress={progress} />}

      <group ref={breathRef}>
        <Architecture
          dimensions={config.dimensions}
          floor={config.floor}
          walls={config.walls}
          ceiling={config.ceiling}
          castShadows={castShadows}
        />

        {/* The GLB, when one exists, replaces the procedural furniture rather
            than adding to it. `null` from the Suspense fallback means the room
            renders architecture-only for the frames the asset is decoding,
            which is the correct partial state — the walls are already the
            right walls. */}
        {config.asset ? (
          <Suspense fallback={null}>
            <LoadedRoom url={config.asset} />
          </Suspense>
        ) : (
          children
        )}
      </group>
    </group>
  );
}
