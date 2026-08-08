import { describe, expect, it } from 'vitest';
import {
  estimate,
  formatArea,
  formatBand,
  formatRupees,
} from '@/lib/pricing/estimate';
import { getCalculatorConfig, getTiers } from '@/lib/content/source';
import type { CalculatorConfig } from '@/lib/content/types';

/**
 * The Fee Calculator's lookup and formatting.
 *
 * Unlike most tests here, these run against the REAL published price list
 * rather than a fixture. The list is now real content, and the thing worth
 * guarding is that what the site displays matches what the studio published —
 * a fixture would prove the code works while saying nothing about the numbers
 * a visitor actually sees.
 */

const FIXTURE: CalculatorConfig = {
  brackets: [
    {
      id: 'test',
      label: 'Test',
      area: { min: 100, max: 200 },
      tiers: ['Essential'],
      projectCost: { low: 100_000, high: 200_000 },
      designFee: { low: 10_000, high: 20_000 },
    },
  ],
};

describe('estimate', () => {
  it('returns the published row, unmodified', async () => {
    const config = (await getCalculatorConfig())!;
    const result = estimate(config, '2bhk')!;
    expect(result.projectCost).toEqual({ low: 700_000, high: 1_500_000 });
    expect(result.designFee).toEqual({ low: 75_000, high: 180_000 });
  });

  it('refuses an unknown row rather than guessing the nearest', () => {
    // A visitor shown the wrong band has no way to tell.
    expect(estimate(FIXTURE, 'nope')).toBeNull();
  });

  it('always returns a band, never a single figure', async () => {
    // The studio cannot honestly quote a point estimate before seeing the
    // space, so there is no code path that produces one.
    const config = (await getCalculatorConfig())!;
    for (const bracket of config.brackets) {
      const result = estimate(config, bracket.id)!;
      expect(result.projectCost.high, bracket.id).toBeGreaterThan(
        result.projectCost.low,
      );
      expect(result.designFee.high, bracket.id).toBeGreaterThan(
        result.designFee.low,
      );
    }
  });
});

describe('the published price list', () => {
  it('matches what the studio published, row for row', async () => {
    const config = (await getCalculatorConfig())!;
    const rows = config.brackets.map((b) => [
      b.label,
      b.projectCost.low,
      b.projectCost.high,
      b.designFee.low,
      b.designFee.high,
    ]);
    expect(rows).toEqual([
      ['1BHK', 350_000, 600_000, 50_000, 75_000],
      ['2BHK', 700_000, 1_500_000, 75_000, 180_000],
      ['3BHK', 1_200_000, 2_500_000, 150_000, 350_000],
      ['Villa', 2_500_000, 8_000_000, 300_000, 1_200_000],
      ['Penthouse', 6_000_000, 20_000_000, 800_000, 2_500_000],
    ]);
  });

  it('keeps the design fee inside the project cost', () => {
    // The fee is charged WITHIN the total, not on top. A row where the fee
    // exceeded the project cost would be a transcription error, and the page
    // presents them as nested.
    return getCalculatorConfig().then((config) => {
      for (const bracket of config!.brackets) {
        expect(bracket.designFee.high, bracket.label).toBeLessThan(
          bracket.projectCost.high,
        );
      }
    });
  });

  it('gives every row at least one tier, and only real tier names', async () => {
    const names = (await getTiers()).map((tier) => tier.name);
    const config = (await getCalculatorConfig())!;
    for (const bracket of config.brackets) {
      expect(bracket.tiers.length, bracket.label).toBeGreaterThan(0);
      for (const tier of bracket.tiers) expect(names).toContain(tier);
    }
  });

  it('agrees with each tier’s published floor', async () => {
    // `Tier.priceFrom` and the price list are two statements of the same fact.
    // The cheapest row a tier appears on must not be below that tier's floor,
    // or the tier cards and the calculator would contradict each other on the
    // same page.
    const config = (await getCalculatorConfig())!;
    for (const tier of await getTiers()) {
      const rows = config.brackets.filter((b) => b.tiers.includes(tier.name));
      const cheapest = Math.min(...rows.map((b) => b.projectCost.low));
      expect(tier.priceFrom, tier.name).toBe(cheapest);
    }
  });
});

describe('formatting', () => {
  it('reads the way Indian pricing is written', () => {
    expect(formatRupees(350_000)).toBe('₹3.5L');
    expect(formatRupees(600_000)).toBe('₹6L');
    expect(formatRupees(20_000_000)).toBe('₹2Cr');
  });

  it('drops a trailing .0 rather than printing ₹6.0L', () => {
    expect(formatRupees(2_500_000)).toBe('₹25L');
  });

  it('falls back to grouped rupees below a lakh, for subscription prices', () => {
    // "₹0.02L" would be absurd for a monthly fee.
    expect(formatRupees(2_499)).toContain('2,499');
    expect(formatRupees(2_499)).not.toContain('L');
  });

  it('spells out "to", since the band is read aloud', () => {
    // An en dash between two figures is announced inconsistently across screen
    // readers; the word is not.
    const band = formatBand({ low: 350_000, high: 600_000 });
    expect(band).toBe('₹3.5L to ₹6L');
    expect(band).not.toMatch(/[–—]/);
  });

  it('shows an open-ended area as "2,000+ sq ft"', async () => {
    const config = (await getCalculatorConfig())!;
    const villa = config.brackets.find((b) => b.id === 'villa')!;
    expect(formatArea(villa)).toBe('2,000+ sq ft');
  });

  it('shows no area for a row that publishes none', async () => {
    // The penthouse row has no area — it is not a size category, which is part
    // of why this calculator asks for property type rather than square feet.
    const config = (await getCalculatorConfig())!;
    const penthouse = config.brackets.find((b) => b.id === 'penthouse')!;
    expect(formatArea(penthouse)).toBeNull();
  });
});
