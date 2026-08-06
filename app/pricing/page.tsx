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
  title: 'Pricing & Transparent Investment Tiers | Luxe Axis',
  description:
    'Most Chennai studios hide the price. We publish it: Essential (₹1,800/sq.ft), Signature (₹2,800/sq.ft), Elite commissions, interactive fee calculator, and 10-year warranty.',
  alternates: canonicalFor(ROUTE),
};

export default async function PricingPage() {
  const [tiers, calculatorConfig, guarantees, subscriptions, faqs] = await Promise.all([
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
      image: '/images/hero/hero-slide-3.jpg',
      badge: 'Turnkey',
    },
    {
      title: 'Signature Bespoke Tier',
      rate: '₹2,800 / sq.ft',
      desc: 'Bespoke luxury for penthouses & villas. Italian PU lacquer, Hafele hardware, smart home lighting automation, Signature tier timeline handover.',
      href: '/pricing/signature',
      image: '/images/hero/hero-slide-1.jpg',
      badge: 'Popular',
    },
    {
      title: 'Elite Private Commission',
      rate: 'Custom BOQ',
      desc: 'Architect-designed private luxury. Imported Calacatta Italian marble, liquid metal joinery, and dedicated principal team.',
      href: '/pricing/elite',
      image: '/images/hero/hero-slide-4.jpg',
      badge: 'Elite',
    },
    {
      title: 'Interactive Fee Calculator',
      rate: 'Instant Tool',
      desc: 'Calculate your exact interior design cost in Chennai based on carpet area, residence type, and material finishes.',
      href: '/pricing/calculator',
      image: '/images/hero/hero-slide-2.jpg',
      badge: 'Tool',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <FaqJsonLd items={faqs} />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-small text-on-surface-3">
              <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
              <span>/</span>
              <li aria-current="page" className="text-accent font-semibold">Pricing</li>
            </ol>
          </nav>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Radical Financial Transparency
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Most Chennai Studios Hide the Price. <br />
              <span className="text-accent">We Publish It Stated Plainly.</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              No quote-on-request and no discovery call before you can find out what a project costs. Estimate your project budget online, evaluate our three structured investment tiers, and review contractual guarantees.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#calculator" size="lg">
                Estimate Project Budget
              </Button>
              <Button as="a" href="#tiers" variant="secondary" size="lg">
                View Investment Tiers →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">₹1,800</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Essential / Sq.Ft</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">₹2,800</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Signature / Sq.Ft</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">100%</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">BOQ Price Lock</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">0%</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Cost Escalation</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10 Yr</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Flat Warranty</span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Highlights Strip */}
      <section className="py-6 bg-surface-elevated/40 border-b border-border-subtle/40">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {highlights.map((item) => (
              <div key={item.title} className="p-2">
                <strong className="block font-ui text-small font-bold text-accent uppercase tracking-wider">
                  {item.title}
                </strong>
                <span className="text-[12px] text-on-surface-3 mt-0.5 block">{item.desc}</span>
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
            <div key={sp.title} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image src={sp.image} alt={sp.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {sp.badge}
                  </span>
                  <span className="absolute bottom-2 right-2 px-3 py-1 rounded bg-surface-deep/90 text-accent font-display text-small font-bold">
                    {sp.rate}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">{sp.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">{sp.desc}</p>
              </div>
              <Button as="a" href={sp.href} variant="secondary" className="w-full justify-center">
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
                  cta={{ label: 'See ' + tier.name, href: `/residential/${tier.id}` }}
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
                  <span className="font-ui text-small text-on-surface-2"> / month</span>
                </p>
                {subscription.yearly !== null && (
                  <p className="text-small text-on-surface-muted">
                    or {formatRupees(subscription.yearly)} a year
                  </p>
                )}
                <p className="text-small text-on-surface-2">{subscription.summary}</p>
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
            beforeImage={{ src: '/images/hero/hero-slide-4.jpg', alt: 'Bare shell residence before fit-out' }}
            afterImage={{ src: '/images/hero/hero-slide-1.jpg', alt: 'Completed luxury interior by Luxe Axis' }}
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
