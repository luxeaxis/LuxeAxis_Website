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
});
