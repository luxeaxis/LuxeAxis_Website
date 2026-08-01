import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { FeatureCard, TierCard } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { FeeCalculator } from '@/components/FeeCalculator';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getCalculatorConfig, getTiers } from '@/lib/content/source';

const ROUTE = '/residential';

export const metadata: Metadata = {
  title: 'Residential interior design in Chennai — Luxe Axis',
  description:
    'Three tiers of residential interior design, stated openly with what each one includes. Estimate your project, then book a free design audit.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/residential` (Build Backlog T-15) — the path Spec §2.1 routes its primary
 * persona down: "Home → Residential → Fee Calculator → Audit". So the page is
 * ordered as that journey rather than as a brochure: what the tiers are, what
 * it costs, then the ask.
 *
 * The tier cards degrade exactly as the home page's pricing teaser does — real
 * `TierCard`s with price bands once every tier has a figure, and the tier
 * structure without invented numbers until then. Both branches link on to the
 * tier's own page, so which branch renders never changes what is reachable.
 */
export default async function ResidentialPage() {
  const [tiers, calculatorConfig] = await Promise.all([getTiers(), getCalculatorConfig()]);
  const allPriced = tiers.every((tier) => tier.priceFrom !== null);

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Residential
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            Your home, designed to a published price
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            Three tiers, each with its scope written down. Pick the one that fits, see what it
            costs, and talk to a designer before committing to anything.
          </p>
        </Stack>
      </Container>

      <Section
        id="tiers"
        eyebrow="What we offer"
        title="Three tiers"
        lede="Every tier includes design, drawings and a Vastu-Tech check. They differ in how far the studio takes delivery, and in the materials and detailing you get."
      >
        <Grid cols={3} gap={5}>
          {tiers.map((tier) =>
            allPriced && tier.priceFrom !== null ? (
              <TierCard
                key={tier.id}
                name={tier.name}
                price={{ amount: tier.priceFrom, period: 'onwards' }}
                inclusions={tier.inclusions}
                cta={{ label: 'See ' + tier.name, href: `/residential/${tier.id}` }}
                recommended={tier.recommended}
              />
            ) : (
              <FeatureCard
                key={tier.id}
                href={`/residential/${tier.id}`}
                title={tier.name}
                body={tier.summary}
              />
            ),
          )}
        </Grid>
      </Section>

      <Section
        id="calculator"
        eyebrow="See your price"
        title="Estimate your project"
        lede="Two inputs, an instant band. No email gate, and no callback before you can find out what it costs."
      >
        <div className="max-w-measure">
          {calculatorConfig ? (
            <FeeCalculator config={calculatorConfig} />
          ) : (
            // The section is named so the visitor knows it is coming, but the
            // calculator itself does not render without real rates. This is the
            // one component on the site a visitor acts on financially — they
            // budget against the number it returns — so an invented rate would
            // not read as a placeholder, it would read as the studio's price.
            // See lib/content/source.ts.
            <EmptyState
              icon="gauge"
              title="The fee calculator is not live yet"
              body="We publish our rates rather than quoting privately, and the calculator goes up as soon as the current rate card is signed off. Ask us for an indicative figure in the meantime."
              headingAs="h3"
              action={
                <Button as="a" href="/book-audit" variant="secondary">
                  Book an audit
                </Button>
              }
            />
          )}
        </div>
      </Section>

      <CTASection />
    </main>
  );
}
