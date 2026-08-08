'use client';

/**
 * Reception — the hospitality and commercial arrival set-piece.
 *
 * Route home: `/commercial/[vertical]` (hospitality, retail, clinic).
 *
 * ## The one room lit for drama
 *
 * `galleryDramatic`: a single strong gold key, the lowest fill in the set, and
 * a hard teal rim. A reception is the one interior whose whole job is the
 * first three seconds, and it is the only room in this set where high contrast
 * is the correct answer rather than an indulgence.
 *
 * ## Interactivity is wired but off by default, and that is deliberate
 *
 * `LuxeAxis_Cinematic_Direction.md` §8 lists the five places interaction is
 * earned "and nowhere else". A reception desk is not one of them. So the orbit
 * path is built and tested here — it is the reference implementation other
 * scenes copy — but `interactive` defaults to `false`, and turning it on is a
 * decision that has to be made deliberately, per mount.
 *
 * Turning it on has a hard requirement, not a suggestion: the page must render
 * a real, focusable DOM control inside `SceneSlot`'s children and pass its
 * yaw through `keyboardYaw`. Without it the object is operable by mouse and
 * unreachable by keyboard, which is a WCAG 2.2 failure — and one no automated
 * check in this repo will catch, because axe cannot see inside a canvas.
 */

import { useMemo } from 'react';
import type { SceneId, SceneModule } from '../registry';
import { RoomShell, useMaterials, type RoomConfig } from './RoomShell';
import { CameraSystem, shot } from '../core/camera';
import { useOrbit } from '../core/interaction';
import { ArtFrame, AxisPillar, Post, Rug, Seat, Slab } from './primitives';

const MATERIALS = [
  'stoneFloor',
  'plasterDeep',
  'marbleWhite',
  'walnut',
  'velvetEmerald',
  'linenClay',
  'polishedGold',
  'brushedGold',
  'blackenedSteel',
  'signalGold',
] as const;

const DIMENSIONS = { width: 9.5, depth: 8.5, height: 4.2 };

const SHOTS = [
  // Arrival: eye height, square on, the desk dead centre. This is the shot a
  // visitor walking through the door actually gets.
  shot.descent(0, [0, 1.65, 6.8], [0, 1.5, -1.2], 42),
  // Push in on the desk face and the backdrop behind it.
  shot.pushIn(0.4, [0, 1.55, 4.4], [0, 1.35, -1.8], 37),
  // Crane up the full height — a double-height reception's whole argument is
  // its volume, and only a vertical move can state it.
  shot.crane(0.76, [1.2, 2.9, 5.2], [0, 2.2, -2.2], 44),
  shot.settle(1, [1.2, 2.85, 5.0], [0, 2.1, -2.2], 40),
];

function ReceptionContent({ interactive }: { interactive: boolean }) {
  const m = useMaterials(MATERIALS);

  // Hooks are unconditional; the flag is passed down rather than used to skip
  // the call. `useOrbit` internally registers the canvas as interactive, so
  // gating happens at the binding site instead.
  const orbit = useOrbit({ limit: Math.PI * 0.22, sensitivity: 0.004 });

  const config = useMemo<RoomConfig>(
    () => ({
      dimensions: DIMENSIONS,
      mood: 'galleryDramatic',
      floor: 'stoneFloor',
      walls: 'plasterDeep',
      shots: SHOTS,
    }),
    [],
  );

  const deskH = 1.1;

  return (
    <>
      {/* When orbiting, the camera is driven here so the drag yaw can be fed
          in; RoomShell's own CameraSystem is suppressed by passing an empty
          shot list. Two camera rigs writing the same camera would fight, and
          the resulting jitter is very hard to attribute. */}
      {interactive && <CameraSystem shots={SHOTS} orbitYaw={orbit.yaw} />}

      <RoomShell
        config={interactive ? { ...config, shots: [] } : config}
        breathe={!orbit.dragging}
      >
        <AxisPillar
          position={[-3.9, 0, -3.8]}
          height={DIMENSIONS.height}
          material={m.polishedGold}
          radius={0.016}
        />

        <Rug size={[5.0, 3.0]} position={[0, 0, 1.4]} material={m.linenClay} />

        {/* The reception desk — the hero object. A stone monolith with a
            walnut return and a gold reveal at the base, which is what makes a
            two-tonne object look like it is floating. */}
        <group {...(interactive ? orbit.bind : {})}>
          <Slab
            size={[3.6, deskH - 0.06, 0.9]}
            position={[0, (deskH - 0.06) / 2 + 0.06, -1.8]}
            material={m.marbleWhite}
          />
          {/* Shadow gap at the floor. */}
          <Slab
            size={[3.4, 0.06, 0.8]}
            position={[0, 0.03, -1.8]}
            material={m.polishedGold}
          />
          {/* Walnut return, lower, at right angles. */}
          <Slab
            size={[0.9, 0.76, 1.6]}
            position={[2.0, 0.38, -1.4]}
            material={m.walnut}
          />
          {/* Stone top, oversailing. */}
          <Slab
            size={[3.7, 0.06, 1.0]}
            position={[0, deskH + 0.03, -1.8]}
            material={m.marbleWhite}
          />
        </group>

        {/* Backdrop wall: a slatted walnut screen with the studio mark above.
            Slats are five boxes, not fifty — at the distances in the shot list
            the read is identical and the draw calls are not. */}
        {[-1.4, -0.7, 0, 0.7, 1.4].map((x) => (
          <Slab
            key={x}
            size={[0.12, 3.2, 0.06]}
            position={[x, 1.6, -3.9]}
            material={m.walnut}
            castShadow={false}
          />
        ))}
        <ArtFrame
          size={[1.1, 0.5]}
          position={[0, 3.4, -3.82]}
          frame={m.polishedGold}
          face={m.signalGold}
        />

        {/* A waiting group, turned away from the desk — the arrangement that
            makes a lobby feel like somewhere to sit rather than a queue. */}
        <Seat
          width={2.2}
          depth={0.9}
          position={[-2.4, 0, 1.6]}
          rotation={[0, Math.PI / 5, 0]}
          body={m.velvetEmerald}
          cushion={m.linenClay}
        />
        <Seat
          width={0.9}
          depth={0.85}
          position={[0.6, 0, 2.3]}
          rotation={[0, -Math.PI / 3, 0]}
          body={m.velvetEmerald}
          cushion={m.linenClay}
        />

        {/* Two tall columns framing the approach — the device that gives a
            double-height space its sense of scale. */}
        {[-2.6, 2.6].map((x) => (
          <Post
            key={x}
            radius={0.16}
            height={DIMENSIONS.height}
            position={[x, DIMENSIONS.height / 2, -0.4]}
            material={m.blackenedSteel}
          />
        ))}
      </RoomShell>
    </>
  );
}

/**
 * `interactive` is not exposed through the `SceneModule` contract, which passes
 * only `sceneId`. Enabling orbit therefore means rendering this scene directly
 * rather than through the registry — which is the friction the spec's "nowhere
 * else" rule deserves.
 */
export function Scene({ sceneId }: { sceneId: SceneId }) {
  if (sceneId !== 'reception') return null;
  return <ReceptionContent interactive={false} />;
}

const moduleInfo: SceneModule = {
  Scene,
  budgetKB: 145,
  minTier: 'T2',
  flag: 'three_v1',
};

export default moduleInfo;
