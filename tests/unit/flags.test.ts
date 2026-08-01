import { describe, expect, it } from 'vitest';
import { FLAGS, isOn } from '@/lib/flags';

/**
 * Feature flags (Build Backlog: every Phase 3/4 task ships "behind a flag,
 * default off").
 *
 * The only behaviour worth testing is the default, because that is the one a
 * production deploy gets if nobody sets anything — and "default off" is a
 * safety property, not a preference.
 */

describe('FLAGS', () => {
  it('defaults three_v1 to off', () => {
    // T-25: "behind `three_v1` (default off in prod until T-27)". An empty rig
    // has nothing to show, and mounting a WebGL canvas to render nothing costs
    // a GPU context and a battery.
    expect(FLAGS.three_v1).toBe(false);
  });

  it('treats anything other than the string "true" as off', () => {
    // The subtle one, and the reason this is an explicit `=== 'true'` rather
    // than a truthiness check. An unset variable is `undefined`, a misspelt
    // name is `undefined`, and a `.env` line reading `...=false` arrives as the
    // STRING "false" — which is truthy. A truthiness check would silently
    // enable the flag for the person who most clearly meant to disable it.
    //
    // Tested against the predicate rather than by re-importing the module with
    // a mutated `process.env`: the module cache would hand back the same
    // evaluated object either way, so that version of this test would pass
    // whether or not the logic was right.
    for (const value of ['false', '0', 'off', 'no', '', 'TRUE', 'True', undefined]) {
      expect(isOn(value), String(value)).toBe(false);
    }
  });

  it('is on only for exactly "true"', () => {
    expect(isOn('true')).toBe(true);
  });
});
