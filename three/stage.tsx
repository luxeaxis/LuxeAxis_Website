'use client';

import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';

/**
 * The gate between the DOM site and the WebGL layer (Build Backlog T-25).
 *
 * ## The build-time guard is the whole point of this file
 *
 * `process.env.NEXT_PUBLIC_FLAG_THREE_V1 === 'true'` is written out literally
 * here rather than read through `lib/flags.ts`. That looks like a duplication
 * and is not: Next substitutes `NEXT_PUBLIC_*` at build time, so with the flag
 * unset webpack sees `undefined === 'true'`, folds it to `false`, and the
 * `import()` below becomes unreachable code it can delete. Routed through a
 * helper function, the bundler cannot prove the branch is dead and keeps the
 * import — which is exactly what happened on the first attempt at this task.
 *
 * Measured, on the home page:
 *
 *     via lib/flags.ts helper      316 kB first load, `three` in two chunks
 *     literal env comparison       102 kB, `three` in none
 *
 * So the flag is not merely a runtime switch here. It is what keeps 800 kB of
 * WebGL out of a bundle whose budget is 200 kB, on a site whose first
 * non-negotiable is "speed is trust". `lib/flags.ts` still owns the flag for
 * everything that reads it at runtime; this one comparison has to stay inline.
 *
 * ## Why this module, and not components/
 *
 * `eslint.config.mjs` blocks every path into `three/` except the seam modules.
 * This is one of them, and it earns that by containing no static reference to
 * `three` at all — only a dynamic import that the bundler can drop.
 *
 * Critically, `three/registry.ts` does NOT import this file. The registry is
 * imported by `SceneSlot`, which renders on every page; a static path from
 * there to the canvas is how Next's client-reference manifest pulled `three`
 * into every route last time. The two modules are deliberately unconnected.
 *
 * ## Four gates before anything loads
 *
 * The flag, reduced motion, tier (T2+ only — T0 has no WebGL, T1 cannot hold
 * 30fps, and the store starts at T1 so the pessimistic answer applies before
 * anything is measured), and an active scene. This is also the reader that
 * `lib/store.ts`'s `tier`, `reducedMotion` and `activeScene` have been waiting
 * for since the foundations commit.
 */

const ThreeCanvas =
  process.env.NEXT_PUBLIC_FLAG_THREE_V1 === 'true'
    ? dynamic(() => import('./ThreeCanvas').then((module_) => module_.ThreeCanvas), {
        // A WebGL canvas cannot render on a server; asking Next to try costs a
        // wasted pass and a hydration mismatch.
        ssr: false,
      })
    : null;

export function SceneStage() {
  const tier = useAppStore((state) => state.tier);
  const reducedMotion = useAppStore((state) => state.reducedMotion);
  const activeScene = useAppStore((state) => state.activeScene);

  if (!ThreeCanvas) return null;
  if (reducedMotion) return null;
  if (tier !== 'T2' && tier !== 'T3') return null;
  if (!activeScene) return null;

  return <ThreeCanvas activeScene={activeScene} />;
}
