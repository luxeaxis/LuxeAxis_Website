import { describe, expect, it } from 'vitest';
import { NAV_ITEMS, BOOK_AUDIT } from '@/lib/nav';

describe('nav data', () => {
  it('caps top-level items at six (Home + 5 category sections + 1 CTA)', () => {
    expect(NAV_ITEMS.length).toBeLessThanOrEqual(6);
  });

  it('every item has a non-empty label and an absolute, root-relative route', () => {
    for (const item of [...NAV_ITEMS, BOOK_AUDIT]) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.startsWith('/')).toBe(true);
      expect(item.href.startsWith('/en')).toBe(false);
    }
  });

  it('the CTA label matches the spec verbatim ("Book Audit")', () => {
    expect(BOOK_AUDIT.label).toBe('Book Audit');
    expect(BOOK_AUDIT.href).toBe('/book-audit');
  });
});
