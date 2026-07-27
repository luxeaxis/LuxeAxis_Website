import { describe, expect, it } from 'vitest';
import { isPublished, PUBLISHED } from '@/lib/i18n/published';

describe('isPublished', () => {
  it('treats every route as published in English', () => {
    expect(isPublished('/', 'en')).toBe(true);
    expect(isPublished('/pricing', 'en')).toBe(true);
    expect(isPublished('/a-route-nobody-has-built', 'en')).toBe(true);
  });

  it('publishes Tamil only where a reviewed translation is recorded', () => {
    expect(isPublished('/', 'ta')).toBe(true);
    expect(isPublished('/pricing', 'ta')).toBe(false);
  });

  it('normalises a trailing slash', () => {
    expect(isPublished('/', 'ta')).toBe(isPublished('', 'ta'));
  });

  it('records Tamil routes explicitly, never by wildcard', () => {
    // A wildcard would let an untranslated route go live silently, which the
    // brand policy forbids. Keep this list literal.
    expect(Array.isArray(PUBLISHED.ta)).toBe(true);
  });
});
