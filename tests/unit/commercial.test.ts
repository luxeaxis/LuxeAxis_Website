import { describe, expect, it } from 'vitest';
import {
  COMMERCIAL_RATES,
  COMMERCIAL_VERTICALS,
  ratesFor,
} from '@/lib/content/commercial';

/**
 * The commercial rate card.
 *
 * These are published prices: a visitor reads them, and a salesperson has to
 * honour them. A transposed digit here is not a rendering bug, it is a number
 * the studio is now standing behind. So the figures are asserted literally
 * rather than by property — the point is to fail when someone edits one, which
 * a structural test would sail past.
 */
describe('commercial rates', () => {
  it('publishes the office bands as supplied', () => {
    expect(
      COMMERCIAL_RATES.find((rate) => rate.id === 'small-office'),
    ).toMatchObject({
      area: { min: 500, max: 1_000 },
      perSqFt: { low: 100, high: 150 },
      executionMargin: 0.15,
      designFee: { low: 150_000, high: 450_000 },
      conceptFee: null,
    });
    expect(
      COMMERCIAL_RATES.find((rate) => rate.id === 'mid-office'),
    ).toMatchObject({
      area: { min: 1_000, max: 5_000 },
      perSqFt: { low: 120, high: 200 },
      executionMargin: 0.15,
      designFee: { low: 300_000, high: 2_000_000 },
    });
    expect(
      COMMERCIAL_RATES.find((rate) => rate.id === 'large-office'),
    ).toMatchObject({
      area: { min: 5_000, max: 20_000 },
      perSqFt: { low: 150, high: 250 },
      executionMargin: 0.12,
      designFee: { low: 1_500_000, high: 10_000_000 },
    });
  });

  it('publishes the concept fee on the segments that carry one', () => {
    // Retail, restaurants and clinics are quoted a fixed sum before per-area
    // work starts; offices are not. Getting this backwards would either invent
    // a charge or hide a real one.
    expect(COMMERCIAL_RATES.find((rate) => rate.id === 'retail')).toMatchObject(
      {
        conceptFee: 200_000,
        perSqFt: { low: 150, high: 250 },
        designFee: { low: 300_000, high: 700_000 },
      },
    );
    expect(
      COMMERCIAL_RATES.find((rate) => rate.id === 'restaurant'),
    ).toMatchObject({
      conceptFee: 300_000,
      perSqFt: { low: 200, high: 350 },
      designFee: { low: 500_000, high: 2_000_000 },
    });
    expect(COMMERCIAL_RATES.find((rate) => rate.id === 'clinic')).toMatchObject(
      {
        conceptFee: 200_000,
        perSqFt: { low: 150, high: 300 },
        designFee: { low: 400_000, high: 1_800_000 },
      },
    );

    for (const rate of COMMERCIAL_RATES) {
      const isOffice = rate.vertical === 'workplace';
      expect(rate.conceptFee === null).toBe(isOffice);
    }
  });

  it('keeps every band the right way round', () => {
    // A band whose low exceeds its high renders as "₹4L to ₹1L", which reads as
    // carelessness on the page whose entire argument is that the studio is
    // straight about money.
    for (const rate of COMMERCIAL_RATES) {
      expect(rate.perSqFt.low).toBeLessThan(rate.perSqFt.high);
      expect(rate.designFee.low).toBeLessThan(rate.designFee.high);
      if (rate.area) expect(rate.area.min).toBeLessThan(rate.area.max);
    }
  });

  it('attaches every rate to a vertical that has a page', () => {
    // A rate pointing at a slug with no route is a rate nobody can read.
    const slugs = new Set(
      COMMERCIAL_VERTICALS.map((vertical) => vertical.slug),
    );
    for (const rate of COMMERCIAL_RATES) {
      expect(slugs.has(rate.vertical)).toBe(true);
    }
  });

  it('gives every vertical at least one published rate', () => {
    // Inverted from what this would have asserted a week ago. Every vertical
    // page now states a price, so "this one is still blank" is the failure.
    for (const vertical of COMMERCIAL_VERTICALS) {
      expect(ratesFor(vertical.slug).length).toBeGreaterThan(0);
    }
  });

  it('does not publish the internal discount authority', () => {
    // The studio's approval bands for discounting are sales policy: telling a
    // prospect how far a rate can be pushed hands them the negotiation. They
    // are deliberately absent from the content layer, and this test is here so
    // that stays a decision rather than an oversight.
    const serialised = JSON.stringify(COMMERCIAL_RATES);
    expect(serialised).not.toMatch(/discount/i);
    expect(serialised).not.toMatch(/approval/i);
  });
});
