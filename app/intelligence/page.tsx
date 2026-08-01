import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { FeatureCard } from '@/components/Card';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getIntelligenceFeatures } from '@/lib/content/source';

const ROUTE = '/intelligence';

export const metadata: Metadata = {
  title: 'The intelligence behind the space — Luxe Axis',
  description:
    'Vastu-Tech, Space Score, Space OS and Virtual Staging — four capabilities that do real work on your project, each one a claim we can show you.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/intelligence` (Build Backlog T-17) — "the tech story hub" (Spec §2.2).
 *
 * A hub, not a pitch: its whole job is to make four capabilities legible and
 * route onward, so it is four cards and a heading rather than a long argument.
 * The detail lives on each feature's own page, which is where a visitor who
 * cares about one of them actually wants to be.
 *
 * The framing sentence is the site's own tagline logic — Spec §1's "space and
 * applied intelligence" — and each card carries the feature's claim, which is
 * the spec's own "Proves:" register: an assertion the studio has to stand
 * behind, not a feature bullet.
 */
export default async function IntelligencePage() {
  const features = await getIntelligenceFeatures();

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Intelligence
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            The intelligence behind the space
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            Four capabilities that do real work on your project. Each one is something we can show
            you working, not a badge on a brochure — and on every one of them, the software
            narrows the question and a designer answers it.
          </p>
        </Stack>
      </Container>

      <Section
        id="capabilities"
        eyebrow="What we have built"
        title="Four capabilities"
        lede="Two are proprietary to the studio, one is the portal you will use for the length of your project, and one is for people selling a space rather than living in it."
      >
        <Grid cols={4} gap={5}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              href={feature.href}
              icon={feature.icon}
              title={feature.name}
              body={feature.claim}
            />
          ))}
        </Grid>
      </Section>

      <CTASection />
    </main>
  );
}
