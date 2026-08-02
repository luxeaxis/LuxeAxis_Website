'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { SCENES, type SceneId, type SceneModule } from './registry';

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

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-canvas">
      <Canvas
        frameloop="demand"
        // Capped: at devicePixelRatio 3 a phone renders nine times the pixels
        // of 1 for a difference almost nobody sees, and it is the biggest single
        // cause of thermal throttling in a scene like this.
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {Scene && activeScene && <Scene sceneId={activeScene} />}
      </Canvas>
    </div>
  );
}
