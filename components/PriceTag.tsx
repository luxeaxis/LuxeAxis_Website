/**
 * PriceTag — the mono, tabular-figure price band Tier cards need (design
 * system §1.3 "price" type, §3.2 "price band (`price` type)"). A Server
 * Component: pure formatting, no state or handlers.
 *
 * The amount and period are always CALLER-supplied data (same division of
 * responsibility as Field's `error`/`success` strings) — this component
 * never invents a figure. `/style`'s Cards specimen makes that explicit with
 * a round, obviously-placeholder amount and an "Illustrative" label next to
 * it, per the brief's "no fabricated prices" rule.
 */

import { formatRupees } from '@/lib/pricing/estimate';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export type PriceTagProps = {
  /** Amount in INR (rupees, not paise). */
  amount: number;
  /** e.g. "/ month", "onwards", "one-time" — rendered after the figure in a
   *  smaller, non-mono weight so it reads as a qualifier, not part of the
   *  number. */
  period?: string;
  className?: string;
};

export function PriceTag({ amount, period, className }: PriceTagProps) {
  // Shared with the Fee Calculator via `formatRupees`, deliberately. This used
  // to call `Intl.NumberFormat` directly, which grouped correctly (₹3,50,000,
  // not ₹350,000) but read differently from the calculator's lakh notation —
  // so /pricing showed the same tier as "₹3,50,000" on its card and "₹3.5L" in
  // the calculator, a few hundred pixels apart. One formatter, one reading.
  const formatted = formatRupees(amount);

  return (
    <p className={cx('flex items-baseline gap-2', className)}>
      <span className="font-mono text-[length:var(--typography-price-font-size)] tabular-nums text-on-surface">
        {formatted}
      </span>
      {period && <span className="font-ui text-small text-on-surface-2">{period}</span>}
    </p>
  );
}
