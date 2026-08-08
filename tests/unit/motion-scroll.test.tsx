import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAppStore } from '@/lib/store';
import { SmoothScrollGate } from '@/components/SmoothScrollGate';

/**
 * The scroll engine's seam (Build Backlog T-21).
 *
 * Two of these tests used to cover `GoldAxisRail`, a fixed gold line drawn down
 * the right margin of every page. The client had already asked for that line to
 * be removed once; it returned with this feature, and has been removed again
 * along with its tests.
 *
 * What replaces them is the guard that was missing. Lenis and GSAP are ~135 kB
 * across two async chunks, and they were imported statically by a provider
 * wrapping the whole tree — so every visitor downloaded both, including
 * reduced-motion visitors, whose own code path destroys the Lenis instance and
 * uses neither.
 */

/** Just the import lines, so prose that names a library cannot fail a test
 *  about whether that library is imported. */
function imports(source: string): string {
  return source
    .split(String.fromCharCode(10))
    .filter((line) => /^\s*import\b/.test(line))
    .join(String.fromCharCode(10));
}

/** Source with comments stripped, for assertions about code rather than prose. */
function code(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
}

describe('the store carries scroll progress', () => {
  it('records progress and direction for the camera rig to read', () => {
    // Nothing consumes this yet — the rail was its only reader. T-26's camera
    // rig is the intended consumer, and this is the contract it will read.
    useAppStore.getState().setScrollProgress(0.42, 'down');
    expect(useAppStore.getState().scrollProgress).toBeCloseTo(0.42);
    expect(useAppStore.getState().scrollDirection).toBe('down');

    useAppStore.getState().setScrollProgress(0.1, 'up');
    expect(useAppStore.getState().scrollDirection).toBe('up');
  });
});

describe('the smooth-scroll gate', () => {
  it('renders nothing while the flag is off', () => {
    // Unset in tests, which is also the production default: smooth scroll is
    // the highest-risk accessibility change on the site, so it does not ship on.
    const { container } = render(<SmoothScrollGate />);
    expect(container.innerHTML).toBe('');
  });

  it('keeps the env check literal, so the bundle can actually shed the libraries', () => {
    // The load-bearing detail, and the one a refactor would quietly undo. Next
    // substitutes NEXT_PUBLIC_* at build time, so webpack sees
    // `'false' === 'true'`, folds the branch and drops the import(). Route this
    // through a helper or a FLAGS object and the literal is gone, the branch
    // survives, and Lenis and GSAP ship to everyone again.
    //
    // three/stage.tsx documents the identical trap, and it caught us there
    // once already: next/dynamic alone defers code, it does not remove it.
    const source = readFileSync('components/SmoothScrollGate.tsx', 'utf8');
    expect(source).toContain(
      "process.env.NEXT_PUBLIC_FLAG_SMOOTH_SCROLL === 'true'",
    );
    expect(source).toContain('ssr: false');
  });

  it('is the only route into the scroll engine', () => {
    // If the layout imported SmoothScroll directly the gate would be
    // decorative: a static import puts Lenis and GSAP back in the bundle
    // regardless of what the flag says.
    const source = readFileSync('app/layout.tsx', 'utf8');
    expect(source).toContain('SmoothScrollGate');

    // Import lines only. The prose in this file names both libraries while
    // explaining why they are NOT imported, so matching raw text would fail on
    // the very comment that documents the fix.
    const lines = imports(source);
    expect(lines).not.toMatch(/components\/SmoothScroll'/);
    expect(lines).not.toMatch(/\blenis\b|\bgsap\b/i);
  });

  it('does not wrap the page, so the flag can remove it', () => {
    // It was a provider returning `<>{children}</>`. A component the whole page
    // renders inside cannot be dynamically imported without taking the page
    // with it, which is why the flag could never have removed anything while
    // that was true.
    const source = readFileSync('components/SmoothScroll.tsx', 'utf8');
    expect(code(source)).not.toContain('children');
    expect(source).toContain('return null');
  });

  it('leaves no trace of the gold rail', () => {
    // Removed twice now. This is here so a third reintroduction fails a test
    // rather than reaching the client's screen again.
    const layout = readFileSync('app/layout.tsx', 'utf8');
    expect(layout).not.toContain('GoldAxisRail');
  });
});
