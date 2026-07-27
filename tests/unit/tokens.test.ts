import { describe, expect, it, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

let css: string;

beforeAll(() => {
  execSync('pnpm tokens', { stdio: 'pipe' });
  css = readFileSync('styles/tokens.css', 'utf8');
});

const SEMANTIC_ROLES = [
  'surface', 'surface-deep', 'surface-raised', 'on-surface', 'on-surface-2',
  'on-surface-muted', 'accent', 'accent-contrast', 'accent-hover', 'signal',
  'border-subtle', 'border', 'border-strong', 'focus-ring',
  'field-bg', 'field-border-focus',
];

describe('token build', () => {
  it('declares every semantic role in both themes', () => {
    const [, darkBlock, lightBlock] = css.split(/:root\s*\{|\[data-theme="light"\]\s*\{/);
    for (const role of SEMANTIC_ROLES) {
      expect(darkBlock, `--${role} missing from dark`).toContain(`--${role}:`);
      expect(lightBlock, `--${role} missing from light`).toContain(`--${role}:`);
    }
  });

  it('emits component tokens as var() references, not resolved hex', () => {
    expect(css).toMatch(/--btn-primary-bg:\s*var\(--accent\)/);
    expect(css).toMatch(/--btn-primary-fg:\s*var\(--accent-contrast\)/);
  });

  it('declares component tokens exactly once — the semantic tier removes duplication', () => {
    const occurrences = css.match(/--btn-primary-bg:/g) ?? [];
    expect(occurrences).toHaveLength(1);
  });

  it('flattens shadow arrays into a single box-shadow list', () => {
    expect(css).toMatch(/--elevation-dark-1:\s*0 0 0 1px rgba\(252,250,245,0\.06\), 0 8px 40px 0 rgba\(201,168,76,0\.10\)/);
  });

  it('derives the nav glass fill from the surface and opacity tokens', () => {
    expect(css).toMatch(/--nav-bg:\s*rgba\(13, ?43, ?78, ?0\.55\)/);
    expect(css).toMatch(/--nav-bg:\s*rgba\(252, ?250, ?245, ?0\.7\)/);
  });

  it('declares nav-bg exactly once per theme', () => {
    expect(css.match(/--nav-bg:/g) ?? []).toHaveLength(2);
  });

  it('resolves every value at build time — no color-mix, no browser caveat', () => {
    expect(css).not.toContain('color-mix');
  });

  it('leaves no unresolved aliases', () => {
    expect(css).not.toMatch(/\{[a-z][a-z0-9.-]*\}/i);
  });

  it('does not publish the internal theme tier', () => {
    // theme.* maps semantic roles to primitives. Publishing it would let a
    // component read var(--theme-light-surface) and bypass the semantic API.
    expect(css).not.toMatch(/--theme-/);
  });

  it('resolves semantic tokens to literal values in both themes', () => {
    const [, darkBlock, lightBlock] = css.split(/:root\s*\{|\[data-theme="light"\]\s*\{/);
    expect(darkBlock).toMatch(/--surface:\s*#0D2B4E/i);
    expect(darkBlock).toMatch(/--accent:\s*#C9A84C/i);
    expect(lightBlock).toMatch(/--surface:\s*#FCFAF5/i);
    expect(lightBlock).toMatch(/--accent:\s*#1A7A85/i);
  });
});
