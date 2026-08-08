import type { CalculatorConfig, PropertyBracket } from '@/lib/content/types';

/**
 * The Fee Calculator's arithmetic, kept apart from its UI so it can be tested
 * without rendering anything — and so the one part of this site a visitor
 * budgets against is a pure function with no React in it.
 *
 * There is barely any arithmetic left, and that is the point. An earlier
 * version multiplied a per-square-foot rate band by carpet area, which is the
 * obvious shape for a fee calculator and is not how the studio prices. The
 * published list bands total project cost by property type. Deriving a rate
 * from those bands means dividing a range by a range — a 1BHK lands anywhere
 * between roughly ₹540 and ₹1,500 per square foot depending which ends are
 * picked — so this looks the row up instead of computing one.
 *
 * Everything is band-in, band-out. No code path produces a single figure,
 * because the studio cannot honestly quote one before seeing the space.
 */

export type Estimate = {
  bracket: PropertyBracket;
  /** Whole rupees, straight from the published list. */
  projectCost: { low: number; high: number };
  designFee: { low: number; high: number };
};

/** Looks up a published row. Returns `null` for an id that is not on the list
 *  rather than guessing the nearest one — a visitor shown the wrong band has no
 *  way to tell. */
export function estimate(
  config: CalculatorConfig,
  bracketId: string,
): Estimate | null {
  const bracket = config.brackets.find(
    (candidate) => candidate.id === bracketId,
  );
  if (!bracket) return null;
  return {
    bracket,
    projectCost: bracket.projectCost,
    designFee: bracket.designFee,
  };
}

/** One decimal place, and no trailing `.0` — `3.5L`, but `6L` not `6.0L`. */
function trim(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

/**
 * Formats a rupee amount the way Indian pricing is actually read: lakh and
 * crore above a lakh, plain grouped rupees below.
 *
 * `₹3.5L` rather than `₹3,50,000`, because that is how the studio publishes it
 * and how a Chennai buyer reads it. Falling back to `Intl` under a lakh keeps
 * the subscription prices sensible — `₹2,499`, where "₹0.02L" would be absurd.
 */
export function formatRupees(amount: number): string {
  if (amount >= 10_000_000) return `₹${trim(amount / 10_000_000)}Cr`;
  if (amount >= 100_000) return `₹${trim(amount / 100_000)}L`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** A band as one readable string. Used verbatim as the announced result, so it
 *  has to make sense read aloud with no surrounding layout — hence a spelled-out
 *  "to" rather than an en dash, which screen readers handle inconsistently. */
export function formatBand(band: { low: number; high: number }): string {
  return `${formatRupees(band.low)} to ${formatRupees(band.high)}`;
}

/** The typical area for a row, for orientation. `null` where none is published:
 *  the penthouse row has no area, which is part of why this calculator asks for
 *  property type rather than square feet. */
export function formatArea(bracket: PropertyBracket): string | null {
  if (!bracket.area) return null;
  const grouped = (value: number) => value.toLocaleString('en-IN');
  return bracket.area.max === null
    ? `${grouped(bracket.area.min)}+ sq ft`
    : `${grouped(bracket.area.min)}–${grouped(bracket.area.max)} sq ft`;
}
