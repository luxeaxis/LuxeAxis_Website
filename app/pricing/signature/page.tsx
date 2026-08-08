import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/pricing/signature';

export const metadata: Metadata = {
  title: 'Signature Bespoke Tier (₹2,800/sqft) | Luxe Axis Pricing',
  description:
    'Complete specifications and breakdown of the Signature Bespoke Tier at ₹2,800/sq.ft. Italian PU lacquer, Hafele hardware, home automation & 10-year warranty.',
  alternates: canonicalFor(ROUTE),
};

export default function SignaturePricingPage() {
  const highlights = [
    { title: '₹2,800 / sq.ft', desc: 'Bespoke Luxury Tier Rate' },
    { title: '60-Day Handover', desc: 'Contractual Delay Guarantee' },
    { title: 'Italian PU Lacquer', desc: 'High-Gloss & Matte Finishes' },
    { title: 'Home Automation', desc: 'Circadian Lighting & Smart Panels' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];

  const inclusions = [
    {
      title: 'Vastu-Tech Spatial Architecture',
      desc: '3D VR simulation, solar compass orientation, and custom architectural wall panelling with brass inlay accents.',
    },
    {
      title: 'Bespoke Kitchen & Bar Suite',
      desc: 'High-Density HDMR cabinets finished in Italian PU lacquer or tinted glass, Hafele Servo-Drive drawers, and Quartz island.',
    },
    {
      title: 'Master Closet & Sensor Wardrobes',
      desc: 'Floor-to-ceiling walk-in wardrobes with bronze aluminium profiles, acoustic velvet drawer lining, and sensor LED channels.',
    },
    {
      title: 'Integrated Lighting & Automation',
      desc: 'Smart lighting scenes, motorized sheer curtain tracks, magnetic recessed light channels, and iPad master control.',
    },
    {
      title: 'Statement TV Walls & Panelling',
      desc: 'Book-matched stone veneer or Italian marble backdrops with cantilevered floating storage consoles and soundbar coves.',
    },
    {
      title: 'Project Management & Warranty',
      desc: 'Senior principal architect oversight, Space OS live camera tracking, white-glove site protection, and 10-year warranty.',
    },
  ];

  const comparisons = [
    {
      feature: 'Price per Sq.Ft',
      essential: '₹1,800 / sq.ft',
      signature: '₹2,800 / sq.ft',
      elite: 'Custom Quote',
    },
    {
      feature: 'Core Material',
      essential: 'Marine BWP Plywood',
      signature: 'High-Density HDMR & Teak',
      elite: 'Imported Solid Hardwood',
    },
    {
      feature: 'Kitchen Finish',
      essential: 'High-Gloss Acrylic / Laminate',
      signature: 'Italian PU Lacquer / Tinted Glass',
      elite: 'Calacatta Marble & Metal',
    },
    {
      feature: 'Hardware',
      essential: 'Blum Soft-Close Standard',
      signature: 'Hafele / Hettich Premium',
      elite: 'Custom Italian Brass Joinery',
    },
    {
      feature: 'Delivery Timeline',
      essential: '45 Days Guaranteed',
      signature: '60 Days Guaranteed',
      elite: 'Milestone Guaranteed',
    },
    {
      feature: 'Warranty',
      essential: 'Flat 10-Year Warranty',
      signature: 'Flat 10-Year Warranty',
      elite: 'Flat 10-Year Warranty',
    },
  ];

  const faqs = [
    {
      q: 'Why is Signature our most popular tier in Chennai?',
      a: 'The Signature Tier strikes the perfect balance between Italian material sophistication (PU lacquer, glass wardrobes) and integrated smart home automation at a fixed ₹2,800/sq.ft price.',
    },
    {
      q: 'Is home automation included in the Signature Tier rate?',
      a: 'Yes. Smart lighting scenes, motorized curtain tracks, and iPad panel integration are included in the Signature scope.',
    },
    {
      q: 'What is the delivery guarantee for the Signature Tier?',
      a: 'We guarantee 60-day project handover backed by written contractual delay compensation.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Signature Bespoke Tier (₹2,800/sqft)',
          description:
            'Complete specifications and breakdown of the Signature Bespoke Tier at ₹2,800/sq.ft.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs
            path="/pricing/signature"
            labels={{ signature: 'Signature Tier' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Most Popular Tier
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Signature Bespoke Tier <br />
              <span className="text-accent">₹2,800 / sq.ft</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Bespoke luxury interior transformation for villas, penthouses, and
              premium apartments in Chennai. Italian PU lacquer finishes, Hafele
              hardware, smart lighting automation, and 10-year flat warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Signature Audit
              </Button>
              <Button
                as="a"
                href="/pricing/calculator"
                variant="secondary"
                size="lg"
              >
                Calculate Exact Budget →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  ₹2,800
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Per Carpet Sq.Ft
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  60 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Handover Guarantee
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
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  0%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Hidden Charges
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

      {/* 3. Detailed Inclusions */}
      <Section
        id="inclusions"
        eyebrow="Comprehensive Scope"
        title="What Is Included at ₹2,800/sq.ft"
        lede="Complete turnkey coverage from design and factory manufacturing to final white-glove cleaning."
      >
        <Grid cols={2} gap={6}>
          {inclusions.map((inc, idx) => (
            <div
              key={inc.title}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h2 font-bold text-accent shrink-0">
                0{idx + 1}
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {inc.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {inc.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Tier Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="Tier Matrix"
        title="Compare Investment Tiers Side-by-Side"
        lede="Evaluate our three structured pricing tiers to find your ideal fit."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Feature / Specification</th>
                <th className="py-3 px-4">Essential Tier</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">
                  Signature Tier
                </th>
                <th className="py-3 px-4">Elite Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4">{row.essential}</td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">
                    {row.signature}
                  </td>
                  <td className="py-3 px-4">{row.elite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 5. Before & After */}
      <Section
        id="transformation"
        eyebrow="Signature Makeover"
        title="Signature Tier Penthouse Transformation"
        lede="Real duplex penthouse transformation in OMR under the Signature Tier."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare shell penthouse before Signature fit-out',
            }}
            afterImage={{
              src: '/posters/hero.avif',
              alt: 'Completed Signature Tier penthouse in OMR',
            }}
          />
        </div>
      </Section>

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. FAQ */}
      <Section id="faq" eyebrow="Questions Answered" title="Signature Tier FAQ">
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
