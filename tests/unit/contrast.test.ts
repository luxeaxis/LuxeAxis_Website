import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/lib/color/contrast';
import tokens from '@/tokens/luxe-axis.tokens.json';

const brand = tokens.color.brand;
const onDark = tokens.color['neutral-on-dark'];
const onLight = tokens.color['neutral-on-light'];

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

  it('pins the luminance coefficients: navy on ivory is 13.67', () => {
    expect(contrastRatio('#0D2B4E', '#FCFAF5')).toBeCloseTo(13.67, 2);
  });
});

describe('colour parsing', () => {
  it('expands 3-digit hex the same as its 6-digit equivalent (#fff vs #ffffff)', () => {
    expect(contrastRatio('#fff', '#000000')).toBeCloseTo(contrastRatio('#ffffff', '#000000'), 6);
  });

  it('expands 3-digit hex the same as its 6-digit equivalent for a non-grey colour', () => {
    expect(contrastRatio('#0d2', '#FCFAF5')).toBeCloseTo(contrastRatio('#00dd22', '#FCFAF5'), 6);
  });

  it('parses rgb(...) — rgb(255, 255, 255) on #000000 gives 21', () => {
    expect(contrastRatio('rgb(255, 255, 255)', '#000000')).toBeCloseTo(21, 1);
  });

  it('parses rgba(...) and ignores its alpha channel', () => {
    expect(contrastRatio('rgba(255, 255, 255, 0.3)', '#000000')).toBeCloseTo(21, 1);
  });

  it('throws on an unparseable colour', () => {
    expect(() => contrastRatio('not-a-colour', '#000000')).toThrow();
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

// The light theme is a shipped, selectable theme. Before these existed, the
// suite asserted seven dark pairings and zero light ones — which is how
// on-surface-muted came to pass AA on navy (5.51:1) and fail it on ivory
// (4.32:1) while both resolved from one semantic role. The semantic tier
// erases per-theme usage caveats, so a role safe in one theme must be safe
// in the other.
describe('verified pairings hold on the light theme too', () => {
  it('navy body text on ivory reaches AAA', () => {
    expect(contrastRatio(onLight.primary.$value, brand.ivory.$value)).toBeGreaterThanOrEqual(7);
  });

  it('secondary text on ivory reaches AAA', () => {
    expect(contrastRatio(onLight.secondary.$value, brand.ivory.$value)).toBeGreaterThanOrEqual(7);
  });

  it('muted text on ivory reaches AA — the role that used to fail here', () => {
    expect(contrastRatio(onLight.tertiary.$value, brand.ivory.$value)).toBeGreaterThanOrEqual(4.5);
  });

  it('the muted role clears AA in BOTH themes, not just one', () => {
    expect(contrastRatio(onDark.tertiary.$value, brand.navy.$value)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(onLight.tertiary.$value, brand.ivory.$value)).toBeGreaterThanOrEqual(4.5);
  });

  it('teal is the accessible accent for text on ivory', () => {
    expect(contrastRatio(brand.teal.$value, brand.ivory.$value)).toBeGreaterThanOrEqual(4.5);
  });

  it('the accent hover state stays AA on ivory', () => {
    expect(contrastRatio(tokens.theme.light['accent-hover'].$value, brand.ivory.$value)).toBeGreaterThanOrEqual(4.5);
  });

  it('the light focus ring is distinguishable against ivory', () => {
    expect(contrastRatio(tokens.theme.light['focus-ring'].$value, brand.ivory.$value)).toBeGreaterThanOrEqual(3);
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
