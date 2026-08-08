'use client';

/**
 * Office — the commercial workplace vertical.
 *
 * Route home: `/commercial/[vertical]` (workplace).
 *
 * ## A different room type, not a bigger living room
 *
 * Commercial interiors are sold on repetition, circulation and daylight, not
 * on individual pieces. So this room is built from a repeated workstation bay
 * rather than from placed furniture, it is lit `commercialDay` (cool, even,
 * from a glazed line), and the camera pulls back rather than pushing in — the
 * buying decision here is "will my team fit and will it feel good", which is a
 * question about the whole floor.
 *
 * The glazed partition is the one place `glassClear` earns its transmission
 * cost, and it is dropped to a cheap alpha blend below T3 by
 * `applyQualityTier`.
 */

import { useMemo } from 'react';
import type { SceneId, SceneModule } from '../registry';
import { RoomShell, useMaterials, type RoomConfig } from './RoomShell';
import { shot } from '../core/camera';
import { AxisPillar, Legs, Seat, Slab } from './primitives';

const MATERIALS = [
  'stoneFloor',
  'plasterWarm',
  'plasterDeep',
  'walnut',
  'linenClay',
  'blackenedSteel',
  'brushedGold',
  'polishedGold',
  'glassClear',
  'lacquerEmerald',
] as const;

const DIMENSIONS = { width: 11, depth: 8, height: 3.4 };

/** One workstation: desk, screen plane, and a chair. Repeated along the bay. */
function Workstation({
  position,
  top,
  frame,
  screen,
  seatBody,
  seatCushion,
}: {
  position: [number, number, number];
  top: import('three').Material;
  frame: import('three').Material;
  screen: import('three').Material;
  seatBody: import('three').Material;
  seatCushion: import('three').Material;
}) {
  return (
    <group position={position}>
      <Slab size={[1.5, 0.04, 0.75]} position={[0, 0.74, 0]} material={top} />
      <Legs
        footprint={[1.5, 0.75]}
        height={0.72}
        radius={0.02}
        material={frame}
      />
      {/* Monitor: a thin plane on a stem. Reads correctly at every distance
          the shot list uses, at four triangles. */}
      <Slab
        size={[0.04, 0.12, 0.18]}
        position={[0, 0.82, -0.28]}
        material={frame}
      />
      <Slab
        size={[0.62, 0.36, 0.02]}
        position={[0, 1.06, -0.28]}
        material={screen}
      />
      <Seat
        width={0.5}
        depth={0.5}
        position={[0, 0, 0.72]}
        rotation={[0, Math.PI, 0]}
        body={seatBody}
        cushion={seatCushion}
        arms={false}
      />
    </group>
  );
}

function OfficeContent() {
  const m = useMaterials(MATERIALS);

  const config = useMemo<RoomConfig>(
    () => ({
      dimensions: DIMENSIONS,
      mood: 'commercialDay',
      floor: 'stoneFloor',
      walls: 'plasterWarm',
      ceiling: 'plasterDeep',
      shots: [
        // Start close on one workstation — the individual experience.
        shot.pushIn(0, [-1.4, 1.35, 2.2], [-1.8, 0.95, 0.4], 38),
        // Retreat to reveal the bay: the same desk, six times.
        shot.pullBack(0.48, [0, 2.4, 6.2], [0, 1.2, -0.8], 45),
        // Higher still, taking in the glazed meeting room and circulation.
        shot.crane(0.8, [1.6, 3.3, 8.4], [0, 1.3, -1.6], 45),
        shot.settle(1, [1.6, 3.25, 8.2], [0, 1.3, -1.6], 43),
      ],
    }),
    [],
  );

  const bay = useMemo(() => [-3.6, -1.8, 0, 1.8, 3.6], []);

  return (
    <RoomShell config={config}>
      <AxisPillar
        position={[-4.8, 0, -3.6]}
        height={DIMENSIONS.height}
        material={m.polishedGold}
      />

      {/* Two rows of workstations, back to back across a shared spine. */}
      {bay.map((x) => (
        <Workstation
          key={`front-${x}`}
          position={[x, 0, 0.9]}
          top={m.walnut}
          frame={m.blackenedSteel}
          screen={m.blackenedSteel}
          seatBody={m.lacquerEmerald}
          seatCushion={m.linenClay}
        />
      ))}
      {bay.map((x) => (
        <Workstation
          key={`back-${x}`}
          position={[x, 0, -1.4]}
          top={m.walnut}
          frame={m.blackenedSteel}
          screen={m.blackenedSteel}
          seatBody={m.lacquerEmerald}
          seatCushion={m.linenClay}
        />
      ))}

      {/* Glazed meeting room in the far corner: two panes and a gold frame
          line. The transparency is what communicates "open plan but
          acoustically separated", which is the actual commercial argument. */}
      <group position={[3.4, 0, -3.0]}>
        <Slab
          size={[4.0, 2.6, 0.02]}
          position={[0, 1.3, 0]}
          material={m.glassClear}
          castShadow={false}
        />
        <Slab
          size={[0.03, 2.6, 2.0]}
          position={[-2.0, 1.3, 1.0]}
          material={m.glassClear}
          castShadow={false}
        />
        {/* Frame lines top and bottom. */}
        <Slab
          size={[4.0, 0.05, 0.05]}
          position={[0, 2.6, 0]}
          material={m.brushedGold}
        />
        <Slab
          size={[4.0, 0.05, 0.05]}
          position={[0, 0.02, 0]}
          material={m.brushedGold}
        />
      </group>

      {/* A ceiling raft over the bay — the acoustic gesture that makes an open
          plan office photograph well and is almost always what is missing when
          one does not. */}
      <Slab
        size={[9.0, 0.08, 3.2]}
        position={[0, DIMENSIONS.height - 0.28, -0.25]}
        material={m.plasterDeep}
        castShadow={false}
      />
    </RoomShell>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'office') return null;
  return <OfficeContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 150,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
