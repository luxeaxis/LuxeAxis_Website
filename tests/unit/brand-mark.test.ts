/// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MARK_PATHS, MARK_VIEWBOX, markSvgDocument } from '@/lib/brand/mark';

/**
 * The mark is the studio's vector identity (spec §3.6). Two things can break
 * it, and neither is visible in a type:
 *
 *  1. The path data changes in one place and not the other. That is why
 *     `lib/brand/mark.ts` exists at all, and why `components/Logo.tsx` reads
 *     it rather than holding a copy.
 *  2. The composed SVG document stops being parseable, at which point any
 *     consumer that parses it yields zero shapes and renders nothing.
 *
 * What is checked here is the contract those consumers depend on.
 */
describe('the brand mark is a single vector source', () => {
  it('carries both monogram paths', () => {
    expect(MARK_PATHS.map((path) => path.id)).toEqual(['l', 'a']);
    for (const path of MARK_PATHS) {
      // A path that starts with a move and carries curve or line commands is
      // the minimum a parser can turn into a closed shape.
      expect(path.d, `${path.id} should start with a moveto`).toMatch(/^M/);
      expect(path.d.length, `${path.id} looks truncated`).toBeGreaterThan(200);
    }
  });

  it('composes a well-formed SVG document around them', () => {
    const svg = markSvgDocument();
    expect(svg).toMatch(/^<svg /);
    expect(svg).toMatch(/<\/svg>$/);
    expect(svg).toContain(
      `viewBox="${MARK_VIEWBOX.x} ${MARK_VIEWBOX.y} ${MARK_VIEWBOX.width} ${MARK_VIEWBOX.height}"`,
    );
    expect(svg.match(/<path /g)).toHaveLength(MARK_PATHS.length);
    const parsed = new DOMParser().parseFromString(svg, 'image/svg+xml');
    expect(parsed.querySelector('parsererror')).toBeNull();
    expect(parsed.querySelectorAll('path')).toHaveLength(MARK_PATHS.length);
  });

  it('is the same data components/Logo.tsx renders, not a second copy', () => {
    // The failure this catches is someone editing the artwork in one file and
    // not the other — the exact drift §3.6 forbids. Logo.tsx must therefore
    // contain no inline `d=` of its own.
    const logo = readFileSync('components/Logo.tsx', 'utf8');
    expect(
      logo,
      'Logo.tsx should import the paths, not inline them',
    ).not.toMatch(/\sd="M[\d.]/);
    expect(logo).toMatch(/MARK_PATHS|from '@\/lib\/brand\/mark'/);
  });
});
