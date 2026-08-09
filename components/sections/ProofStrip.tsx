import { Grid } from '../layout';
import { StatCard } from '../Card';
import { ToBePublished } from '../ToBePublished';
import { Section } from './Section';
import { Stagger } from '../Reveal';
import type { Stat } from '@/lib/content/types';

/**
 * The proof strip (Landing Blueprint §3.5) — borrowed trust, in numbers.
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
        <Stagger
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          items={stats.map((stat) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              label={stat.label}
              decimals={stat.decimals}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          ))}
        />
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
