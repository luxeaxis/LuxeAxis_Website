'use client';

/**
 * Bedroom — the calmest room in the set.
 *
 * Route home: `/residential/bedroom`.
 *
 * ## Restraint is the design here
 *
 * Fewer objects, lower camera, slower moves, and the dimmest rig the
 * `domesticWarm` mood allows. Every other room is arguing; this one is
 * demonstrating. The temptation with a bedroom is to fill it — the reason not
 * to is that the product being sold is calm, and a crowded frame cannot show
 * calm no matter how good the individual pieces are.
 *
 * The camera also sits lower here (1.15m rather than the 1.3–1.75m used
 * elsewhere) — nearer seated eye height, which is how the room is actually
 * occupied.
 */

import { useMemo } from 'react';
import type { SceneId, SceneModule } from '../registry';
import { RoomShell, useMaterials, type RoomConfig } from './RoomShell';
import { shot } from '../core/camera';
import { ArtFrame, AxisPillar, Legs, Post, Rug, Slab } from './primitives';

const MATERIALS = [
  'oakFloor',
  'plasterDeep',
  'plasterWarm',
  'linenClay',
  'velvetEmerald',
  'walnut',
  'polishedGold',
  'brushedGold',
  'signalGold',
] as const;

const DIMENSIONS = { width: 6.4, depth: 6.2, height: 3.0 };

function BedroomContent() {
  const m = useMaterials(MATERIALS);

  const config = useMemo<RoomConfig>(
    () => ({
      dimensions: DIMENSIONS,
      mood: 'domesticWarm',
      floor: 'oakFloor',
      walls: 'plasterDeep',
      shots: [
        shot.pullBack(0, [0, 2.1, 6.0], [0, 1.0, -1.0], 44),
        // A crane down rather than a descent — the vertical reveal suits a
        // room whose defining object is low and horizontal.
        shot.crane(0.45, [0.6, 1.45, 3.8], [0, 0.75, -1.4], 41),
        shot.pushIn(0.78, [0.3, 1.15, 2.4], [-0.2, 0.68, -1.8], 36),
        shot.settle(1, [0.3, 1.12, 2.3], [-0.2, 0.66, -1.8], 38),
      ],
    }),
    [],
  );

  const mattressH = 0.56;

  return (
    <RoomShell config={config}>
      <AxisPillar
        position={[-2.6, 0, -2.9]}
        height={DIMENSIONS.height}
        material={m.polishedGold}
      />

      <Rug size={[4.6, 3.4]} position={[0, 0, -0.6]} material={m.linenClay} />

      {/* Upholstered headboard, wall-mounted and wider than the bed — the
          gesture that makes a bed read as designed rather than delivered. */}
      <Slab
        size={[2.6, 1.15, 0.12]}
        position={[0, 1.0, -2.92]}
        material={m.velvetEmerald}
      />

      {/* Bed: base, mattress, and a folded throw at the foot. */}
      <group position={[0, 0, -1.9]}>
        <Slab
          size={[2.0, 0.28, 2.1]}
          position={[0, 0.14, 0]}
          material={m.walnut}
        />
        <Slab
          size={[1.94, 0.28, 2.04]}
          position={[0, mattressH - 0.14, 0]}
          material={m.linenClay}
        />
        {/* Pillows. */}
        <Slab
          size={[0.82, 0.16, 0.42]}
          position={[-0.46, mattressH + 0.08, -0.72]}
          material={m.plasterWarm}
        />
        <Slab
          size={[0.82, 0.16, 0.42]}
          position={[0.46, mattressH + 0.08, -0.72]}
          material={m.plasterWarm}
        />
        {/* Throw across the foot. */}
        <Slab
          size={[1.94, 0.06, 0.6]}
          position={[0, mattressH + 0.03, 0.68]}
          material={m.velvetEmerald}
        />
      </group>

      {/* Matched bedside tables. */}
      {[-1.45, 1.45].map((x) => (
        <group key={x} position={[x, 0, -2.4]}>
          <Slab
            size={[0.5, 0.4, 0.42]}
            position={[0, 0.5, 0]}
            material={m.walnut}
          />
          <Legs
            footprint={[0.5, 0.42]}
            height={0.3}
            radius={0.015}
            material={m.brushedGold}
          />
          {/* A slim reading light — geometry only; the rig owns all real light. */}
          <Post
            radius={0.008}
            height={0.42}
            position={[0.14, 0.91, -0.1]}
            material={m.brushedGold}
          />
          <mesh position={[0.14, 1.12, -0.1]} material={m.signalGold}>
            <sphereGeometry args={[0.05, 12, 12]} />
          </mesh>
        </group>
      ))}

      {/* A bench at the foot of the bed. */}
      <group position={[0, 0, -0.55]}>
        <Slab
          size={[1.6, 0.16, 0.44]}
          position={[0, 0.44, 0]}
          material={m.linenClay}
        />
        <Legs
          footprint={[1.6, 0.44]}
          height={0.36}
          radius={0.018}
          material={m.brushedGold}
        />
      </group>

      {/* A single work, centred over the headboard. One, not a pair — the
          living room has the pair, and repeating it here would flatten the two
          rooms into the same room. */}
      <ArtFrame
        size={[1.3, 0.9]}
        position={[0, 2.15, -3.05]}
        frame={m.brushedGold}
        face={m.plasterWarm}
      />
    </RoomShell>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'bedroom') return null;
  return <BedroomContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 130,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
