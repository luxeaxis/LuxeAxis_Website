import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
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

  it('registers no live scenes yet — posters are the whole contract at this stage', () => {
    expect(Object.keys(SCENES)).toHaveLength(0);
  });
});
