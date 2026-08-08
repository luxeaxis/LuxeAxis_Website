import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { POSTERS, SCENES, SCENE_IDS } from '@/three/registry';

const PLACEHOLDER_ALT = 'TODO';

describe('scene registry parity', () => {
  it.each(SCENE_IDS)('%s has a poster whose file exists on disk', (id) => {
    const poster = POSTERS[id];
    expect(poster).toBeDefined();
    expect(existsSync(`public${poster.src}`), `missing file: public${poster.src}`).toBe(true);
  });

  it.each(SCENE_IDS)('%s carries alt text stating the claim it makes', (id) => {
    const { alt } = POSTERS[id];
    expect(alt.length).toBeGreaterThan(20);
    expect(alt).not.toContain(PLACEHOLDER_ALT);
  });

  it.each(SCENE_IDS)('%s declares an aspect ratio so the slot reserves space', (id) => {
    expect(POSTERS[id].aspect).toMatch(/^\d+\/\d+$/);
  });

  it('marks exactly one poster as priority — the LCP element', () => {
    const prioritised = SCENE_IDS.filter((id) => POSTERS[id].priority);
    expect(prioritised).toEqual(['hero']);
  });

  it('registers a live 3D scene for every declared scene ID', () => {
    // Asserted against SCENE_IDS rather than a hardcoded count. The literal 9
    // this used to check went stale the moment the five room scenes were
    // added, and a number in a test tells you nothing about which id is
    // missing. Comparing the sets names it.
    const registered = new Set(Object.keys(SCENES));
    const unregistered = SCENE_IDS.filter((id) => !registered.has(id));
    expect(unregistered, `scene IDs with no loader: ${unregistered.join(', ')}`).toEqual([]);
    expect(registered.size).toBe(SCENE_IDS.length);
  });
});

/**
 * The seam's structural invariant, and the reason T-25 failed on its first
 * attempt.
 *
 * `registry.ts` is imported by `components/SceneSlot.tsx`, which renders on
 * nearly every page. If anything on that path reaches the canvas — even through
 * a `next/dynamic` wrapper — Next's client-reference manifest walks to it and
 * pulls `three` into every route's FIRST-LOAD JS. Measured when that happened:
 * the home page went from 102 kB to 316 kB against a 200 kB budget.
 *
 * The fix was to decouple the two modules entirely, and this is what keeps them
 * that way. A source-level check rather than a bundle one because it fails in
 * milliseconds at the point the mistake is made, instead of in a build someone
 * has to think to measure.
 */
describe('the WebGL seam stays out of every route bundle', () => {
  const registrySource = readFileSync('three/registry.ts', 'utf8');

  it('registry.ts references neither the canvas nor the stage', () => {
    // A substring check over the raw source, so it trips on the name appearing
    // in a COMMENT too. That is a false positive in the strict sense and it is
    // kept anyway: the check costs a millisecond, the failure mode it guards
    // against costs 214 kB on every route, and "write `the canvas` instead of
    // the module name in your prose" is a trivially cheap constraint. If you
    // landed here from a doc comment, reword the comment.
    expect(registrySource).not.toContain('ThreeCanvas');
    expect(registrySource).not.toContain('./stage');
  });

  it('registry.ts imports nothing from three or react-three', () => {
    // It is pure data — poster metadata, scene ids and types. Anything heavier
    // here lands on every page that renders a poster.
    expect(registrySource).not.toMatch(/from\s+['"]three['"]/);
    expect(registrySource).not.toMatch(/from\s+['"]@react-three\//);
  });

  it('the stage guards its import with a literal the bundler can fold', () => {
    // `process.env.NEXT_PUBLIC_FLAG_THREE_V1 === 'true'` written inline, not
    // read through lib/flags.ts. Next substitutes NEXT_PUBLIC_* at build time,
    // so webpack sees `undefined === 'true'`, folds it, and deletes the
    // unreachable import(). Behind a helper function it cannot prove the branch
    // is dead and keeps three in the bundle.
    const stageSource = readFileSync('three/stage.tsx', 'utf8');
    expect(stageSource).toContain("process.env.NEXT_PUBLIC_FLAG_THREE_V1 === 'true'");
    expect(stageSource).not.toMatch(/from\s+['"]@\/lib\/flags['"]/);
  });
});
