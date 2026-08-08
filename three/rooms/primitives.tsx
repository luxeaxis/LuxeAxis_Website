'use client';

/**
 * Furniture primitives.
 *
 * The vocabulary the five rooms are built from. Every room composes these
 * rather than declaring raw geometry, for the same reason the material list is
 * closed: five rooms each inventing their own sofa produces five different
 * design languages, and the whole claim of this site is that one studio has a
 * point of view.
 *
 * ## Geometry is shared, like materials
 *
 * `boxGeometry` inside JSX allocates a new BufferGeometry per mesh. A room with
 * twenty box-derived parts is twenty geometry uploads for what is
 * mathematically one unit cube scaled differently. `useBox` returns a single
 * shared unit cube and the meshes scale it — one upload, reused everywhere,
 * and `scale` is free because it lives in the matrix the GPU already needs.
 *
 * ## Repeated parts are instanced
 *
 * Legs are the worst offender: six chairs is twenty-four draw calls for
 * twenty-four identical cylinders. `<Legs>` draws them in one. The spec's
 * ≤150 draw calls per scene is not a generous budget once a room has real
 * furniture in it, and instancing the repeats is where most of the headroom
 * comes from.
 */

import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  BoxGeometry,
  CylinderGeometry,
  Matrix4,
  type InstancedMesh,
  type Material,
} from 'three';
import { useMaterials } from './RoomShell';
import type { MaterialId } from '../core/materials';

/* ------------------------------------------------------------------------ *
 * Shared geometry
 * ------------------------------------------------------------------------ */

let unitBox: BoxGeometry | null = null;
let unitCylinder: CylinderGeometry | null = null;

/** One unit cube for the whole application. Never disposed — it is a handful
 *  of bytes and every room needs it, so tying its lifetime to any one scene
 *  would mean re-uploading it on every scene change. */
function useBox(): BoxGeometry {
  return useMemo(() => {
    unitBox ??= new BoxGeometry(1, 1, 1);
    return unitBox;
  }, []);
}

function useCylinder(): CylinderGeometry {
  return useMemo(() => {
    // 12 radial segments. At the sizes these are drawn — table legs, pendant
    // stems — the silhouette is indistinguishable from 32 segments, at a third
    // of the vertices.
    unitCylinder ??= new CylinderGeometry(0.5, 0.5, 1, 12);
    return unitCylinder;
  }, []);
}

type Vec3 = [number, number, number];

/* ------------------------------------------------------------------------ *
 * Building blocks
 * ------------------------------------------------------------------------ */

/**
 * A rectangular volume. Tabletops, counters, cabinet carcasses, headboards,
 * plinths, shelves — most of a room, in practice.
 *
 * `position` is the CENTRE, following three.js convention rather than the
 * bottom-left that CSS habits suggest. Rooms that place a slab by its centre
 * read correctly; rooms that assume otherwise float their furniture.
 */
export function Slab({
  size,
  position,
  rotation,
  material,
  castShadow = true,
}: {
  size: Vec3;
  position: Vec3;
  rotation?: Vec3;
  material: Material;
  castShadow?: boolean;
}) {
  const geometry = useBox();
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={size}
      castShadow={castShadow}
    />
  );
}

/**
 * Instanced legs at the four corners of a footprint.
 *
 * One draw call regardless of count. `useLayoutEffect` rather than `useEffect`
 * so the matrices are written before the first paint — with `frameloop="demand"`
 * a post-paint write would show one frame of every leg stacked at the origin,
 * which is brief, ugly, and exactly the kind of thing that only reproduces on
 * a slow device.
 */
export function Legs({
  footprint,
  height,
  radius = 0.025,
  y = 0,
  material,
  inset = 0.08,
}: {
  footprint: [number, number];
  height: number;
  radius?: number;
  y?: number;
  material: Material;
  inset?: number;
}) {
  const geometry = useCylinder();
  const ref = useRef<InstancedMesh>(null);

  const offsets = useMemo<Vec3[]>(() => {
    const x = footprint[0] / 2 - inset;
    const z = footprint[1] / 2 - inset;
    return [
      [x, y + height / 2, z],
      [-x, y + height / 2, z],
      [x, y + height / 2, -z],
      [-x, y + height / 2, -z],
    ];
  }, [footprint, height, inset, y]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const matrix = new Matrix4();
    offsets.forEach((offset, index) => {
      matrix.makeScale(radius * 2, height, radius * 2);
      matrix.setPosition(offset[0], offset[1], offset[2]);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [offsets, radius, height]);

  return <instancedMesh ref={ref} args={[geometry, material, 4]} castShadow />;
}

/** A cylinder — pendant stems, table pedestals, vases, floor lamp poles. */
export function Post({
  radius,
  height,
  position,
  material,
  rotation,
}: {
  radius: number;
  height: number;
  position: Vec3;
  material: Material;
  rotation?: Vec3;
}) {
  const geometry = useCylinder();
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={[radius * 2, height, radius * 2]}
      castShadow
    />
  );
}

/* ------------------------------------------------------------------------ *
 * Composed furniture
 * ------------------------------------------------------------------------ */

/** A seat: plinth, back, and two arms. Sofas and benches differ only in width. */
export function Seat({
  width,
  depth = 0.9,
  position,
  rotation,
  body,
  cushion,
  arms = true,
}: {
  width: number;
  depth?: number;
  position: Vec3;
  rotation?: Vec3;
  body: Material;
  cushion: Material;
  arms?: boolean;
}) {
  const seatH = 0.42;
  const backH = 0.5;

  return (
    <group position={position} rotation={rotation}>
      <Slab
        size={[width, seatH, depth]}
        position={[0, seatH / 2, 0]}
        material={body}
      />
      <Slab
        size={[width, 0.14, depth - 0.12]}
        position={[0, seatH + 0.07, 0.02]}
        material={cushion}
      />
      <Slab
        size={[width, backH, 0.16]}
        position={[0, seatH + backH / 2, -depth / 2 + 0.08]}
        material={body}
      />
      {arms && (
        <>
          <Slab
            size={[0.16, 0.28, depth]}
            position={[width / 2 - 0.08, seatH + 0.14, 0]}
            material={body}
          />
          <Slab
            size={[0.16, 0.28, depth]}
            position={[-width / 2 + 0.08, seatH + 0.14, 0]}
            material={body}
          />
        </>
      )}
    </group>
  );
}

/** A table: top plus instanced legs. */
export function Table({
  size,
  position,
  rotation,
  top,
  frame,
}: {
  size: Vec3;
  position: Vec3;
  rotation?: Vec3;
  top: Material;
  frame: Material;
}) {
  const [width, height, depth] = size;
  return (
    <group position={position} rotation={rotation}>
      <Slab
        size={[width, 0.05, depth]}
        position={[0, height, 0]}
        material={top}
      />
      <Legs footprint={[width, depth]} height={height} material={frame} />
    </group>
  );
}

/**
 * A run of cabinetry — the defining object of a kitchen, and the one that most
 * needs to look manufactured rather than modelled.
 *
 * The door reveals are what sell it: a continuous face reads as a wall, and a
 * face split by shadow gaps reads as joinery. The gap is 8mm, which is a real
 * reveal dimension and not an arbitrary pretty number.
 */
export function CabinetRun({
  length,
  height,
  depth,
  position,
  rotation,
  carcass,
  door,
  hardware,
  doors = 4,
}: {
  length: number;
  height: number;
  depth: number;
  position: Vec3;
  rotation?: Vec3;
  carcass: Material;
  door: Material;
  hardware: Material;
  doors?: number;
}) {
  const gap = 0.008;
  const doorWidth = (length - gap * (doors + 1)) / doors;

  const panels = useMemo(
    () =>
      Array.from({ length: doors }, (_, index) => {
        const x = -length / 2 + gap + doorWidth / 2 + index * (doorWidth + gap);
        return { x, key: `door-${index}` };
      }),
    [doors, doorWidth, length],
  );

  return (
    <group position={position} rotation={rotation}>
      <Slab
        size={[length, height, depth]}
        position={[0, height / 2, 0]}
        material={carcass}
      />
      {panels.map(({ x, key }) => (
        <group key={key}>
          <Slab
            size={[doorWidth, height - gap * 2, 0.02]}
            position={[x, height / 2, depth / 2 + 0.01]}
            material={door}
          />
          {/* A slim horizontal pull, inset from the top edge. */}
          <Slab
            size={[doorWidth * 0.5, 0.012, 0.03]}
            position={[x, height - 0.09, depth / 2 + 0.03]}
            material={hardware}
          />
        </group>
      ))}
    </group>
  );
}

/** A pendant: stem, shade, and an emissive disc standing in for the lamp.
 *  No real light is added — the lighting rig owns every light in the scene,
 *  and a pendant that spawned its own PointLight would blow the tier budget
 *  four pendants into a kitchen. */
export function Pendant({
  position,
  dropTo,
  shade,
  stem,
  glow,
  radius = 0.16,
}: {
  position: Vec3;
  dropTo: number;
  shade: Material;
  stem: Material;
  glow: Material;
  radius?: number;
}) {
  const [x, ceilingY, z] = position;
  const stemLength = ceilingY - dropTo;

  return (
    <group>
      <Post
        radius={0.006}
        height={stemLength}
        position={[x, dropTo + stemLength / 2, z]}
        material={stem}
      />
      <mesh position={[x, dropTo, z]} castShadow material={shade}>
        <coneGeometry args={[radius, radius * 1.1, 20, 1, true]} />
      </mesh>
      <mesh position={[x, dropTo - radius * 0.5, z]} material={glow}>
        <circleGeometry args={[radius * 0.8, 20]} />
      </mesh>
    </group>
  );
}

/** A framed work on a wall. Reads as art at any distance and costs two boxes. */
export function ArtFrame({
  size,
  position,
  rotation,
  frame,
  face,
}: {
  size: [number, number];
  position: Vec3;
  rotation?: Vec3;
  frame: Material;
  face: Material;
}) {
  const [w, h] = size;
  return (
    <group position={position} rotation={rotation}>
      <Slab
        size={[w, h, 0.03]}
        position={[0, 0, 0]}
        material={frame}
        castShadow={false}
      />
      <Slab
        size={[w - 0.08, h - 0.08, 0.01]}
        position={[0, 0, 0.02]}
        material={face}
        castShadow={false}
      />
    </group>
  );
}

/** A rug. Flat, thin, and lifted 5mm off the floor so it never z-fights with
 *  it — the single most common artefact in an interior scene. */
export function Rug({
  size,
  position,
  material,
}: {
  size: [number, number];
  position: Vec3;
  material: Material;
}) {
  return (
    <Slab
      size={[size[0], 0.012, size[1]]}
      position={[position[0], position[1] + 0.006, position[2]]}
      material={material}
      castShadow={false}
    />
  );
}

/**
 * The Axis — the brand motif, as a physical object in the room.
 *
 * A thin gold line running floor to ceiling. It is what ties five otherwise
 * unrelated rooms into one film, and it is the object the camera's `descent`
 * move travels along. Every room places exactly one.
 */
export function AxisPillar({
  position,
  height,
  material,
  radius = 0.012,
}: {
  position: Vec3;
  height: number;
  material: Material;
  radius?: number;
}) {
  return (
    <Post
      radius={radius}
      height={height}
      position={[position[0], position[1] + height / 2, position[2]]}
      material={material}
    />
  );
}

/** Convenience: pull several materials at once inside a room file. */
export function useRoomMaterials<T extends readonly MaterialId[]>(ids: T) {
  return useMaterials(ids);
}
