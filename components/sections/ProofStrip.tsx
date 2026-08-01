import { Grid } from '../layout';
import { StatCard } from '../Card';
import { Section } from './Section';
import type { Stat } from '@/lib/content/types';

/**
 * The proof strip (Landing Blueprint §3.5) — borrowed trust, in numbers.
 *
 * Renders NOTHING while `stats` is empty, which is its current state and the
 * most important thing about this file.
 *
 * The blueprint names the measures it wants — projects delivered, on-time
 * percentage, NPS, referral rate — and publishes none of their values. Numbers
 * are the one thing on the page that cannot be approximated: §3.5's whole
 * argument is that trust here is *documentary*, "real faces, real names, real
 * numbers", and a plausible-looking invented figure is indistinguishable from a
 * real one to the visitor, which is precisely what makes inventing it
 * unacceptable rather than merely untidy.
 *
 * A missing section reads as "not published yet". A section of made-up numbers
 * reads as true. So this returns `null` until `lib/content/source.ts` has real
 * figures, at which point the section appears with no change here.
 *
 * §3.5 also rules out 3D for this content entirely — rendered proof feels staged
 * and lowers credibility — so this is flat and photographic by design, not by
 * omission. The only motion permitted is the count-up, which `StatCard` already
 * implements with the final value in the DOM from first paint.
 */
export function ProofStrip({ stats }: { stats: readonly Stat[] }) {
  if (stats.length === 0) return null;

  return (
    <Section
      id="proof"
      eyebrow="The record"
      title="What we have delivered"
    >
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
    </Section>
  );
}
