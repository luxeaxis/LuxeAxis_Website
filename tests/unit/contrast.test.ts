import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/lib/color/contrast';
import tokens from '@/tokens/luxe-axis.tokens.json';

const brand = tokens.color.brand;
const onDark = tokens.color['neutral-on-dark'];

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });

  it('returns 1 for a colour against itself', () => {
    expect(contrastRatio('#0D2B4E', '#0D2B4E')).toBeCloseTo(1, 2);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#C9A84C', '#0D2B4E')).toBeCloseTo(contrastRatio('#0D2B4E', '#C9A84C'), 4);
  });
});

describe('verified pairings hold', () => {
  it('ivory body text on navy reaches AAA', () => {
    expect(contrastRatio(onDark.primary.$value, brand.navy.$value)).toBeGreaterThanOrEqual(7);
  });

  it('secondary text on navy reaches AAA', () => {
    expect(contrastRatio(onDark.secondary.$value, brand.navy.$value)).toBeGreaterThanOrEqual(7);
  });

  it('ink on gold reaches AAA — this is the primary button', () => {
    expect(contrastRatio(brand.ink.$value, brand.gold.$value)).toBeGreaterThanOrEqual(7);
  });

  it('gold on navy reaches AA for large text and UI', () => {
    expect(contrastRatio(brand.gold.$value, brand.navy.$value)).toBeGreaterThanOrEqual(4.5);
  });

  it('teal-bright is the accessible teal for text on dark', () => {
    expect(contrastRatio(brand['teal-bright'].$value, brand.navy.$value)).toBeGreaterThanOrEqual(4.5);
  });

  it('the focus ring is distinguishable against navy', () => {
    expect(contrastRatio(tokens.theme.dark['focus-ring'].$value, brand.navy.$value)).toBeGreaterThanOrEqual(3);
  });
});

describe('forbidden pairings stay forbidden', () => {
  // These assertions document WHY the usage rules exist. If one starts
  // passing, a primitive moved and the rule needs revisiting — not deleting.
  it('gold text on ivory fails, which is why gold is never body text on light', () => {
    expect(contrastRatio(brand.gold.$value, brand.ivory.$value)).toBeLessThan(4.5);
  });

  it('brand teal on navy fails, which is why teal-bright exists', () => {
    expect(contrastRatio(brand.teal.$value, brand.navy.$value)).toBeLessThan(4.5);
  });
});
