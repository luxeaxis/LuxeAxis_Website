import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { FeatureCard } from '@/components/Card';
import { SceneSlot } from '@/components/SceneSlot';
import { ToBePublished } from '@/components/ToBePublished';
import { Faq, FaqJsonLd } from '@/components/Faq';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs, getNriRegions, getProcessStages } from '@/lib/content/source';

const ROUTE = '/nri';

export const metadata: Metadata = {
  title: 'Design your Chennai home from anywhere — Luxe Axis',
  description:
    'Remote design for the Tamil diaspora: reviews over video in your time zone, progress and spend visible in Space OS, and a designer on the ground in Chennai.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/nri` (Build Backlog T-18, Spec §5.9) — "Design Chennai from anywhere".
 *
 * The highest-value segment in the strategy: §1.3 sets NRI landing pages a
 * conversion target of ≥5% against ≥3.5% site-wide, and §2.1 names the Tamil
 * diaspora a primary persona. It is also the segment whose objection is the
 * most concrete — "can I run a Chennai project from abroad?" — so the page
 * answers that specific question rather than selling the studio again.
 *
 * §10.8's CTA rule adapts the ask per path: NRI gets "Start your remote design"
 * plus WhatsApp rather than the residential "Book a free design audit". The
 * WhatsApp half cannot ship — no number has been supplied — so it is named as
 * outstanding rather than wired to a placeholder that would fail on the one
 * click this segment is most likely to make.
 *
 * The White-Glove protocol steps (§5.9: "the White-Glove remote protocol steps
 * write on along the arc") are NOT authored here. The spec names the protocol
 * and does not enumerate it, and inventing the steps of a named service
 * protocol would be writing operational commitments the studio has not made.
 * The general process is shown instead, which is real, with the protocol marked
 * as outstanding.
 */
export default async function NriPage() {
  const [regions, stages, faqs] = await Promise.all([
    getNriRegions(),
    getProcessStages(),
    getFaqs(),
  ]);
  // The one FAQ this page's visitor came for, promoted to the top of the list.
  const nriFaqs = [...faqs].sort((a, b) => (a.id === 'abroad' ? -1 : b.id === 'abroad' ? 1 : 0));

  return (
    <main id="main" tabIndex={-1}>
      <FaqJsonLd items={nriFaqs} />

      <Container className="py-section-y">
        <Stack gap={8}>
          <Stack gap={4} className="max-w-measure">
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
              For the diaspora
            </p>
            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
              Design your Chennai home from anywhere
            </h1>
            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
              You do not need to be in the country, or take leave, or trust a relative to supervise
              a site. Reviews happen over video at a time that works where you are, and what is
              happening on site is visible to you as it happens.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="/book-audit" size="lg">
                Start your remote design
              </Button>
            </div>
            {/* §10.8 pairs the NRI CTA with WhatsApp. No number has been
                supplied (components/Footer.tsx carries the same gap), and a
                dead WhatsApp link on the page built for the segment least able
                to phone an office would be worse than none. */}
            <p className="text-small">
              <ToBePublished label="WhatsApp" />
            </p>
          </Stack>

          {/* Reserved for the NRI globe scene (§5.9, T-33). Poster today. */}
          <SceneSlot id="nri-globe">
            <span className="sr-only">An arc from the Tamil diaspora to Chennai</span>
          </SceneSlot>
        </Stack>
      </Container>

      <Section
        id="regions"
        eyebrow="Where our clients are"
        title="Pick where you are"
        lede="Each has its own page with the time difference worked out, so you can see what a review call actually looks like in your week."
      >
        <Grid cols={3} gap={5}>
          {regions.map((region) => (
            <FeatureCard
              key={region.slug}
              href={`/nri/${region.slug}`}
              title={region.name}
              body={`Designing a Chennai home from ${region.name}.`}
            />
          ))}
        </Grid>
      </Section>

      <Section
        id="protocol"
        eyebrow="How remote works"
        title="The White-Glove remote protocol"
        lede="The studio runs a named protocol for remote clients. Its steps are being written up; the underlying process is the same seven stages every project follows."
      >
        <Stack gap={6} className="max-w-measure">
          <p className="text-small">
            <ToBePublished label="The White-Glove protocol, step by step" />
          </p>
          <ol className="flex flex-col gap-4">
            {stages.map((stage, index) => (
              <li key={stage.id} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-icon-lg w-icon-lg shrink-0 items-center justify-center rounded-round border-hairline border-border-subtle font-mono text-overline text-on-surface-muted"
                >
                  {index + 1}
                </span>
                <Stack gap={1}>
                  <h3 className="font-ui font-semibold text-on-surface">{stage.name}</h3>
                  <p className="text-small text-on-surface-2">{stage.body}</p>
                </Stack>
              </li>
            ))}
          </ol>
        </Stack>
      </Section>

      <Section id="faq" eyebrow="Before you ask" title="The questions we get most">
        <Faq items={nriFaqs} />
      </Section>

      <CTASection />
    </main>
  );
}
