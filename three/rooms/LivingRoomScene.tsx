'use client';

/**
 * Living Room — the residential flagship.
 *
 * Route home: `/residential/living-room`.
 *
 * ## The shot
 *
 * A wide establishing pull-back, a push-in onto the seating group, then a
 * settle. That order is the argument the page is making: here is a whole
 * room, here is the part you will actually live in, now decide. The settle is
 * mandatory before the page's CTA — the spec requires decisions be made from
 * stillness.
 *
 * ## Furniture is exported separately
 *
 * `LivingRoomFurniture` carries the room's contents with no shell, camera or
 * lighting of its own, so `three/scenes/HeroRoomScene.tsx` can furnish the
 * identical room under a different film. Two living rooms that were meant to
 * match and slowly stopped matching is exactly the drift this avoids — and the
 * hero is the one place a visitor will compare them, because it is where they
 * arrive before clicking through.
 */

import { useMemo } from 'react';
import type { SceneId, SceneModule } from '../registry';
import { RoomShell, useMaterials, type RoomConfig } from './RoomShell';
import { shot } from '../core/camera';
import {
  ArtFrame,
  AxisPillar,
  Legs,
  Pendant,
  Rug,
  Seat,
  Slab,
  Table,
} from './primitives';

export const LIVING_ROOM_MATERIALS = [
  'oakFloor',
  'plasterDeep',
  'plasterWarm',
  'velvetEmerald',
  'linenClay',
  'walnut',
  'polishedGold',
  'brushedGold',
  'marbleWhite',
  'signalGold',
] as const;

export const LIVING_ROOM_DIMENSIONS = { width: 8, depth: 7, height: 3.1 };

/**
 * Where the hotspots sit, in world space.
 *
 * Exported because the hero scene places interactive markers at exactly these
 * points and the DOM copy describes exactly these objects. A hotspot floating
 * next to nothing is the failure mode; keeping the coordinates beside the
 * furniture that justifies them is what prevents it.
 */
export const LIVING_ROOM_ANCHORS = {
  /** The marble coffee table — the materials claim. */
  materials: [0, 0.5, -0.5] as [number, number, number],
  /** The pendant over the table — the lighting claim. */
  lighting: [0, 1.95, -0.5] as [number, number, number],
  /** The gold Axis against the back wall — the Vastu claim. */
  axis: [-2.9, 1.5, -3.2] as [number, number, number],
};

export function LivingRoomFurniture() {
  const m = useMaterials(LIVING_ROOM_MATERIALS);
  const height = LIVING_ROOM_DIMENSIONS.height;

  return (
    <group>
      {/* The Axis, against the back wall, off-centre so it reads as a
          deliberate architectural line rather than as a symmetry axis. */}
      <AxisPillar
        position={[-2.9, 0, -3.2]}
        height={height}
        material={m.polishedGold}
      />

      <Rug size={[4.4, 3.2]} position={[0, 0, -0.4]} material={m.linenClay} />

      {/* Three-seat sofa against the back wall. */}
      <Seat
        width={2.9}
        depth={0.98}
        position={[0, 0, -2.1]}
        body={m.velvetEmerald}
        cushion={m.linenClay}
      />

      {/* A pair of armchairs, turned inward — the arrangement is what makes a
          seating group read as a conversation rather than as a showroom. */}
      <Seat
        width={0.95}
        depth={0.9}
        position={[-2.4, 0, 0.5]}
        rotation={[0, Math.PI / 3.4, 0]}
        body={m.walnut}
        cushion={m.linenClay}
      />
      <Seat
        width={0.95}
        depth={0.9}
        position={[2.4, 0, 0.5]}
        rotation={[0, -Math.PI / 3.4, 0]}
        body={m.walnut}
        cushion={m.linenClay}
      />

      {/* Marble coffee table on a slim gold frame. */}
      <Table
        size={[1.5, 0.38, 0.8]}
        position={[0, 0, -0.5]}
        top={m.marbleWhite}
        frame={m.polishedGold}
      />

      {/* A low console under the art wall. */}
      <group position={[0, 0, 3.0]}>
        <Slab
          size={[2.2, 0.5, 0.42]}
          position={[0, 0.42, 0]}
          material={m.walnut}
        />
        <Legs footprint={[2.2, 0.42]} height={0.17} material={m.brushedGold} />
      </group>

      {/* Art, hung as a pair on the back wall at 1.55m centre — gallery height,
          which is the detail that stops an interior render looking arbitrary. */}
      <ArtFrame
        size={[1.0, 1.35]}
        position={[-0.75, 1.62, -3.46]}
        frame={m.brushedGold}
        face={m.plasterWarm}
      />
      <ArtFrame
        size={[1.0, 1.35]}
        position={[0.75, 1.62, -3.46]}
        frame={m.brushedGold}
        face={m.linenClay}
      />

      {/* A single pendant over the coffee table. */}
      <Pendant
        position={[0, height, -0.5]}
        dropTo={1.85}
        shade={m.brushedGold}
        stem={m.brushedGold}
        glow={m.signalGold}
        radius={0.2}
      />
    </group>
  );
}

function LivingRoomContent() {
  const config = useMemo<RoomConfig>(
    () => ({
      dimensions: LIVING_ROOM_DIMENSIONS,
      mood: 'domesticWarm',
      floor: 'oakFloor',
      walls: 'plasterDeep',
      shots: [
        // Wide, high, taking in the whole volume.
        shot.pullBack(0, [0, 2.6, 7.4], [0, 1.1, -0.6], 45),
        // Down and forward, onto the seating group.
        shot.descent(0.42, [0.4, 1.75, 4.6], [0, 0.85, -0.8], 41),
        // The sofa fills the frame; the lens tightens.
        shot.pushIn(0.72, [0.2, 1.35, 3.1], [-0.1, 0.72, -1.2], 36),
        // Dead rest.
        shot.settle(1, [0.2, 1.3, 2.9], [-0.1, 0.7, -1.2], 38),
      ],
    }),
    [],
  );

  return (
    <RoomShell config={config}>
      <LivingRoomFurniture />
    </RoomShell>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'living-room') return null;
  return <LivingRoomContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 140,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
