/**
 * Feature flags.
 *
 * Every Phase 3/4 task in the Build Backlog ships "behind a flag, default off".
 * This is that mechanism, and it is deliberately the simplest thing that
 * satisfies it: a build-time environment variable, read once.
 *
 * ## Why not a runtime flag service
 *
 * A/B assignment and remote toggles are what T-37's experimentation work is
 * for. Reaching for that now would mean a network call before first paint on a
 * site whose blueprint opens with "speed is trust", and a flag that can flip
 * mid-session is a much harder thing to reason about than one that cannot.
 *
 * ## Default off means off
 *
 * `=== 'true'` rather than a truthiness check. An unset variable is `undefined`,
 * a misspelt one is `undefined`, and a `.env` line reading `NEXT_PUBLIC_FLAG_
 * SMOOTH_SCROLL=false` is the string "false" — all three must land on OFF. A
 * truthiness check would enable the flag for the third.
 *
 * Flags are added here as features ship. The WebGL layer (`three_v1`) was
 * descoped — posters remain; live scenes do not.
 */

/** Exported so `tests/unit/flags.test.ts` can exercise it directly. Testing it
 *  through the module's env-read would mean re-importing with a mutated
 *  `process.env`, and a module cache makes that assertion vacuous — it passes
 *  whether or not the predicate is correct. */
export function isOn(value: string | undefined): boolean {
  return value === 'true';
}

/** Build-time flags. Empty until a feature needs one — see SmoothScrollGate for
 *  flags inlined at their consumer when tree-shaking matters. */
export const FLAGS = {} as const;

export type FlagName = keyof typeof FLAGS;
