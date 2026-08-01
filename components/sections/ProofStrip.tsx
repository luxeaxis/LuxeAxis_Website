import { Grid } from '../layout';
import { StatCard } from '../Card';
import { ToBePublished } from '../ToBePublished';
import { Section } from './Section';
import type { Stat } from '@/lib/content/types';

/**
 * The proof strip (Landing Blueprint §3.5) — borrowed trust, in numbers.
 *
 * The blueprint names the measures it wants — projects delivered, on-time
 * percentage, NPS, referral rate — and publishes none of their values. So the
 * section renders the four measures with an explicit "To be published" against
 * each, rather than either disappearing or inventing figures.
 *
 * The placeholder is the honest middle: it tells a visitor exactly what the
 * studio intends to publish and that it has not yet, which is a true statement.
 * A plausible-looking number would not be — §3.5's whole argument is that trust
 * here is *documentary*, "real faces, real names, real numbers", and an
 * invented figure is indistinguishable from a real one to the reader, which is
 * precisely what makes inventing it unacceptable rather than merely untidy.
 * `tests/unit/sections.test.tsx` asserts no digits appear while the stats are
 * empty, so a placeholder can never quietly become a fake.
 *
 * §3.5 also rules out 3D for this content entirely — rendered proof feels
 * staged and lowers credibility — so this is flat by design, not by omission.
 * The only motion permitted is the count-up, which `StatCard` already
 * implements with the final value in the DOM from first paint.
 */
export function ProofStrip({
  stats,
  pendingLabels,
}: {
  stats: readonly Stat[];
  /** Shown, valueless, while `stats` is empty. */
  pendingLabels: readonly string[];
}) {
  if (stats.length === 0 && pendingLabels.length === 0) return null;

  return (
    <Section id="proof" eyebrow="The record" title="What we have delivered">
      {stats.length > 0 ? (
        <Grid cols={4} gap={5}>
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              label={stat.label}
              decimals={stat.decimals}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          ))}
        </Grid>
      ) : (
        <Grid cols={4} gap={5}>
          {pendingLabels.map((label) => (
            <div
              key={label}
              className="rounded-lg border border-border-subtle bg-surface-raised p-6"
            >
              <p className="text-small text-on-surface-2">{label}</p>
              <p className="mt-2">
                <ToBePublished className="text-small" />
              </p>
            </div>
          ))}
        </Grid>
      )}
    </Section>
  );
}
