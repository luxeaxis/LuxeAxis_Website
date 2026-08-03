'use client';

/**
 * The global `useReducedMotion()` hook the design system's motion language
 * calls for (§2.4: "Provide a global `useReducedMotion()` hook + a CSS
 * safety net"). The CSS safety net already exists (globals.css's
 * `@media (prefers-reduced-motion: reduce)` block); this is the missing JS
 * half — for the handful of cases a component needs to branch in JS rather
 * than lean on `motion-reduce:*` classes alone (e.g. Tooltip's open-delay
 * timer, which has no CSS equivalent to skip).
 *
 * Reads the live OS/browser signal via `matchMedia`, not the app's own
 * `reducedMotion` toggle in `lib/store.ts` — that store also has to seed
 * itself from the same media query (see `lib/tier/useDeviceTier.ts`), which
 * makes this hook the one place that query is ever read. A component that
 * also needs to honour the in-product "Reduce motion" footer toggle should
 * read `useAppStore((s) => s.reducedMotion)` instead; this hook is for
 * components with no reason to depend on the zustand store at all (a
 * dependency `useDeviceTier` already carries app-wide).
 */

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  // Starts `false` (not `true`) even though `lib/store.ts` defaults its own
  // `reducedMotion` flag to `true` "until proven otherwise" for the 3D
  // tier-gating use case (see that file's comment) — this hook has no
  // WebGL/perf stakes to hedge against, so it stays honest to "unknown yet"
  // rather than assuming the stronger claim, and corrects itself the instant
  // the effect below can read the real media query.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const query = window.matchMedia(QUERY);
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
