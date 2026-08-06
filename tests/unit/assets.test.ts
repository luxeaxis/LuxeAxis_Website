import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

/**
 * Every local asset path written in source has to exist in `public/`.
 *
 * The site shipped 233 references to `/images/hero/hero-slide-{1..4}.jpg`
 * across 37 files while `public/images/` did not exist at all — every
 * mega-menu spotlight and every service and portfolio card was a 404. Nothing
 * caught it: `next build` does not resolve `src` strings, `next/image` fails at
 * request time rather than build time, and axe only reports a missing image if
 * it also lacks an alt attribute, which these did not.
 *
 * So the gap is structural, not an oversight — a string that names a file is
 * not checked by any compiler, and the only place it can be checked is a test
 * that reads the strings and looks. This is that test.
 */
describe('local asset references resolve', () => {
  // Directory pathspecs rather than a glob, for the reason
  // tests/unit/content.test.ts gives: `app/**/*.tsx` requires an intermediate
  // directory and silently skips `app/page.tsx`.
  const sources = execSync('git ls-files app components lib three', { encoding: 'utf8' })
    .split('\n')
    .filter((file) => /\.tsx?$/.test(file));

  it('scans a non-trivial number of files', () => {
    expect(sources.length).toBeGreaterThan(50);
  });

  it('every "/..." asset path in source exists in public/', () => {
    // Quoted absolute paths that carry a file extension. A route like
    // `/residential/bedroom` has none, so this does not confuse links with
    // assets; `tests/unit/routes.test.ts` is what checks those.
    const ASSET = /['"`](\/[A-Za-z0-9._\-/]+\.(?:jpg|jpeg|png|gif|webp|avif|svg|mp4|webm|woff2?|ico|json))['"`]/g;

    const missing = sources.flatMap((file) => {
      const src = readFileSync(file, 'utf8');
      return [...src.matchAll(ASSET)]
        .map((match) => match[1]!)
        // `/icon` and friends are Next.js route handlers, not files on disk.
        .filter((path) => !existsSync(`public${path}`))
        .map((path) => `${file} -> ${path}`);
    });

    expect([...new Set(missing)], 'asset paths with no file in public/').toEqual([]);
  });
});
