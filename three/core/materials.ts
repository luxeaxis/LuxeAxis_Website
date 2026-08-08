/**
 * The material library.
 *
 * ## Why materials are shared and reference-counted rather than inline
 *
 * Writing `<meshStandardMaterial color="#FFC107" />` inside a mesh — which is
 * what every scene under `three/scenes/` does today — creates a NEW material
 * per mesh. Each distinct material means:
 *
 *   - a separate shader program compile on first render (the single largest
 *     cause of the stutter-on-scene-entry that `frameloop="demand"` otherwise
 *     hides), and
 *   - a GPU state change per draw call, which is what the spec's "≤150 draw
 *     calls per scene" budget is really counting.
 *
 * A living room with 40 gold fittings should compile one gold program and
 * change state once, not forty times. That is the whole reason this file
 * exists.
 *
 * ## Why reference counting rather than a plain module-level cache
 *
 * A plain cache never frees anything, and the director disposes scenes two
 * back (spec §4, "dispose two scenes back to cap memory"). But a material is
 * shared: the kitchen and the bedroom both use `brushedGold`. Disposing the
 * kitchen must not pull the gold out from under the bedroom that is still on
 * screen during a cross-fade transition.
 *
 * So each `acquire` increments, each `release` decrements, and the GPU resource
 * is freed only at zero. Getting this wrong in either direction is expensive
 * and silent: leak, and memory climbs until the tab is killed on a phone;
 * over-free, and meshes render black with a console warning nobody reads.
 */

import {
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Material,
} from 'three';
import { PALETTE } from './palette';

/**
 * Every material the room scenes are allowed to use.
 *
 * A closed set, deliberately. If a scene needs a surface that is not here, the
 * right move is to add it here — where it is named, reviewed against the
 * palette, and shared — rather than to inline a one-off, which is how a
 * "premium" set of scenes drifts into forty slightly different browns.
 */
export type MaterialId =
  // Metals — the Axis motif and every fitting, handle, frame and leg.
  | 'polishedGold'
  | 'brushedGold'
  | 'blackenedSteel'
  // Architecture — walls, floors, ceilings.
  | 'plasterWarm'
  | 'plasterDeep'
  | 'oakFloor'
  | 'stoneFloor'
  // Joinery and stone — cabinetry, counters, tables.
  | 'walnut'
  | 'lacquerEmerald'
  | 'marbleWhite'
  // Soft goods — upholstery, bedding, rugs.
  | 'linenClay'
  | 'velvetEmerald'
  // Transmissive — glazing, glass partitions, pendant shades.
  | 'glassClear'
  // Signal — data overlays, Vastu zones, hotspot affordances. Unlit on purpose.
  | 'signalTeal'
  | 'signalGold';

type Factory = () => Material;

/**
 * Material definitions.
 *
 * `roughness`/`metalness` values are the point of this table — they are what
 * separates "a gold-coloured box" from "a gold object". Metals are metalness 1
 * with roughness carrying the whole read; dielectrics are metalness 0. The
 * in-between values that a lot of hand-tuned scenes end up with are physically
 * meaningless and look like plastic under every light rig.
 */
const FACTORIES: Record<MaterialId, Factory> = {
  polishedGold: () =>
    new MeshStandardMaterial({
      color: new Color(PALETTE.gold),
      metalness: 1,
      roughness: 0.12,
    }),

  brushedGold: () =>
    new MeshStandardMaterial({
      color: new Color(PALETTE.goldDeep),
      metalness: 1,
      roughness: 0.42,
    }),

  blackenedSteel: () =>
    new MeshStandardMaterial({
      color: new Color(PALETTE.emeraldVoid),
      metalness: 1,
      roughness: 0.55,
    }),

  plasterWarm: () =>
    new MeshStandardMaterial({
      color: new Color(PALETTE.clay),
      metalness: 0,
      roughness: 0.95,
    }),

  plasterDeep: () =>
    new MeshStandardMaterial({
      color: new Color(PALETTE.emerald),
      metalness: 0,
      roughness: 0.92,
    }),

  oakFloor: () =>
    new MeshStandardMaterial({
      color: new Color(PALETTE.goldDeep),
      metalness: 0,
      roughness: 0.68,
    }),

  stoneFloor: () =>
    new MeshStandardMaterial({
      color: new Color(PALETTE.claySunken),
      metalness: 0,
      roughness: 0.8,
    }),

  walnut: () =>
    new MeshStandardMaterial({
      color: new Color('#4A3428'),
      metalness: 0,
      roughness: 0.6,
    }),

  lacquerEmerald: () =>
    // Clearcoat is the difference between "painted" and "lacquered", and it is
    // the one place the extra cost of MeshPhysicalMaterial earns itself on a
    // kitchen — the highlight sits ON the surface rather than in the colour.
    new MeshPhysicalMaterial({
      color: new Color(PALETTE.emeraldRaised),
      metalness: 0,
      roughness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),

  marbleWhite: () =>
    new MeshPhysicalMaterial({
      color: new Color(PALETTE.clayHi),
      metalness: 0,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    }),

  linenClay: () =>
    new MeshStandardMaterial({
      color: new Color(PALETTE.claySunken),
      metalness: 0,
      roughness: 1,
    }),

  velvetEmerald: () =>
    // Velvet reads by its sheen, which is a MeshPhysicalMaterial feature and
    // has no MeshStandardMaterial equivalent worth faking.
    new MeshPhysicalMaterial({
      color: new Color(PALETTE.emeraldRaised),
      metalness: 0,
      roughness: 0.9,
      sheen: 1,
      sheenRoughness: 0.35,
      sheenColor: new Color(PALETTE.emeraldHi),
    }),

  glassClear: () =>
    new MeshPhysicalMaterial({
      color: new Color(PALETTE.clayHi),
      metalness: 0,
      roughness: 0.05,
      // `transmission` is genuinely expensive — it forces a second render pass
      // of everything behind the glass. The lighting rig drops glazing to a
      // cheap transparent material below T3; see `three/core/lighting.tsx`.
      transmission: 0.92,
      thickness: 0.4,
      ior: 1.5,
      transparent: true,
      side: DoubleSide,
    }),

  signalTeal: () =>
    // Unlit (`emissive` at full, `color` black) so a data overlay reads at the
    // same strength regardless of where the light rig happens to be pointing.
    // A signal that dims when the camera moves is not a signal.
    new MeshStandardMaterial({
      color: new Color('#000000'),
      emissive: new Color(PALETTE.tealBright),
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.85,
    }),

  signalGold: () =>
    new MeshStandardMaterial({
      color: new Color('#000000'),
      emissive: new Color(PALETTE.gold),
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.85,
    }),
};

type Entry = { material: Material; refs: number };

const CACHE = new Map<MaterialId, Entry>();

/**
 * Take a shared material, creating it on first use.
 *
 * Every call MUST be paired with a `releaseMaterial`. `useMaterials` in
 * `three/rooms/RoomShell.tsx` does that pairing for you and is what scenes
 * should actually call — this lower-level API exists for the loader, which
 * assigns materials to GLTF meshes outside of React's lifecycle.
 */
export function acquireMaterial(id: MaterialId): Material {
  const existing = CACHE.get(id);
  if (existing) {
    existing.refs += 1;
    return existing.material;
  }

  const material = FACTORIES[id]();
  material.name = id;
  CACHE.set(id, { material, refs: 1 });
  return material;
}

/** Give a shared material back. Frees the GPU resource at zero references. */
export function releaseMaterial(id: MaterialId): void {
  const entry = CACHE.get(id);
  if (!entry) return;

  entry.refs -= 1;
  if (entry.refs > 0) return;

  entry.material.dispose();
  CACHE.delete(id);
}

/**
 * Downgrade the expensive materials in place for a device that cannot afford
 * them.
 *
 * Called by the lighting rig when the tier resolves below T3. Mutating the
 * shared instances is correct here and cheaper than swapping every mesh's
 * material reference: one property write per material, and three.js recompiles
 * the affected programs once.
 *
 * `transmission` is the expensive one by a wide margin — it costs a full extra
 * render of the scene behind the glass, per glass object. Dropping it to a
 * plain alpha blend is the single biggest frame-rate win available on a phone.
 */
export function applyQualityTier(tier: 'T2' | 'T3'): void {
  const glass = CACHE.get('glassClear')?.material as
    | MeshPhysicalMaterial
    | undefined;
  if (glass) {
    glass.transmission = tier === 'T3' ? 0.92 : 0;
    glass.opacity = tier === 'T3' ? 1 : 0.28;
    glass.needsUpdate = true;
  }

  const velvet = CACHE.get('velvetEmerald')?.material as
    | MeshPhysicalMaterial
    | undefined;
  if (velvet) {
    velvet.sheen = tier === 'T3' ? 1 : 0;
    velvet.needsUpdate = true;
  }

  const lacquer = CACHE.get('lacquerEmerald')?.material as
    | MeshPhysicalMaterial
    | undefined;
  if (lacquer) {
    lacquer.clearcoat = tier === 'T3' ? 1 : 0;
    lacquer.needsUpdate = true;
  }
}

/** Test seam. Not for production paths — it frees materials other scenes may
 *  still hold, which is exactly what the reference counting exists to prevent. */
export function __resetMaterialsForTest(): void {
  for (const entry of CACHE.values()) entry.material.dispose();
  CACHE.clear();
}
