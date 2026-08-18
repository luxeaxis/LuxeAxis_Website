import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import Image from 'next/image';
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
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { canonicalFor } from '@/lib/seo/hreflang';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { PRICING_HERO_SLIDES } from '@/lib/content/heroSlides';
import {
  getCalculatorConfig,
  getFaqs,
  getGuarantees,
  getSubscriptions,
  getTiers,
} from '@/lib/content/source';
import { formatRupees } from '@/lib/pricing/estimate';

const ROUTE = '/pricing';

export const metadata: Metadata = {
  title: 'Interior Design Cost in Chennai | Transparent BOQ Pricing Packages | Luxe Axis',
  description:
    'No hidden costs. We publish our turnkey interior design rates: Essential (₹1,800/sq.ft), Signature (₹2,800/sq.ft), Elite bespoke villas, interactive BOQ cost calculator, and 10-year warranty in Chennai.',
  keywords: [
    'interior design cost in chennai',
    'interior design price per sq ft chennai',
    'transparent boq interior pricing',
    '2bhk interior cost chennai',
    '3bhk interior design cost chennai',
    'luxury villa interior pricing chennai',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Interior Design Cost in Chennai | Transparent BOQ Pricing | Luxe Axis',
    description:
      'Publishing upfront interior design costs: Essential (₹1,800/sq.ft), Signature (₹2,800/sq.ft), and interactive real-time cost calculator.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/hero-pricing.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis Transparent Interior Pricing Packages Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interior Design Cost & Packages in Chennai | Luxe Axis',
    description:
      'Turnkey interior rates starting ₹1,800/sq.ft. Interactive BOQ calculator & 10-year warranty.',
    images: ['/posters/hero-pricing.png'],
  },
};

export default async function PricingPage() {
  const [tiers, calculatorConfig, guarantees, subscriptions, faqs] =
    await Promise.all([
      getTiers(),
      getCalculatorConfig(),
      getGuarantees(),
      getSubscriptions(),
      getFaqs(),
    ]);
  const allPriced = tiers.every((tier) => tier.priceFrom !== null);

  const highlights = [
    { title: '₹1,800 / sq.ft', desc: 'Essential Luxury Tier' },
    { title: '₹2,800 / sq.ft', desc: 'Signature Bespoke Tier' },
    { title: 'Elite Commission', desc: 'Custom Private Architecture' },
    { title: 'Live Fee Calculator', desc: 'Un-Gated Budget Estimation' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];

  const subPages = [
    {
      title: 'Essential Luxury Tier',
      rate: '₹1,800 / sq.ft',
      desc: 'Complete specifications for modern homes. Blum soft-close hardware, BWP marine plywood, 45-day guaranteed handover.',
      href: '/pricing/essential',
      image: '/posters/pricing-tier-essential.png',
      badge: 'Turnkey',
    },
    {
      title: 'Signature Bespoke Tier',
      rate: '₹2,800 / sq.ft',
      desc: 'Bespoke luxury for penthouses & villas. Italian PU lacquer, Hafele hardware, smart home lighting automation, Signature tier timeline handover.',
      href: '/pricing/signature',
      image: '/posters/pricing-tier-signature.png',
      badge: 'Popular',
    },
    {
      title: 'Elite Private Commission',
      rate: 'Custom BOQ',
      desc: 'Architect-designed private luxury. Imported Calacatta Italian marble, liquid metal joinery, and dedicated principal team.',
      href: '/pricing/elite',
      image: '/posters/pricing-tier-elite.png',
      badge: 'Elite',
    },
    {
      title: 'Interactive Fee Calculator',
      rate: 'Instant Tool',
      desc: 'Calculate your exact interior design cost in Chennai based on carpet area, residence type, and material finishes.',
      href: '/pricing/calculator',
      image: '/posters/pricing-tier-calculator.png',
      badge: 'Tool',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <FaqJsonLd items={faqs} />

      {/* 1. Hero Stage & Breadcrumbs with Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={PRICING_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs path="/pricing" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Radical Financial Transparency
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Most Chennai Studios Hide the Price. <br />
              <span className="text-accent">We Publish It Stated Plainly.</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              No quote-on-request and no discovery call before you can find out
              what a project costs. Estimate your project budget online,
              evaluate our three structured investment tiers, and review
              contractual guarantees.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#calculator" size="lg" className="shadow-2xl">
                Estimate Project Budget
              </Button>
              <Button
                as="a"
                href="#tiers"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View Investment Tiers →
              </Button>
            </div>

            {/* Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="p-4 rounded-xl lx-liquid-glass-card border border-accent/20"
                >
                  <strong className="block font-display text-h3 text-accent font-bold">
                    {h.title}
                  </strong>
                  <span className="text-overline text-on-surface-muted uppercase tracking-wider font-semibold">
                    {h.desc}
                  </span>
                </div>
              ))}
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Highlights Strip */}
      <section className="py-6 bg-surface-raised/40 border-b border-border-subtle/40">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {highlights.map((item) => (
              <div key={item.title} className="p-2">
                <strong className="block font-ui text-small font-bold text-accent uppercase tracking-wider">
                  {item.title}
                </strong>
                <span className="text-[12px] text-on-surface-muted mt-0.5 block">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Pricing Sub-Menu Breakdown Cards */}
      <Section
        id="sub-pages"
        eyebrow="Structured Rates & Tools"
        title="Pricing Breakdown & Calculator Tools"
        lede="Explore detailed tier specifications or run an instant floorplan budget calculation."
      >
        <Grid cols={2} gap={6}>
          {subPages.map((sp) => (
            <div
              key={sp.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={sp.image}
                    alt={sp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {sp.badge}
                  </span>
                  <span className="absolute bottom-2 right-2 px-3 py-1 rounded bg-surface-deep/90 text-accent font-display text-small font-bold">
                    {sp.rate}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {sp.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {sp.desc}
                </p>
              </div>
              <Button
                as="a"
                href={sp.href}
                variant="secondary"
                className="w-full justify-center"
              >
                Explore {sp.title} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Interactive Fee Calculator */}
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

      {/* 5. Three Tiers Comparison */}
      <Section
        id="tiers"
        eyebrow="What is included"
        title="Three structured tiers"
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
                  cta={{
                    label: 'See ' + tier.name,
                    href: `/residential/${tier.id}`,
                  }}
                  recommended={tier.recommended}
                />
              ),
            )}
          </Grid>
        ) : (
          <Grid cols={3} gap={6}>
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="lx-liquid-glass rounded-lg border border-border-subtle p-6"
              >
                <Stack gap={4}>
                  <Stack gap={2}>
                    <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
                      {tier.name}
                    </h3>
                    <p className="text-small text-on-surface-2">
                      {tier.summary}
                    </p>
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

      {/* 6. Guarantees */}
      <Section
        id="guarantees"
        eyebrow="What we commit to"
        title="Guarantees, stated plainly"
        lede="A guarantee is only worth the terms attached to it, so ours are published in full rather than merely mentioned."
      >
        <Grid cols={2} gap={5}>
          {guarantees.map((guarantee) => (
            <div
              key={guarantee.id}
              className="lx-liquid-glass rounded-lg border border-border-subtle/50 p-6"
            >
              <Stack gap={3}>
                <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
                  {guarantee.name}
                </h3>
                <p className="text-on-surface-2">{guarantee.summary}</p>
                {guarantee.byTier && (
                  <dl className="flex flex-col gap-1 border-l-regular border-accent pl-4 text-small">
                    {tiers.map((tier) =>
                      guarantee.byTier?.[tier.name] ? (
                        <div key={tier.id} className="flex gap-2">
                          <dt className="text-on-surface-muted">{tier.name}</dt>
                          <dd className="text-on-surface">
                            {guarantee.byTier[tier.name]}
                          </dd>
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

      {/* 7. Concierge Subscriptions */}
      <Section
        id="concierge"
        eyebrow="After you move in"
        title="Concierge, by subscription"
        lede="A finished home keeps needing things. These are published monthly rates rather than a call-us-and-we-will-see."
      >
        <Grid cols={3} gap={5}>
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="lx-liquid-glass rounded-lg border border-border-subtle/50 p-6"
            >
              <Stack gap={3}>
                <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
                  {subscription.name}
                </h3>
                <p className="font-mono text-[length:var(--typography-h3-font-size)] tabular-nums text-on-surface">
                  {formatRupees(subscription.monthly)}
                  <span className="font-ui text-small text-on-surface-2">
                    {' '}
                    / month
                  </span>
                </p>
                {subscription.yearly !== null && (
                  <p className="text-small text-on-surface-muted">
                    or {formatRupees(subscription.yearly)} a year
                  </p>
                )}
                <p className="text-small text-on-surface-2">
                  {subscription.summary}
                </p>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 8. Interactive Before & After Transformation Slider */}
      <Section
        id="transformation"
        eyebrow="Real Project Value"
        title="Renovation Makeover: Before vs After"
        lede="Bare shell space transformed into a luxury residence under fixed BOQ pricing."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/portfolio-chennai-residence-before.png',
              alt: 'Bare shell residence living room before interior fit-out',
            }}
            afterImage={{
              src: '/posters/portfolio-chennai-residence-after.png',
              alt: 'Completed luxury interior by Luxe Axis under fixed BOQ pricing',
            }}
          />
        </div>
      </Section>

      {/* 9. Process */}
      <ProcessSteps />

      {/* 10. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Before you ask"
        title="The questions we get most"
        lede="The real objections, answered plainly."
      >
        <Faq items={faqs} />
      </Section>

      {/* 11. Next Pages Grid */}
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

      {/* 12. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
