'use client';

/**
 * Kitchen — the modular-kitchen and kitchen-cabinets pages.
 *
 * Route homes: `/residential/modular-kitchen`, `/residential/kitchen-cabinets`.
 *
 * ## Why this room is lit differently from every other
 *
 * `taskBright` rather than `domesticWarm`. A kitchen sold on warm evening
 * light is selling a mood; a kitchen sold on bright even light is selling the
 * thing the visitor is actually buying, which is joinery they can inspect.
 * The mood presets exist so this is a one-word decision rather than a bespoke
 * rig.
 *
 * ## The shot travels the run
 *
 * The camera tracks along the cabinet run rather than orbiting the island.
 * A run of cabinetry is a linear object and reads best from a lateral move —
 * this is the one room where the `descent` default would actively hurt.
 */

import { useMemo } from 'react';
import type { SceneId, SceneModule } from '../registry';
import { RoomShell, useMaterials, type RoomConfig } from './RoomShell';
import { shot } from '../core/camera';
import { AxisPillar, CabinetRun, Pendant, Slab } from './primitives';

const MATERIALS = [
  'stoneFloor',
  'plasterWarm',
  'lacquerEmerald',
  'marbleWhite',
  'brushedGold',
  'polishedGold',
  'blackenedSteel',
  'walnut',
  'signalGold',
] as const;

const DIMENSIONS = { width: 7.2, depth: 5.6, height: 2.9 };

function KitchenContent() {
  const m = useMaterials(MATERIALS);

  const config = useMemo<RoomConfig>(
    () => ({
      dimensions: DIMENSIONS,
      mood: 'taskBright',
      floor: 'stoneFloor',
      walls: 'plasterWarm',
      shots: [
        // Wide, square to the run.
        shot.pullBack(0, [0, 2.2, 5.6], [0, 1.2, -1.4], 44),
        // Lateral track along the tall units, still square — a rotating camera
        // here would make straight joinery look bowed.
        shot.descent(0.38, [-2.0, 1.7, 3.4], [-1.4, 1.15, -2.0], 40),
        // In on the island edge, where the stone and the reveal detail live.
        shot.pushIn(0.74, [0.9, 1.25, 1.9], [0.2, 0.95, -0.4], 35),
        shot.settle(1, [0.9, 1.22, 1.75], [0.2, 0.95, -0.4], 37),
      ],
    }),
    [],
  );

  const counterH = 0.92;
  const islandW = 2.8;
  const islandD = 1.1;

  return (
    <RoomShell config={config}>
      <AxisPillar
        position={[3.1, 0, -2.4]}
        height={DIMENSIONS.height}
        material={m.polishedGold}
      />

      {/* Base run along the back wall, with a stone worktop over it. */}
      <CabinetRun
        length={5.6}
        height={counterH}
        depth={0.62}
        position={[-0.4, 0, -2.5]}
        carcass={m.blackenedSteel}
        door={m.lacquerEmerald}
        hardware={m.brushedGold}
        doors={6}
      />
      <Slab
        size={[5.7, 0.045, 0.66]}
        position={[-0.4, counterH + 0.02, -2.5]}
        material={m.marbleWhite}
      />

      {/* Upstand — the strip of worktop material that turns up the wall. Small,
          and one of the details that separates fitted joinery from freestanding
          furniture. */}
      <Slab
        size={[5.7, 0.12, 0.02]}
        position={[-0.4, counterH + 0.08, -2.8]}
        material={m.marbleWhite}
        castShadow={false}
      />

      {/* Tall units, full height, at the end of the run. */}
      <CabinetRun
        length={1.6}
        height={2.3}
        depth={0.62}
        position={[2.75, 0, -2.5]}
        carcass={m.blackenedSteel}
        door={m.lacquerEmerald}
        hardware={m.brushedGold}
        doors={2}
      />

      {/* The island: carcass, waterfall stone top, and a walnut breakfast
          overhang on the camera side. */}
      <group position={[0, 0, -0.2]}>
        <CabinetRun
          length={islandW}
          height={counterH}
          depth={islandD}
          carcass={m.blackenedSteel}
          door={m.walnut}
          hardware={m.brushedGold}
          doors={3}
          position={[0, 0, 0]}
        />
        <Slab
          size={[islandW + 0.1, 0.05, islandD + 0.1]}
          position={[0, counterH + 0.025, 0]}
          material={m.marbleWhite}
        />
        {/* Waterfall ends — the stone returning to the floor. */}
        <Slab
          size={[0.05, counterH, islandD + 0.1]}
          position={[islandW / 2 + 0.02, counterH / 2, 0]}
          material={m.marbleWhite}
        />
        <Slab
          size={[0.05, counterH, islandD + 0.1]}
          position={[-islandW / 2 - 0.02, counterH / 2, 0]}
          material={m.marbleWhite}
        />
      </group>

      {/* Three pendants over the island at even centres — the canonical
          kitchen lighting gesture, and the reason the island reads as the
          social centre of the room rather than as a worktop. */}
      {[-0.9, 0, 0.9].map((x) => (
        <Pendant
          key={x}
          position={[x, DIMENSIONS.height, -0.2]}
          dropTo={1.62}
          shade={m.brushedGold}
          stem={m.blackenedSteel}
          glow={m.signalGold}
          radius={0.14}
        />
      ))}
    </RoomShell>
  );
}

export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'kitchen') return null;
  return <KitchenContent />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 135,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
