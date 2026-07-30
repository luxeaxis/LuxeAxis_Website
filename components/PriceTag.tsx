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
  // `Intl.NumberFormat` (not a hand-rolled grouping regex) both places the
  // Indian digit-grouping commas (₹18,40,000, not ₹1,840,000) and emits the
  // rupee sign — no literal "₹" character or grouping logic invented here.
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <p className={cx('flex items-baseline gap-2', className)}>
      <span className="font-mono text-[length:var(--typography-price-font-size)] tabular-nums text-on-surface">
        {formatted}
      </span>
      {period && <span className="font-ui text-small text-on-surface-2">{period}</span>}
    </p>
  );
}
