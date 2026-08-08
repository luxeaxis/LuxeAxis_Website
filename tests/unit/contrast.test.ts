import { describe, expect, it } from 'vitest';
import { compositeOver, contrastRatio } from '@/lib/color/contrast';
import tokens from '@/tokens/luxe-axis.tokens.json';

const brand = tokens.color.brand;
const onDark = tokens.color['neutral-on-dark'];
const onLight = tokens.color['neutral-on-light'];
const status = tokens.color.status;

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });

  it('returns 1 for a colour against itself', () => {
    expect(contrastRatio('#0D2B4E', '#0D2B4E')).toBeCloseTo(1, 2);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#C9A84C', '#0D2B4E')).toBeCloseTo(
      contrastRatio('#0D2B4E', '#C9A84C'),
      4,
    );
  });

  it('pins the luminance coefficients: navy on ivory is 13.67', () => {
    expect(contrastRatio('#0D2B4E', '#FCFAF5')).toBeCloseTo(13.67, 2);
  });
});

describe('colour parsing', () => {
  it('expands 3-digit hex the same as its 6-digit equivalent (#fff vs #ffffff)', () => {
    expect(contrastRatio('#fff', '#000000')).toBeCloseTo(
      contrastRatio('#ffffff', '#000000'),
      6,
    );
  });

  it('expands 3-digit hex the same as its 6-digit equivalent for a non-grey colour', () => {
    expect(contrastRatio('#0d2', '#FCFAF5')).toBeCloseTo(
      contrastRatio('#00dd22', '#FCFAF5'),
      6,
    );
  });

  it('parses rgb(...) — rgb(255, 255, 255) on #000000 gives 21', () => {
    expect(contrastRatio('rgb(255, 255, 255)', '#000000')).toBeCloseTo(21, 1);
  });

  it('parses rgba(...) and ignores its alpha channel', () => {
    expect(contrastRatio('rgba(255, 255, 255, 0.3)', '#000000')).toBeCloseTo(
      21,
      1,
    );
  });

  it('throws on an unparseable colour', () => {
    expect(() => contrastRatio('not-a-colour', '#000000')).toThrow();
  });
});

describe('verified pairings hold', () => {
  it('ivory body text on navy reaches AAA', () => {
    expect(
      contrastRatio(onDark.primary.$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(7);
  });

  it('secondary text on emerald reaches AA', () => {
    expect(
      contrastRatio(onDark.secondary.$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('ink on gold reaches AAA — this is the primary button', () => {
    expect(
      contrastRatio(brand.ink.$value, brand.gold.$value),
    ).toBeGreaterThanOrEqual(7);
  });

  it('gold on navy reaches AA for large text and UI', () => {
    expect(
      contrastRatio(brand.gold.$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('teal-bright is the accessible teal for text on dark', () => {
    expect(
      contrastRatio(brand['teal-bright'].$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('the focus ring is distinguishable against navy', () => {
    expect(
      contrastRatio(
        tokens.theme.dark['focus-ring'].$value,
        brand.emerald.$value,
      ),
    ).toBeGreaterThanOrEqual(3);
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
    expect(
      contrastRatio(onLight.primary.$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(7);
  });

  it('secondary text on ivory reaches AAA', () => {
    expect(
      contrastRatio(onLight.secondary.$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(7);
  });

  it('muted text on ivory reaches AA — the role that used to fail here', () => {
    expect(
      contrastRatio(onLight.tertiary.$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('the muted role clears AA in BOTH themes, not just one', () => {
    expect(
      contrastRatio(onDark.tertiary.$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(onLight.tertiary.$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

// A surface role is not one colour. `bg-surface-raised` is a card, and a card
// is the most common thing to put muted text inside — so a text role verified
// only against the base surface is verified against the easiest case and
// nothing else. on-surface-muted shipped at #BFAEA0 on exactly that reasoning:
// 5.41:1 on the base surface, 4.13:1 on a card, and axe on /style was the only
// thing in the whole stack that noticed.
//
// Each theme is checked against its WORST surface for that ramp's direction:
// light text is hardest on the lightest dark surface, dark text on the darkest
// light one.
describe('the text ramp clears AA on every surface it can land on, not just the base', () => {
  const darkSurfaces = {
    'surface-deep': brand['emerald-900'].$value,
    surface: brand.emerald.$value,
    'surface-raised': brand['emerald-700'].$value,
  };
  const lightSurfaces = {
    'surface-raised': brand['ivory-hi'].$value,
    surface: brand.ivory.$value,
    'surface-deep': brand['ivory-sunken'].$value,
  };

  for (const [name, bg] of Object.entries(darkSurfaces)) {
    it(`every dark-theme text role clears AA on ${name}`, () => {
      for (const role of ['primary', 'secondary', 'tertiary'] as const) {
        expect(
          contrastRatio(onDark[role].$value, bg),
          `${role} on ${name}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });
  }

  for (const [name, bg] of Object.entries(lightSurfaces)) {
    it(`every light-theme text role clears AA on ${name}`, () => {
      for (const role of ['primary', 'secondary', 'tertiary'] as const) {
        expect(
          contrastRatio(onLight[role].$value, bg),
          `${role} on ${name}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
});

// The ramp has to actually be a ramp. `on-light.tertiary` once measured
// 9.13:1 against `on-light.secondary`'s 7.30:1 — the "muted" role rendering
// with MORE contrast than the role above it, so emphasis ran backwards and no
// contrast assertion could see it, since running backwards is not a failure of
// any minimum.
describe('the text ramp descends', () => {
  it('primary > secondary > tertiary on dark', () => {
    const [p, s, t] = (['primary', 'secondary', 'tertiary'] as const).map(
      (role) => contrastRatio(onDark[role].$value, brand.emerald.$value),
    );
    expect(p).toBeGreaterThan(s!);
    expect(s).toBeGreaterThan(t!);
  });

  it('primary > secondary > tertiary on light', () => {
    const [p, s, t] = (['primary', 'secondary', 'tertiary'] as const).map(
      (role) => contrastRatio(onLight[role].$value, brand.ivory.$value),
    );
    expect(p).toBeGreaterThan(s!);
    expect(s).toBeGreaterThan(t!);
  });

  it('teal is the accessible accent for text on ivory', () => {
    expect(
      contrastRatio(brand.teal.$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('the accent hover state stays AA on ivory', () => {
    expect(
      contrastRatio(
        tokens.theme.light['accent-hover'].$value,
        brand.ivory.$value,
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('the light focus ring is distinguishable against ivory', () => {
    expect(
      contrastRatio(
        tokens.theme.light['focus-ring'].$value,
        brand.ivory.$value,
      ),
    ).toBeGreaterThanOrEqual(3);
  });
});

// `error`/`success` were promoted from the `color.status.*` primitive tier
// into `theme.dark`/`theme.light` (and the `semantic` colour roles) for
// Field's validation states (§3.4) — see tokens/luxe-axis.tokens.json's
// `theme.dark.error`/`theme.light.error` (and `.success`) comments. Field is
// the first consumer; Toast and Inline-alert are the next ones. Both
// pairings were verified by hand at promotion time (error-on-dark 5.540,
// error-on-light 6.289, success-on-dark 7.502, success-on-light 5.125) but
// had no assertion here — this project has already shipped two drifted
// contrast claims that prose asserted and computation disproved (the
// on-surface-muted history documented above), so a promoted role with zero
// gate coverage is exactly the hole that repeats that mistake a third time.
describe('the promoted error/success roles clear AA on their own surface', () => {
  // `theme.dark.error`/`theme.light.error` (and `.success`) are DTCG
  // references (`{color.status.error-on-dark}`) in the raw token JSON this
  // file imports directly — unlike `tokens.theme.dark['focus-ring']` etc.
  // above, which are authored as literal hex values, these only resolve to
  // a literal once the build (style-dictionary) runs. Asserting against the
  // `color.status.*` primitive tier they alias is the same check the built
  // CSS variable would embody, without needing the build step in this test.
  it('error on dark clears AA against navy', () => {
    expect(
      contrastRatio(status['error-on-dark'].$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('error on light clears AA against ivory', () => {
    expect(
      contrastRatio(status['error-on-light'].$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('success on dark clears AA against navy', () => {
    expect(
      contrastRatio(status['success-on-dark'].$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('success on light clears AA against ivory', () => {
    expect(
      contrastRatio(status['success-on-light'].$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

// `warning`/`info` were promoted the same way, for the feedback/status set
// (§3.5) — Badge/InlineAlert/Toast's warning and info tones. Same reasoning
// as the block above: a promoted role with zero gate coverage is the exact
// hole `on-surface-muted`'s history (documented above) already showed this
// project repeats without one.
describe('the promoted warning/info roles clear AA on their own surface', () => {
  it('warning on dark clears AA against navy', () => {
    expect(
      contrastRatio(status['warning-on-dark'].$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('warning on light clears AA against ivory', () => {
    expect(
      contrastRatio(status['warning-on-light'].$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('info on dark clears AA against navy', () => {
    expect(
      contrastRatio(status['info-on-dark'].$value, brand.emerald.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('info on light clears AA against ivory', () => {
    expect(
      contrastRatio(status['info-on-light'].$value, brand.ivory.$value),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

// Every assertion above measures a text role against `surface`. But components
// do not only render on surface — `--field-bg` is a translucent overlay, so text
// inside a Field sits on surface COMPOSITED with that overlay, which is slightly
// darker. The suite passed while the real rendered contrast was below AA: the
// muted role measured 4.51:1 on ivory but 4.27:1 on the composited field
// background, and only axe on /style caught it. These close that gap.
describe('text roles clear AA on composited surfaces, not just on surface', () => {
  const darkField = compositeOver(
    tokens.theme.dark['field-bg'].$value,
    brand.emerald.$value,
  );
  const lightField = compositeOver(
    tokens.theme.light['field-bg'].$value,
    brand.ivory.$value,
  );

  it('composites a translucent overlay to the value the browser actually paints', () => {
    expect(lightField).toBe('rgb(226, 221, 212)');
  });

  it('primary text clears AAA on the field background in both themes', () => {
    expect(
      contrastRatio(onDark.primary.$value, darkField),
    ).toBeGreaterThanOrEqual(7);
    expect(
      contrastRatio(onLight.primary.$value, lightField),
    ).toBeGreaterThanOrEqual(7);
  });

  it('secondary text clears AA on the field background in both themes', () => {
    // Field's "(required)" marker uses this role precisely because muted does
    // not survive the composite on light.
    expect(
      contrastRatio(onDark.secondary.$value, darkField),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(onLight.secondary.$value, lightField),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('the error role stays legible on the field background it borders', () => {
    expect(
      contrastRatio(status['error-on-dark'].$value, darkField),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(status['error-on-light'].$value, lightField),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

describe('forbidden pairings stay forbidden', () => {
  // These assertions document WHY the usage rules exist. If one starts
  // passing, a primitive moved and the rule needs revisiting — not deleting.
  it('gold text on ivory fails, which is why gold is never body text on light', () => {
    expect(contrastRatio(brand.gold.$value, brand.ivory.$value)).toBeLessThan(
      4.5,
    );
  });

  it('brand teal on navy fails, which is why teal-bright exists', () => {
    expect(contrastRatio(brand.teal.$value, brand.emerald.$value)).toBeLessThan(
      4.5,
    );
  });
});
