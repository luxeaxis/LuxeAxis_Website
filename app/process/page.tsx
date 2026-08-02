import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Badge } from '@/components/Badge';
import { SceneSlot } from '@/components/SceneSlot';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getGuarantees, getProcessStages, getTiers } from '@/lib/content/source';

const ROUTE = '/process';

export const metadata: Metadata = {
  title: 'How we work — Luxe Axis',
  description:
    'Seven stages from first conversation to concierge care, with each guarantee attached to the stage where it applies.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/process` (Build Backlog T-18, Spec §5.8) — "the journey along the Axis".
 *
 * The 3D version renders the seven stages as lit nodes descending the Axis with
 * each guarantee writing on beside its node. §5.8's own reduced-motion fallback
 * is "a vertical numbered stepper", which is what this is — built first, so the
 * scene has something to upgrade rather than the fallback being retrofitted.
 *
 * The stage names and their order are the spec's, verbatim: Discover, Audit,
 * Concept, Approve, Build, Handover, Concierge.
 *
 * An `<ol>` because the order is the meaning. A screen reader announcing "list,
 * 7 items" and each stage's position conveys the sequence for free, which is
 * the entire content of this page.
 */
export default async function ProcessPage() {
  const [stages, guarantees, tiers] = await Promise.all([
    getProcessStages(),
    getGuarantees(),
    getTiers(),
  ]);
  const guaranteeById = new Map(guarantees.map((guarantee) => [guarantee.id, guarantee]));

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={8}>
          <Stack gap={4} className="max-w-measure">
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
              How we work
            </p>
            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
              Seven stages, and what we commit to at each
            </h1>
            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
              A project is systematic or it is chaos with good taste. This is the whole sequence,
              start to finish, including the parts that happen after you have moved in.
            </p>
          </Stack>

          {/* Reserved for the Journey scene (§5.8, T-33). Poster today. */}
          <SceneSlot id="journey">
            <span className="sr-only">The seven stages of a Luxe Axis project</span>
          </SceneSlot>
        </Stack>
      </Container>

      <Section
        id="stages"
        eyebrow="The sequence"
        title="From first conversation to concierge care"
      >
        <ol className="flex max-w-measure flex-col gap-8">
          {stages.map((stage, index) => {
            const attached = (stage.guaranteeIds ?? [])
              .map((id) => guaranteeById.get(id))
              .filter((guarantee) => guarantee !== undefined);
            return (
              <li key={stage.id} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="flex h-icon-lg w-icon-lg shrink-0 items-center justify-center rounded-round border-hairline border-accent font-mono text-overline text-accent"
                >
                  {index + 1}
                </span>
                <Stack gap={2}>
                  <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
                    {stage.name}
                  </h3>
                  <p className="text-on-surface-2">{stage.body}</p>
                  {attached.length > 0 && (
                    // §5.8: "each node … with the relevant guarantee attached".
                    // Attached to its stage rather than listed separately,
                    // because a guarantee means more where it applies than in a
                    // block of guarantees at the bottom of the page. Handover
                    // shows two — the timeline commitment is discharged there
                    // and the warranty starts there.
                    <div className="mt-1 flex flex-wrap gap-2">
                      {attached.map((guarantee) => (
                        <Badge key={guarantee.id} tone="accent" icon="check">
                          {guarantee.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Stack>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section
        id="guarantees"
        eyebrow="What we commit to"
        title="The guarantees in full"
      >
        <Grid cols={2} gap={5}>
          {guarantees.map((guarantee) => (
            <div
              key={guarantee.id}
              className="rounded-lg border border-border-subtle bg-surface-raised p-6"
            >
              <Stack gap={3}>
                <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
                  {guarantee.name}
                </h3>
                <p className="text-on-surface-2">{guarantee.summary}</p>
                {/* The per-tier commitments, same as /pricing. Without them this
                    page names the guarantees but not what any of them actually
                    promises you — and the response times inside the warranty
                    terms are what a client reaches for at handover, which is the
                    stage this page is about. */}
                {guarantee.byTier && (
                  <dl className="flex flex-col gap-1 border-l-regular border-accent pl-4 text-small">
                    {tiers.map((tier) =>
                      guarantee.byTier?.[tier.name] ? (
                        <div key={tier.id} className="flex gap-2">
                          <dt className="text-on-surface-muted">{tier.name}</dt>
                          <dd className="text-on-surface">{guarantee.byTier[tier.name]}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                )}
                <p className="text-small text-on-surface-2">
                  {guarantee.terms ?? <ToBePublished label="Full terms" />}
                </p>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      <CTASection />
    </main>
  );
}
