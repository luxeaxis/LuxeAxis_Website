import { describe, expect, it } from 'vitest';
import { canonicalFor, normalise } from '@/lib/seo/hreflang';

/**
 * This file used to assert hreflang alternates across `en`/`ta`, and that Tamil
 * was advertised only where a reviewed translation existed. The i18n stack is
 * gone, so there is one URL per route and the only claim left to police is that
 * a route canonicalises to exactly one of them.
 */

describe('canonicalFor', () => {
  it('canonicalises a route against the site origin', () => {
    expect(canonicalFor('/pricing').canonical).toBe('https://luxeaxis.in/pricing');
  });

  it('canonicalises the root without doubling the slash', () => {
    expect(canonicalFor('/').canonical).toBe('https://luxeaxis.in/');
  });

  it('never emits language alternates', () => {
    // A single-locale site advertising alternates is claiming translations it
    // does not have. The absence is the assertion.
    expect(canonicalFor('/pricing')).not.toHaveProperty('languages');
  });
});

describe('normalise', () => {
  it('collapses a trailing slash so one page cannot claim two canonicals', () => {
    expect(normalise('/pricing/')).toBe('/pricing');
    expect(canonicalFor('/pricing/').canonical).toBe(canonicalFor('/pricing').canonical);
  });

  it('keeps the root as "/" rather than the empty string', () => {
    expect(normalise('/')).toBe('/');
    expect(normalise('')).toBe('/');
  });
});
