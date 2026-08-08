import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { POSTERS, SCENE_IDS } from '../three/registry';

// `--color-surface-deep` / `color.brand.emerald-900` (#12291E). Was navy
// #0D2B4E, a colour the palette stopped containing at the emerald rebrand —
// so every placeholder poster was rendering a solid block of a retired brand
// colour behind the hero and eight other slots.
const VOID = { r: 18, g: 41, b: 30 };

/** Slots whose poster file is real and must never be regenerated. */
const REAL_ARTWORK = new Set<string>(['journey']);
const LONG_EDGE = 1920;

async function main() {
  mkdirSync('public/posters', { recursive: true });

  for (const id of SCENE_IDS) {
    // `journey` is the one slot holding real artwork — the studio's own
    // "Luxurious Section Divider", as documented in three/registry.ts. This
    // script used to overwrite it with a flat fill on every run, silently
    // destroying the only art-directed poster in the set. Anything added to
    // this list is real and must be replaced by hand, never regenerated.
    if (REAL_ARTWORK.has(id)) {
      console.log(`${id}.avif  skipped (real artwork)`);
      continue;
    }

    const poster = POSTERS[id];
    const [w, h] = poster.aspect.split('/').map(Number) as [number, number];
    const scale = LONG_EDGE / Math.max(w, h);
    const width = Math.round(w * scale);
    const height = Math.round(h * scale);

    await sharp({ create: { width, height, channels: 3, background: VOID } })
      .avif({ quality: 50 })
      .toFile(`public/posters/${id}.avif`);

    console.log(`${id}.avif  ${width}x${height}`);
  }
}

main();
