'use client';

import dynamic from 'next/dynamic';

/**
 * The seam that decides whether the smooth-scroll engine exists at all
 * (Build Backlog T-21: "Deploy: behind `smooth_scroll` flag").
 *
 * ## Why the env check is written out literally
 *
 * `process.env.NEXT_PUBLIC_FLAG_SMOOTH_SCROLL === 'true'` appears verbatim
 * rather than being read through a helper or a config object. Next substitutes
 * `NEXT_PUBLIC_*` at build time, so webpack sees `'false' === 'true'`, folds
 * the branch, and drops the `import()` — taking Lenis and GSAP (~135 kB across
 * two async chunks) out of the build with it.
 *
 * Route them through `isEnabled(FLAGS.smoothScroll)` and the literal is gone,
 * the branch survives, and both libraries ship to every visitor again. This is
 * the identical trap `three/stage.tsx` documents, and it had already caught us
 * once there: `next/dynamic` alone does NOT remove the code, it only defers it.
 *
 * ## Why this is separate from SmoothScroll itself
 *
 * `SmoothScroll` used to be a provider wrapping the entire tree and returning
 * `<>{children}</>`. A component the whole page renders inside cannot be
 * dynamically imported without taking the page with it, so the flag could
 * never have removed anything. It renders `null` now and sits beside the
 * content rather than around it.
 *
 * ## Reduced motion is handled twice, deliberately
 *
 * The flag decides whether the code is in the bundle; `SmoothScroll`'s own
 * effect decides whether Lenis is instantiated for this visitor. Both are
 * needed: the flag is a build-time constant identical for everyone, and
 * reduced motion is a per-visitor preference that can change at runtime.
 */
const SmoothScroll =
  process.env.NEXT_PUBLIC_FLAG_SMOOTH_SCROLL === 'true'
    ? dynamic(
        () => import('./SmoothScroll').then((module_) => module_.SmoothScroll),
        {
          // Lenis measures and drives the real document; there is nothing for a
          // server pass to produce, and asking for one costs a hydration mismatch.
          ssr: false,
        },
      )
    : null;

export function SmoothScrollGate() {
  if (!SmoothScroll) return null;
  return <SmoothScroll />;
}
