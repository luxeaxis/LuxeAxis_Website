import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { POSTERS, SCENE_IDS } from '../three/registry';

const NAVY = { r: 13, g: 43, b: 78 };
const LONG_EDGE = 1920;

async function main() {
  mkdirSync('public/posters', { recursive: true });

  for (const id of SCENE_IDS) {
    const poster = POSTERS[id];
    const [w, h] = poster.aspect.split('/').map(Number) as [number, number];
    const scale = LONG_EDGE / Math.max(w, h);
    const width = Math.round(w * scale);
    const height = Math.round(h * scale);

    await sharp({ create: { width, height, channels: 3, background: NAVY } })
      .avif({ quality: 50 })
      .toFile(`public/posters/${id}.avif`);

    console.log(`${id}.avif  ${width}x${height}`);
  }
}

main();
