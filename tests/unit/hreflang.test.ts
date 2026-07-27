import { describe, expect, it } from 'vitest';
import { alternatesFor } from '@/lib/seo/hreflang';

describe('alternatesFor', () => {
  it('advertises Tamil only where it is actually published', () => {
    expect(alternatesFor('/').languages).toEqual({
      en: 'https://luxeaxis.com/',
      ta: 'https://luxeaxis.com/ta',
      'x-default': 'https://luxeaxis.com/',
    });
  });

  it('omits Tamil entirely on unpublished routes rather than lying to crawlers', () => {
    const { languages } = alternatesFor('/pricing');
    expect(languages).toEqual({
      en: 'https://luxeaxis.com/pricing',
      'x-default': 'https://luxeaxis.com/pricing',
    });
    expect(languages).not.toHaveProperty('ta');
  });

  it('canonicalises to the English URL', () => {
    expect(alternatesFor('/pricing').canonical).toBe('https://luxeaxis.com/pricing');
  });

  it('treats the empty route and the root route identically', () => {
    expect(alternatesFor('')).toEqual(alternatesFor('/'));
  });

  it('normalises a trailing-slash route to the same output as its clean equivalent, including the ta alternate', () => {
    // PUBLISHED.ta only contains '/', so the root's two spellings ('' and '/')
    // are the only inputs that exercise the ta branch without stubbing the
    // published-routes module. This proves the ta URL built from '' matches
    // the ta URL built from '/' exactly - the branch that used to skip
    // normalisation entirely.
    const clean = alternatesFor('/');
    const trailing = alternatesFor('');
    expect(trailing.languages.ta).toBe(clean.languages.ta);
    expect(trailing.languages.ta).toBe('https://luxeaxis.com/ta');
  });

  it('never produces a double slash after the origin, on any URL in the result', () => {
    const results = [alternatesFor(''), alternatesFor('/'), alternatesFor('/pricing'), alternatesFor('/pricing/')];
    for (const { languages, canonical } of results) {
      for (const url of [...Object.values(languages), canonical]) {
        const afterOrigin = url.replace(/^https?:\/\//, '');
        expect(afterOrigin.includes('//')).toBe(false);
      }
    }
  });
});
