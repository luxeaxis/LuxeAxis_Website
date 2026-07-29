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

  it('canonicalises to the English URL when no locale is given', () => {
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

  // Every Tamil page used to canonicalise to its English URL, because pages
  // exported a static `metadata` object shared by both locales. Google reads
  // that as "/ta is a duplicate of /" and drops it, which negates the whole
  // bilingual routing feature.
  it('canonicalises a Tamil page to its own URL, not to the English one', () => {
    const ta = alternatesFor('/', 'ta');
    expect(ta.canonical).toBe('https://luxeaxis.com/ta');
    expect(ta.canonical).not.toBe(alternatesFor('/', 'en').canonical);
  });

  it('keeps the English canonical unchanged when the locale is passed explicitly', () => {
    expect(alternatesFor('/', 'en').canonical).toBe('https://luxeaxis.com/');
    expect(alternatesFor('/pricing', 'en').canonical).toBe('https://luxeaxis.com/pricing');
  });

  it('advertises the same alternates regardless of which locale is rendering', () => {
    expect(alternatesFor('/', 'ta').languages).toEqual(alternatesFor('/', 'en').languages);
  });

  it('points x-default at the default locale even while rendering Tamil', () => {
    // x-default names the fallback for unmatched languages, not "this page".
    expect(alternatesFor('/', 'ta').languages['x-default']).toBe('https://luxeaxis.com/');
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
