import { describe, expect, it } from 'vitest';
import { estimate, formatEstimate, formatRupees } from '@/lib/pricing/estimate';
import { getCalculatorConfig } from '@/lib/content/source';
import type { CalculatorConfig } from '@/lib/content/types';

/**
 * The Fee Calculator's arithmetic, tested against a FIXTURE rate card.
 *
 * The fixture is not a proposed price list and must never be copied into
 * `lib/content/source.ts`. Round numbers are chosen precisely so they could not
 * be mistaken for real rates and so the expected totals are checkable by hand:
 * 1,000 sq ft at ₹2,000–3,000 is ₹20,00,000–₹30,00,000, which either reads
 * right or does not.
 *
 * This is the one part of the site a visitor will act on financially, so the
 * arithmetic is pinned independently of any UI.
 */
const FIXTURE: CalculatorConfig = {
  area: { min: 500, max: 5000, step: 50 },
  rates: {
    Essential: { low: 1000, high: 2000 },
    Signature: { low: 2000, high: 3000 },
    Elite: { low: 3000, high: 5000 },
  },
  roundToNearest: 1000,
};

describe('estimate', () => {
  it('multiplies area by the tier band', () => {
    const result = estimate(FIXTURE, { areaSqFt: 1000, tier: 'Signature' });
    expect(result).toMatchObject({ low: 2_000_000, high: 3_000_000, areaUsed: 1000, clamped: false });
  });

  it('prices each tier from its own rates', () => {
    const area = 1000;
    expect(estimate(FIXTURE, { areaSqFt: area, tier: 'Essential' })?.low).toBe(1_000_000);
    expect(estimate(FIXTURE, { areaSqFt: area, tier: 'Elite' })?.high).toBe(5_000_000);
  });

  it('always returns a band, never a single figure', () => {
    // The studio cannot honestly quote a point estimate before seeing the
    // space. A config whose low and high converged would be a data error, but
    // the shape of the return value is what stops the UI ever showing one
    // number as though it were the price.
    const result = estimate(FIXTURE, { areaSqFt: 1200, tier: 'Signature' });
    expect(result!.high).toBeGreaterThan(result!.low);
  });

  it('rounds to the configured unit so it reads as an estimate', () => {
    // 733 x 2000 = 1,466,000 and x 3000 = 2,199,000 — both already land on
    // 1000, so pick a rate-crossing area that does not.
    const result = estimate({ ...FIXTURE, roundToNearest: 100_000 }, {
      areaSqFt: 733,
      tier: 'Signature',
    });
    expect(result!.low % 100_000).toBe(0);
    expect(result!.high % 100_000).toBe(0);
  });

  it('clamps an area above the range and says so', () => {
    // Someone typing 50,000 into a residential calculator has not made an error
    // worth an error message — they are outside what the tool covers. Pricing
    // the top of the range and flagging it is the honest answer.
    const result = estimate(FIXTURE, { areaSqFt: 50_000, tier: 'Essential' });
    expect(result).toMatchObject({ areaUsed: 5000, clamped: true });
    expect(result!.low).toBe(5_000_000);
  });

  it('clamps an area below the range and says so', () => {
    const result = estimate(FIXTURE, { areaSqFt: 100, tier: 'Essential' });
    expect(result).toMatchObject({ areaUsed: 500, clamped: true });
  });

  it('does not flag an area exactly on a boundary as clamped', () => {
    expect(estimate(FIXTURE, { areaSqFt: 500, tier: 'Elite' })?.clamped).toBe(false);
    expect(estimate(FIXTURE, { areaSqFt: 5000, tier: 'Elite' })?.clamped).toBe(false);
  });

  it('refuses input that cannot mean anything rather than pricing it at zero', () => {
    // The failure mode this guards: a cleared field yielding NaN, coerced to 0,
    // rendered as "₹0" and read by a visitor as a real quote.
    for (const areaSqFt of [Number.NaN, 0, -250, Number.POSITIVE_INFINITY]) {
      expect(estimate(FIXTURE, { areaSqFt, tier: 'Signature' }), String(areaSqFt)).toBeNull();
    }
  });

  it('scales linearly with area', () => {
    const single = estimate(FIXTURE, { areaSqFt: 1000, tier: 'Signature' })!;
    const double = estimate(FIXTURE, { areaSqFt: 2000, tier: 'Signature' })!;
    expect(double.low).toBe(single.low * 2);
    expect(double.high).toBe(single.high * 2);
  });
});

describe('formatting', () => {
  it('uses Indian digit grouping, matching PriceTag', () => {
    // ₹18,40,000 — not ₹1,840,000. Getting this wrong would make the
    // calculator and the tier cards disagree about what a number looks like.
    expect(formatRupees(1_840_000)).toContain('18,40,000');
  });

  it('shows no paise', () => {
    expect(formatRupees(1_840_000)).not.toContain('.');
  });

  it('reads sensibly aloud, since it is the announced result', () => {
    // The estimate lands in an <output>, which is announced politely. An en
    // dash between two rupee figures is read inconsistently across screen
    // readers; the word "to" is not.
    const formatted = formatEstimate(estimate(FIXTURE, { areaSqFt: 1000, tier: 'Signature' })!);
    expect(formatted).toContain(' to ');
    expect(formatted).not.toMatch(/[–—]/);
  });
});

describe('the shipped configuration', () => {
  it('publishes no rate card until the studio supplies real rates', async () => {
    // Spec §2 names the public fee calculator as a proof of Radical
    // Transparency. It is also the one thing here a visitor will budget
    // against, so an invented rate would not read as a placeholder — it would
    // read as the studio's price. Delete this test when real rates land; do
    // not "fix" it by inventing one.
    expect(await getCalculatorConfig()).toBeNull();
  });
});
