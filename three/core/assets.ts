'use client';

/**
 * The asset loader.
 *
 * ## What this replaces
 *
 * Nothing — there was no loader. Every scene under `three/scenes/` builds
 * itself from `boxGeometry` and `torusGeometry` primitives, because the repo
 * contains zero `.glb`, `.gltf`, `.hdr` and `.ktx2` files. This module is the
 * pipeline the performance spec (§4 "Scene streaming", §5 "Asset compression")
 * has always assumed exists, written so that the room scenes can ship
 * procedurally today and light up with real geometry the moment the first
 * optimised GLB lands, with no change to a scene file.
 *
 * ## Why not `useLoader` from R3F
 *
 * `useLoader` gives Suspense integration and a cache for free, and for a
 * simpler site it would be the right answer. It is not usable here for one
 * reason: its cache is permanent and global. The spec requires disposing
 * scenes two back to cap memory on phones, and `useLoader.clear()` evicts the
 * cache entry without disposing the GPU resources the entry points at — the
 * geometry, textures and materials stay resident. On a five-room tour that is
 * an unbounded leak on exactly the devices least able to absorb it.
 *
 * So the cache here is reference-counted and disposal walks the scene graph.
 *
 * ## Failure is not an error state
 *
 * A GLB that 404s, exceeds its budget, or fails to decode resolves to `null`,
 * and the scene renders its procedural fallback. The poster underneath is
 * already on screen and already carries the meaning (see `three/registry.ts`),
 * so there is nothing to tell the visitor and no error UI to design. This
 * mirrors the decision already made in `three/ThreeCanvas.tsx` for a failed
 * scene chunk.
 */

import type {
  BufferGeometry,
  Group,
  Material,
  Mesh,
  Object3D,
  Texture,
  WebGLRenderer,
} from 'three';
import { TIER_BUDGET, type SceneTier } from './tier';

export type LoadedAsset = {
  scene: Group;
  /** Uncompressed transfer size in bytes, as reported by the response. Used by
   *  the budget gate and surfaced for the CI check the spec asks for. */
  bytes: number;
};

type CacheEntry = {
  refs: number;
  /** Present while loading — this is what Suspense throws. */
  promise: Promise<LoadedAsset | null>;
  /** Present once settled. `null` means the load failed and the caller should
   *  fall back; it is a resolved state, not a pending one. */
  result?: LoadedAsset | null;
  error?: unknown;
};

const CACHE = new Map<string, CacheEntry>();

/**
 * The renderer, needed by `KTX2Loader.detectSupport` to pick a transcode
 * target for the device's actual GPU (ASTC on most phones, BC7 on desktop,
 * ETC1S as the floor). Without it KTX2 silently falls back to uncompressed
 * RGBA, which defeats the entire point of shipping KTX2 — the textures
 * decompress to *more* VRAM than a PNG would have used.
 */
let renderer: WebGLRenderer | null = null;

type Loaders = {
  gltf: import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader;
  dispose: () => void;
};

let loadersPromise: Promise<Loaders> | null = null;

/** Called once by `ThreeCanvas` with the live renderer. */
export function configureAssetPipeline(gl: WebGLRenderer): void {
  renderer = gl;
}

/**
 * Build the loader stack lazily, once.
 *
 * All three decoders are dynamically imported so they stay out of the scene
 * chunks entirely for any visitor whose scenes are procedural — which, until
 * the first GLB ships, is every visitor. The Draco and KTX2 decoders are
 * roughly 300KB of WASM between them; loading them to render a room made of
 * boxes would be indefensible.
 *
 * Decoder binaries are served from `/public/draco` and `/public/basis` rather
 * than from a CDN. A third-party script host is a supply-chain dependency on
 * the critical path of the visual layer, and it would have to be whitelisted
 * in the site's CSP.
 */
async function getLoaders(): Promise<Loaders> {
  if (loadersPromise) return loadersPromise;

  loadersPromise = (async () => {
    const [
      { GLTFLoader },
      { DRACOLoader },
      { KTX2Loader },
      { MeshoptDecoder },
    ] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/loaders/DRACOLoader.js'),
      import('three/examples/jsm/loaders/KTX2Loader.js'),
      import('three/examples/jsm/libs/meshopt_decoder.module.js'),
    ]);

    const gltf = new GLTFLoader();

    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    gltf.setDRACOLoader(draco);

    const ktx2 = new KTX2Loader();
    ktx2.setTranscoderPath('/basis/');
    if (renderer) ktx2.detectSupport(renderer);
    gltf.setKTX2Loader(ktx2);

    gltf.setMeshoptDecoder(MeshoptDecoder);

    return {
      gltf,
      dispose: () => {
        draco.dispose();
        ktx2.dispose();
      },
    };
  })();

  return loadersPromise;
}

/**
 * Walk a loaded graph and free every GPU resource it owns.
 *
 * `Object3D.remove` and dropping the reference are NOT enough — geometries,
 * textures and materials live in GPU memory that JavaScript's garbage
 * collector has no visibility into. This is the function whose absence turns
 * "dispose two scenes back" into a slow leak that only shows up as a crash on
 * a low-memory phone twenty minutes into a session.
 *
 * Materials taken from `three/core/materials.ts` are shared and reference
 * counted there; they are skipped here by name so disposing one room cannot
 * free the gold another room is still drawing with.
 */
function disposeGraph(root: Object3D, sharedMaterialNames: Set<string>): void {
  const seenTextures = new Set<Texture>();

  root.traverse((node) => {
    const mesh = node as Mesh;
    const geometry = mesh.geometry as BufferGeometry | undefined;
    if (geometry && typeof geometry.dispose === 'function') geometry.dispose();

    const material = mesh.material as Material | Material[] | undefined;
    if (!material) return;

    const list = Array.isArray(material) ? material : [material];
    for (const item of list) {
      if (sharedMaterialNames.has(item.name)) continue;

      // Textures are frequently reused across materials within one GLB, so
      // dispose each exactly once.
      for (const value of Object.values(item)) {
        const texture = value as Texture | null;
        if (
          texture &&
          typeof texture === 'object' &&
          'isTexture' in texture &&
          texture.isTexture
        ) {
          if (!seenTextures.has(texture)) {
            seenTextures.add(texture);
            texture.dispose();
          }
        }
      }
      item.dispose();
    }
  });
}

async function fetchAndParse(
  url: string,
  tier: SceneTier,
): Promise<LoadedAsset | null> {
  const response = await fetch(url);
  if (!response.ok) return null;

  const buffer = await response.arrayBuffer();
  const bytes = buffer.byteLength;

  // The budget gate. The spec makes per-scene size a CI check on the artefact;
  // this is the runtime half of the same contract, and it exists because CI
  // cannot know the visitor's tier. A 2.4MB hero GLB is within budget on T3
  // and is not something a T2 phone should be asked to decode.
  const limit = TIER_BUDGET[tier].maxSceneBytes;
  if (bytes > limit) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[assets] ${url} is ${(bytes / 1e6).toFixed(2)}MB, over the ${(limit / 1e6).toFixed(1)}MB ${tier} budget. Falling back to procedural.`,
      );
    }
    return null;
  }

  const { gltf } = await getLoaders();
  return new Promise<LoadedAsset | null>((resolve) => {
    gltf.parse(
      buffer,
      '',
      (result) => resolve({ scene: result.scene, bytes }),
      () => resolve(null),
    );
  });
}

/**
 * Suspense-compatible read.
 *
 * Throws the in-flight promise on first call, returns the asset (or `null` on
 * failure) once settled. Must be called inside a `<Suspense>` boundary —
 * `RoomShell` provides one, so scenes get this for free.
 */
export function readAsset(url: string, tier: SceneTier): LoadedAsset | null {
  const existing = CACHE.get(url);

  if (existing) {
    if ('result' in existing) return existing.result ?? null;
    throw existing.promise;
  }

  const entry: CacheEntry = {
    refs: 0,
    promise: fetchAndParse(url, tier)
      .then((result) => {
        entry.result = result;
        return result;
      })
      .catch(() => {
        entry.result = null;
        return null;
      }),
  };

  CACHE.set(url, entry);
  throw entry.promise;
}

/** Take a reference. Paired with `release`; `useAsset` in `RoomShell` does the
 *  pairing for scenes. */
export function retain(url: string): void {
  const entry = CACHE.get(url);
  if (entry) entry.refs += 1;
}

/**
 * Give a reference back, disposing at zero.
 *
 * `sharedMaterialNames` are the `MaterialId`s from `three/core/materials.ts`
 * that this graph had applied to it — they are ref-counted there and must not
 * be disposed here.
 */
export function release(
  url: string,
  sharedMaterialNames: Set<string> = new Set(),
): void {
  const entry = CACHE.get(url);
  if (!entry) return;

  entry.refs -= 1;
  if (entry.refs > 0) return;

  if (entry.result) disposeGraph(entry.result.scene, sharedMaterialNames);
  CACHE.delete(url);
}

/**
 * Warm the cache without rendering.
 *
 * This is the mechanism behind the spec's "`<Preload>` the *next* scene during
 * `requestIdleCallback`". Called by the director as the visitor approaches a
 * scene boundary, so the GLB is decoded and resident before the camera arrives
 * — the difference between a room that fades in and a room that pops.
 *
 * Deliberately swallows failures: a preload that fails is not a problem the
 * visitor has yet, and may never have if they never scroll that far.
 */
export function preloadAsset(url: string, tier: SceneTier): void {
  if (CACHE.has(url)) return;

  const entry: CacheEntry = {
    refs: 0,
    promise: fetchAndParse(url, tier)
      .then((result) => {
        entry.result = result;
        return result;
      })
      .catch(() => {
        entry.result = null;
        return null;
      }),
  };

  CACHE.set(url, entry);
}

/** How many assets are resident. Surfaced for the memory assertions in the
 *  Playwright performance suite. */
export function residentAssetCount(): number {
  return CACHE.size;
}

/** Test seam — frees everything unconditionally. */
export function __resetAssetsForTest(): void {
  for (const [, entry] of CACHE) {
    if (entry.result) disposeGraph(entry.result.scene, new Set());
  }
  CACHE.clear();
  loadersPromise = null;
  renderer = null;
}
