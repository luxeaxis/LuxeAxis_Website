import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { FeatureCard, TierCard } from '@/components/Card';
import { FeeCalculator } from '@/components/FeeCalculator';
import { Faq, FaqJsonLd } from '@/components/Faq';
import { ToBePublished } from '@/components/ToBePublished';
import { InclusionList } from '@/components/sections/TierSummary';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getCalculatorConfig, getFaqs, getGuarantees, getTiers } from '@/lib/content/source';

const ROUTE = '/pricing';

export const metadata: Metadata = {
  title: 'Pricing — Luxe Axis',
  description:
    'Most Chennai studios hide the price. We publish it: three tiers with what each includes, a fee calculator, and our guarantees stated plainly.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/pricing` (Build Backlog T-18) — previously a one-line stub reading
 * "Pricing".
 *
 * Ordered exactly as Spec §10.4 sets out: hero → Fee Calculator (the star,
 * DOM-first) → what is included per tier → guarantees → FAQ → audit CTA. The
 * calculator comes BEFORE the tier detail deliberately: §2.1's primary persona
 * arrives asking "what will it cost", and making them read three tier cards
 * first answers a question they have not asked yet.
 *
 * Landing Blueprint §3.6 gives the clearest "3D hurts" verdict on the site for
 * this page — price-anxious visitors want fast, scannable, honest numbers, and
 * spectacle around a price signals that something is being hidden. So there is
 * no scene slot here at all: not a poster, not a reserved box.
 */
export default async function PricingPage() {
  const [tiers, calculatorConfig, guarantees, faqs] = await Promise.all([
    getTiers(),
    getCalculatorConfig(),
    getGuarantees(),
    getFaqs(),
  ]);
  const allPriced = tiers.every((tier) => tier.priceFrom !== null);

  return (
    <main id="main" tabIndex={-1}>
      <FaqJsonLd items={faqs} />

      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Radical transparency
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            Most Chennai studios hide the price. We publish it.
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            No quote-on-request, and no discovery call before you can find out what a project
            costs. Estimate yours below, then see exactly what each tier includes.
          </p>
        </Stack>
      </Container>

      <Section
        id="calculator"
        eyebrow="See your price"
        title="Estimate your project"
        lede="Two inputs, an instant band. No email gate."
      >
        <div className="max-w-measure">
          {calculatorConfig ? (
            <FeeCalculator config={calculatorConfig} />
          ) : (
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

      <Section
        id="tiers"
        eyebrow="What is included"
        title="Three tiers"
        lede="Every tier includes design, drawings and a Vastu-Tech check. They differ in how far the studio takes delivery, and in the materials and detailing you get."
      >
        {allPriced ? (
          <Grid cols={3} gap={5}>
            {tiers.map((tier) =>
              tier.priceFrom === null ? null : (
                <TierCard
                  key={tier.id}
                  name={tier.name}
                  price={{ amount: tier.priceFrom, period: 'onwards' }}
                  inclusions={tier.inclusions}
                  cta={{ label: 'See ' + tier.name, href: `/residential/${tier.id}` }}
                  recommended={tier.recommended}
                />
              ),
            )}
          </Grid>
        ) : (
          // Full inclusions without invented figures. This page's own heading
          // claims the studio publishes its prices, so a placeholder number
          // here would be the most self-refuting thing on the site.
          <Grid cols={3} gap={6}>
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="rounded-lg border border-border-subtle bg-surface-raised p-6"
              >
                <Stack gap={4}>
                  <Stack gap={2}>
                    <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
                      {tier.name}
                    </h3>
                    <p className="text-small text-on-surface-2">{tier.summary}</p>
                  </Stack>
                  <p className="text-small">
                    <ToBePublished label="Fee band" />
                  </p>
                  <InclusionList inclusions={tier.inclusions} />
                  <Button
                    as="a"
                    href={`/residential/${tier.id}`}
                    variant="secondary"
                    className="w-full"
                  >
                    See {tier.name}
                  </Button>
                </Stack>
              </div>
            ))}
          </Grid>
        )}
      </Section>

      <Section
        id="guarantees"
        eyebrow="What we commit to"
        title="Guarantees, stated plainly"
        lede="A guarantee is only worth the terms attached to it, so both of ours are published rather than merely mentioned."
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
                {/* A guarantee is a contractual promise, and its conditions are
                    the part that matters. No spec states them, so the terms are
                    named as outstanding rather than drafted here — plausible
                    terms would commit the studio to an obligation a visitor
                    could later hold them to. */}
                <p className="text-small">
                  {guarantee.terms ?? <ToBePublished label="Full terms" />}
                </p>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      <Section
        id="faq"
        eyebrow="Before you ask"
        title="The questions we get most"
        lede="The real objections, answered plainly."
      >
        <Faq items={faqs} />
      </Section>

      <Section id="next" eyebrow="Where next" title="Read on">
        <Grid cols={3} gap={5}>
          <FeatureCard
            href="/process"
            icon="check"
            title="How we work"
            body="The seven stages of a project, and which guarantee attaches where."
          />
          <FeatureCard
            href="/residential"
            icon="layers"
            title="Residential"
            body="The three tiers in full, with what each one covers."
          />
          <FeatureCard
            href="/intelligence"
            icon="compass"
            title="Intelligence"
            body="What the software actually does on your project."
          />
        </Grid>
      </Section>

      <CTASection />
    </main>
  );
}
