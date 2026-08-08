'use client';

/**
 * The hero — Scene 01, "The Spark".
 *
 * Replaces the four-slide MP4 carousel that used to hold this slot. That
 * carousel was 71 MB of video on the page whose first non-negotiable is "speed
 * is trust", it advanced on a 10-second timer (Cinematic Direction §10.2 bans
 * timed reveals in the main flow outright), and the performance spec says of
 * hero video, twice: "avoid on the hero", "never the LCP".
 *
 * ## What the visitor sees
 *
 * The camera stands outside the room at eye height, looking through the
 * opening, and travels in — the doorway dolly of Scene 01 — rising to an
 * establishing pose over 3.4 seconds. It then holds, breathing, with dust
 * drifting in the key light. Three hotspots mark the three claims the studio
 * makes about the room.
 *
 * The entry move is authored on the `hero` station's pose in
 * `lib/journey/stations.ts` rather than here, so there is still exactly one
 * camera owner. See `JourneyCamera` for why it only ever plays on the first
 * station of a fresh load.
 *
 * ## What is NOT here, deliberately
 *
 * No headline, no CTA, no trust points, no analytics. All of that is DOM in
 * `components/sections/Hero.tsx`, server-rendered, and present whether or not
 * this file ever loads. The LCP element is the poster image underneath; this
 * scene is an enhancement layered over content that already works.
 *
 * Scene 01's screenplay also calls for the logo dimensionalising into the room
 * — the swoosh unrolling to the Axis, wall-lines extruding, the sofa settling.
 * That is not built. `lib/brand/mark.ts` explains why: the interior line-art of
 * the monogram exists only as pixels in a JPEG, and tracing a raster back into
 * paths would produce approximated brand artwork. The room assembles by camera
 * movement instead of by construction, which is a weaker version of the idea
 * and should be revisited when the master is exported as SVG.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import type { SceneId, SceneModule } from '../registry';
import { LightingRig } from '../core/lighting';
import { DustInLight } from '../core/particles';
import { PerformanceMonitor } from '../core/PerformanceMonitor';
import { useHotspot } from '../core/interaction';
import { useMaterials } from '../rooms/RoomShell';
import { Slab } from '../rooms/primitives';
import {
  LIVING_ROOM_ANCHORS,
  LIVING_ROOM_DIMENSIONS,
  LivingRoomFurniture,
} from '../rooms/LivingRoomScene';
import { useAppStore } from '@/lib/store';
import { ATMOSPHERE } from '../core/palette';

const SHELL_MATERIALS = [
  'oakFloor',
  'plasterDeep',
  'plasterWarm',
  'signalGold',
  'signalTeal',
  'brushedGold',
] as const;

/**
 * One interactive marker.
 *
 * The mesh is a pointer affordance for a DOM button that already exists,
 * already works, and is already reachable by keyboard — `useHotspot` dispatches
 * the click to it rather than running its own handler, so there is exactly one
 * code path for "this hotspot was activated" and no possibility of the two
 * drifting. If the button is missing, the hook warns in development and the
 * mesh does nothing, which is the correct failure: the DOM is authoritative.
 */
function Hotspot({
  position,
  controlId,
  material,
  activeMaterial,
}: {
  position: [number, number, number];
  controlId: string;
  material: import('three').Material;
  activeMaterial: import('three').Material;
}) {
  const { active, bind } = useHotspot(controlId);
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    // A slow pulse so the marker reads as live without demanding attention.
    // No `invalidate()` — it animates only during frames something else has
    // already requested, so a settled canvas still costs nothing.
    const t = state.clock.getElapsedTime();
    const scale = (active ? 1.35 : 1) + Math.sin(t * 1.6) * 0.06;
    ref.current.scale.setScalar(scale);
  });

  return (
    <mesh
      ref={ref}
      position={position}
      material={active ? activeMaterial : material}
      {...bind}
    >
      <sphereGeometry args={[0.075, 16, 16]} />
    </mesh>
  );
}

function HeroRoomContent() {
  const m = useMaterials(SHELL_MATERIALS);
  const reducedMotion = useAppStore((state) => state.reducedMotion);
  const breathRef = useRef<Group>(null);

  const { width, depth, height } = LIVING_ROOM_DIMENSIONS;

  useFrame((state) => {
    if (reducedMotion || !breathRef.current) return;
    // The ≤6% ambient breath of §2, applied to the room rather than the camera
    // so it cannot desynchronise from the journey's own camera transitions.
    const t = state.clock.getElapsedTime();
    breathRef.current.rotation.y = Math.sin(t * 0.14) * 0.009;
    breathRef.current.position.y = Math.sin(t * 0.2) * 0.012;
  });

  // Mutable tuple, not `as const`: R3F's `args` prop types are mutable, and a
  // readonly tuple is not assignable to them.
  const fog = useMemo<[string, number, number]>(
    () => [ATMOSPHERE.fogColor, 8, 30],
    [],
  );

  return (
    <group>
      <PerformanceMonitor />
      <LightingRig mood="domesticWarm" />
      <fog attach="fog" args={fog} />

      <group ref={breathRef}>
        {/* Architecture. Not `RoomShell`'s, because the hero needs a fourth
            wall with an opening in it — the thing the camera travels through —
            and the shell deliberately models only three. */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          material={m.oakFloor}
          receiveShadow
        >
          <planeGeometry args={[width, depth + 8]} />
        </mesh>
        <mesh position={[0, height / 2, -depth / 2]} material={m.plasterDeep}>
          <planeGeometry args={[width, height]} />
        </mesh>
        <mesh
          position={[-width / 2, height / 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          material={m.plasterDeep}
        >
          <planeGeometry args={[depth, height]} />
        </mesh>
        <mesh
          position={[width / 2, height / 2, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          material={m.plasterDeep}
        >
          <planeGeometry args={[depth, height]} />
        </mesh>

        {/* The threshold the camera passes through: a wall with a 1.6m opening,
            built as three slabs rather than a subtracted volume. CSG would cost
            a geometry operation at runtime for a silhouette the camera clears
            in the first second. */}
        <group position={[0, 0, depth / 2 + 2.6]}>
          <Slab
            size={[(width - 1.6) / 2, height, 0.24]}
            position={[-(width + 1.6) / 4, height / 2, 0]}
            material={m.plasterWarm}
            castShadow={false}
          />
          <Slab
            size={[(width - 1.6) / 2, height, 0.24]}
            position={[(width + 1.6) / 4, height / 2, 0]}
            material={m.plasterWarm}
            castShadow={false}
          />
          <Slab
            size={[1.6, height - 2.25, 0.24]}
            position={[0, height - (height - 2.25) / 2, 0]}
            material={m.plasterWarm}
            castShadow={false}
          />
          {/* A gold reveal lining the opening — the brand's line, doing
              architectural work rather than being applied as decoration. */}
          <Slab
            size={[1.66, 0.03, 0.26]}
            position={[0, 2.25, 0]}
            material={m.brushedGold}
            castShadow={false}
          />
        </group>

        <LivingRoomFurniture />

        {/* Dust in the key-light shaft. Rung one of the degradation ladder and
            T3-only, so most visitors never see it and nothing depends on it. */}
        <DustInLight
          position={[1.6, 1.9, 0.4]}
          size={[2.6, 4.0, 2.6]}
          count={40}
        />

        <Hotspot
          position={LIVING_ROOM_ANCHORS.materials}
          controlId="hero-hotspot-materials"
          material={m.signalGold}
          activeMaterial={m.signalTeal}
        />
        <Hotspot
          position={LIVING_ROOM_ANCHORS.lighting}
          controlId="hero-hotspot-lighting"
          material={m.signalGold}
          activeMaterial={m.signalTeal}
        />
        <Hotspot
          position={LIVING_ROOM_ANCHORS.axis}
          controlId="hero-hotspot-axis"
          material={m.signalGold}
          activeMaterial={m.signalTeal}
        />
      </group>
    </group>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'hero') return null;
  return <HeroRoomContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  // The hero is allowed the largest budget in the registry (the performance
  // spec grants it 2.5 MB against 1.5 MB for everything else), but this scene
  // is procedural and ships nothing but code.
  budgetKB: 165,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
