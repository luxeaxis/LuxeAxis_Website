/**
 * Feature flags.
 *
 * Every Phase 3/4 task in the Build Backlog ships "behind a flag, default off"
 * — `three_v1`, `motion_v1`, `smooth_scroll`, `calc_v1`, `audit_v1`. This is
 * that mechanism, and it is deliberately the simplest thing that satisfies it:
 * a build-time environment variable, read once.
 *
 * ## Why not a runtime flag service
 *
 * A/B assignment and remote toggles are what T-37's experimentation work is
 * for. Reaching for that now would mean a network call before first paint on a
 * site whose blueprint opens with "speed is trust", and a flag that can flip
 * mid-session is a much harder thing to reason about than one that cannot.
 *
 * Build-time also gives something a runtime flag cannot: when `three_v1` is
 * off, the bundler can see the branch is dead and drop the dynamic import
 * entirely, so `three` never reaches a visitor who will not use it. That is the
 * property `pnpm size` is asserting.
 *
 * ## Default off means off
 *
 * `=== 'true'` rather than a truthiness check. An unset variable is `undefined`,
 * a misspelt one is `undefined`, and a `.env` line reading `NEXT_PUBLIC_FLAG_
 * THREE_V1=false` is the string "false" — all three must land on OFF. A
 * truthiness check would enable the flag for the third.
 */

/** Exported so `tests/unit/flags.test.ts` can exercise it directly. Testing it
 *  through the module's env-read would mean re-importing with a mutated
 *  `process.env`, and a module cache makes that assertion vacuous — it passes
 *  whether or not the predicate is correct. */
export function isOn(value: string | undefined): boolean {
  return value === 'true';
}

export const FLAGS = {
  /**
   * The WebGL layer (T-25). Off in production until the hero scene ships
   * (T-27), which is the backlog's own instruction — an empty rig has nothing
   * to show, and mounting a canvas to render nothing costs a context, a render
   * loop and a battery.
   */
  three_v1: isOn(process.env.NEXT_PUBLIC_FLAG_THREE_V1),
} as const;

export type FlagName = keyof typeof FLAGS;
