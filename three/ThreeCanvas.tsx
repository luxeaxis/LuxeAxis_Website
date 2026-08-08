'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { SCENES, type SceneId, type SceneModule } from './registry';
import { useCanvasInteractive } from './core/interaction';
import { configureAssetPipeline } from './core/assets';
import { TIER_BUDGET, useSceneTier } from './core/tier';
import { JourneyCamera } from './core/JourneyCamera';
import { HOME_STATIONS } from '@/lib/journey/stations';
import { useAppStore } from '@/lib/store';

/** Hands the live renderer to the asset pipeline, which needs it for
 *  `KTX2Loader.detectSupport` — without it, compressed textures transcode to
 *  uncompressed RGBA and cost more VRAM than the PNGs they replaced. Must be
 *  inside the Canvas; that is the only place `gl` exists. */
function AssetPipelineBridge() {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    configureAssetPipeline(gl);
  }, [gl]);
  return null;
}

/**
 * The single persistent WebGL context (Build Backlog T-25, Spec §3.2).
 *
 * Lives under `three/` because that is the only directory the ESLint seam
 * permits to import `three` or `@react-three/*`.
 *
 * One canvas, never one per scene: a WebGL context is expensive to create,
 * browsers cap how many exist at once, and losing one mid-scroll is a visible
 * failure that cannot be recovered gracefully. Scenes swap inside it.
 *
 * `frameloop="demand"` — the renderer draws only when asked rather than at
 * 60fps forever, so an idle canvas costs nothing. That matters because the
 * tiering system puts this in front of mid-range phones, where a permanent
 * render loop is a battery complaint.
 *
 * `aria-hidden` and never focusable. Spec §8.6: "all meaning is in the DOM
 * beside it". Every scene has a poster whose alt text carries the same claim,
 * and `SceneSlot` renders that whether or not this mounts.
 */
export function ThreeCanvas({ activeScene }: { activeScene: SceneId | null }) {
  const [module_, setModule] = useState<SceneModule | null>(null);

  useEffect(() => {
    const load = activeScene ? SCENES[activeScene] : undefined;
    if (!load) {
      setModule(null);
      return;
    }

    let cancelled = false;
    load().then(
      (loaded) => !cancelled && setModule(loaded),
      // A failed chunk leaves the poster in place, which is already on screen
      // and already carries the meaning. Nothing to tell the visitor.
      () => !cancelled && setModule(null),
    );
    return () => {
      cancelled = true;
    };
  }, [activeScene]);

  const Scene = module_?.Scene;
  const tier = useSceneTier();

  /**
   * Pointer events and `aria-hidden` are opt-in, per scene, and off by default.
   *
   * The default matters more than the exception. This is a fixed, full-screen
   * layer sitting above the entire page: if it accepted pointer events
   * unconditionally it would swallow every click meant for the links and
   * buttons underneath it, everywhere, on every route. `useInteractive` in
   * `three/core/interaction.tsx` is the only thing that can flip this, it is
   * reference-counted so an overlapping mount during a cross-fade cannot
   * strand the wrong state, and only the scenes the Cinematic Direction doc
   * lists as interactive are permitted to call it.
   *
   * `aria-hidden` is released in lockstep, never independently. A region that
   * responds to a mouse but is hidden from assistive technology is a WCAG 2.2
   * failure, so the two flags are the same flag.
   */
  const interactive = useCanvasInteractive();
  const onJourney = useAppStore((state) => state.station) !== null;

  return (
    <div
      aria-hidden={interactive ? undefined : 'true'}
      className={`fixed inset-0 z-canvas ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <Canvas
        frameloop="demand"
        // Capped: at devicePixelRatio 3 a phone renders nine times the pixels
        // of 1 for a difference almost nobody sees, and it is the biggest single
        // cause of thermal throttling in a scene like this. The upper bound is
        // per-tier now — T2 stops at 1.5, which is roughly a 30% fragment
        // saving on exactly the devices that need it.
        dpr={[1, TIER_BUDGET[tier].maxDpr]}
        shadows={TIER_BUDGET[tier].shadows}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <AssetPipelineBridge />
        {/* The journey camera, mounted only while a station is current. It
            reacts to navigation and never causes it — see JourneyCamera's own
            note. `HOME_STATIONS` is the only journey today; when a second one
            exists this takes the station list from the store rather than the
            module, which is a one-line change and deliberately not made yet. */}
        {onJourney && <JourneyCamera stations={HOME_STATIONS} />}
        {/* A scene that suspends on a GLB renders nothing until it resolves,
            which is correct: the poster is already on screen underneath and
            already carries the claim. There is no spinner to design, and a
            spinner over a poster would be strictly worse than the poster. */}
        <Suspense fallback={null}>
          {Scene && activeScene && <Scene sceneId={activeScene} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
