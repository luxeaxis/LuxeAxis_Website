import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { WorldClassPricingCalculator } from '@/components/WorldClassPricingCalculator';
import { getCalculatorConfig } from '@/lib/content/source';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { CALCULATOR_HERO_SLIDES } from '@/lib/content/heroSlides';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/pricing/calculator';

export const metadata: Metadata = {
  title: 'Interior Design Cost Calculator Chennai | Instant BOQ Estimator | Luxe Axis',
  description:
    'Calculate your exact home interior design cost in Chennai. Real-time, un-gated budget estimator for 2BHK, 3BHK, 4BHK apartments, villas, and commercial spaces with itemized BOQ breakdowns.',
  keywords: [
    'interior design cost calculator chennai',
    'interior estimate calculator',
    '2bhk interior cost calculator',
    '3bhk interior design cost calculator',
    'boq interior estimation tool',
    'interior price per square foot calculator',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Interior Design Cost Calculator Chennai | Luxe Axis',
    description:
      'Instant un-gated budget estimator for Chennai home interiors. Calculate exact carpet area costs with itemized BOQ breakdowns.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/pricing-tier-calculator.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis Interactive Interior Cost Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interior Design Cost Calculator Chennai | Luxe Axis',
    description:
      'Instant, un-gated interior design budget estimator for apartments and villas in Chennai.',
    images: ['/posters/pricing-tier-calculator.png'],
  },
};

export default async function CalculatorPricingPage() {
  const calculatorConfig = await getCalculatorConfig();

  const highlights = [
    { title: 'Instant Calculation', desc: 'Real-time Budget Estimation' },
    { title: 'Zero Email Gate', desc: 'No Phone Number Required' },
    { title: 'Itemized BOQ', desc: 'Transparent Component Breakdown' },
    { title: '3 Tier Options', desc: 'Essential, Signature & Elite' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];

  const calculatorFeatures = [
    {
      num: '01',
      title: 'Carpet Area Precision',
      desc: 'Enter your exact carpet area in square feet to calculate accurate baseline material and labor requirements.',
    },
    {
      num: '02',
      title: 'Residence & Commercial Specifics',
      desc: 'Select between Apartments, Penthouses, Villas, or Commercial spaces for specialized structural multipliers.',
    },
    {
      num: '03',
      title: 'Tier Comparison Engine',
      desc: 'Compare Essential (₹1,450/sq.ft), Signature (₹2,450/sq.ft), and Elite custom finishes side-by-side.',
    },
    {
      num: '04',
      title: 'Un-Gated Financial Clarity',
      desc: 'We publish our rates openly. View your estimated investment immediately without mandatory form barriers.',
    },
  ];

  const faqs = [
    {
      q: 'How accurate is the online Fee Calculator figure?',
      a: 'The online calculator provides a 90%+ accurate estimate based on standard floorplan layouts and current Chennai market rates. The final price is locked in writing after a physical site measurement audit.',
    },
    {
      q: 'Do you charge extra for initial 3D VR design drawings?',
      a: 'No. 3D spatial modeling, Vastu-Tech compass scans, and initial material samples are included in your project proposal.',
    },
    {
      q: 'Can I lock in my calculator estimate for later execution?',
      a: 'A calculator estimate is an indication, not a quote — the quote comes out of the design audit. Once issued, a residential quote holds for 14 days, a commercial one for 21, and an NRI Elite one for 30. If material costs rise more than 8% between quote and order, the difference is passed through at cost and shown to you.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Interactive Fee Calculator & BOQ Budget Estimator',
          description:
            'Calculate your exact interior design cost in Chennai based on carpet area, scope, and tier.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage with Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={CALCULATOR_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs
            path="/pricing/calculator"
            labels={{ calculator: 'Fee Calculator' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Un-Gated Pricing Engine • 90%+ Precision
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Interactive Chennai Interior <br />
              <span className="text-accent">Pricing Calculator</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Most Chennai studios hide their prices behind aggressive sales calls. We
              publish our 2025/2026 pricing algorithm directly so you can estimate your
              exact turnkey project budget and itemized BOQ instantly.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  Instant
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  BOQ Calculation
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  92%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Estimate Precision
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  0%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Email Gate
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  10 Yr
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Flat Warranty
                </span>
              </div>
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

      {/* 3. Interactive Calculator Tool */}
      <Section
        id="calculator-tool"
        eyebrow="Live Estimator"
        title="Estimate Your Interior Investment"
        lede="Configure your space parameters and material preferences below for an immediate 90%+ realistic BOQ breakdown."
      >
        <div className="max-w-6xl mx-auto">
          {calculatorConfig ? (
            <WorldClassPricingCalculator config={calculatorConfig} />
          ) : (
            <p className="text-body text-on-surface-2 text-center py-8">
              Fee calculator rate card is being updated. Please book a design
              audit below for an instant quote.
            </p>
          )}
        </div>
      </Section>

      {/* 4. Calculator Features */}
      <Section
        id="features"
        eyebrow="Algorithm Precision"
        title="How Our Pricing Engine Works"
        lede="Transparent mathematical estimation based on real material costs and factory labor."
      >
        <Grid cols={2} gap={6}>
          {calculatorFeatures.map((f) => (
            <div
              key={f.num}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h2 font-bold text-accent shrink-0">
                {f.num}
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {f.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. FAQ */}
      <Section id="faq" eyebrow="Questions Answered" title="Fee Calculator FAQ">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group lx-liquid-glass rounded-xl p-4 border border-accent/30"
            >
              <summary className="font-display text-body font-bold text-on-surface cursor-pointer flex items-center justify-between list-none">
                <span>{faq.q}</span>
                <span className="text-accent group-open:rotate-45 transition-transform text-h4">
                  ＋
                </span>
              </summary>
              <p className="text-small text-on-surface-2 mt-3 pt-3 border-t border-border-subtle/40 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <CTASection />
    </main>
  );
}
