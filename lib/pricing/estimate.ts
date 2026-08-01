import type { CalculatorConfig, Tier } from '@/lib/content/types';

/**
 * The Fee Calculator's arithmetic, kept apart from its UI so it can be tested
 * against fixtures without rendering anything — and so the one part of this
 * site a visitor will budget against is a pure function with no React in it.
 *
 * Everything here is band-in, band-out. There is no code path that produces a
 * single figure, because the studio cannot honestly quote one before seeing the
 * space; see `CalculatorConfig` in lib/content/types.ts.
 */

export type EstimateInput = {
  areaSqFt: number;
  tier: Tier['name'];
};

export type Estimate = {
  /** Rupees, rounded to `config.roundToNearest`. */
  low: number;
  high: number;
  /** The area actually used, after clamping — surfaced so the UI can tell the
   *  visitor their input was adjusted rather than silently pricing something
   *  they did not ask for. */
  areaUsed: number;
  clamped: boolean;
};

/** Rounds to the nearest `unit`. */
function roundTo(value: number, unit: number): number {
  if (unit <= 0) return Math.round(value);
  return Math.round(value / unit) * unit;
}

/**
 * Clamps rather than rejecting. A visitor typing 50,000 sq ft into a
 * residential calculator has not made a mistake worth an error message — they
 * are outside what this tool covers — and the honest response is to price the
 * top of the range and say so, which `clamped` lets the UI do.
 *
 * Returns `null` for input that cannot mean anything: a non-finite or
 * non-positive area is not a large flat, it is a broken value, and pricing it
 * would put ₹0 on screen dressed as a real estimate.
 */
export function estimate(config: CalculatorConfig, input: EstimateInput): Estimate | null {
  if (!Number.isFinite(input.areaSqFt) || input.areaSqFt <= 0) return null;

  const rate = config.rates[input.tier];
  if (!rate) return null;

  const areaUsed = Math.min(config.area.max, Math.max(config.area.min, input.areaSqFt));

  return {
    low: roundTo(areaUsed * rate.low, config.roundToNearest),
    high: roundTo(areaUsed * rate.high, config.roundToNearest),
    areaUsed,
    clamped: areaUsed !== input.areaSqFt,
  };
}

/** Formats a rupee amount the way PriceTag does — Indian digit grouping, no
 *  paise — so the calculator and the tier cards never disagree on how a number
 *  looks. */
export function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** The estimate as one readable string. Used verbatim as the calculator's
 *  announced result, so it has to make sense read aloud with no surrounding
 *  layout — hence a spelled-out "to" rather than an en dash. */
export function formatEstimate(estimateValue: Estimate): string {
  return `${formatRupees(estimateValue.low)} to ${formatRupees(estimateValue.high)}`;
}
