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

const ROUTE = '/pricing/elite';

export const metadata: Metadata = {
  title: 'Elite Private Commission Tier | Luxe Axis Pricing',
  description:
    'Custom architect-designed private luxury commissions for large villas and estate homes in Chennai. Imported Italian marble, liquid metal joinery & dedicated master team.',
  alternates: canonicalFor(ROUTE),
};

export default function ElitePricingPage() {
  const highlights = [
    { title: 'Bespoke Valuation', desc: 'Custom Architectural BOQ' },
    { title: 'Milestone Handover', desc: 'Strict Phased Delivery Schedule' },
    { title: 'Imported Marble', desc: 'Calacatta & Statuario Italian Slabs' },
    { title: 'Liquid Metal Joinery', desc: 'Hand-Finished Brass & Bronze' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];

  const inclusions = [
    {
      title: 'Dedicated Principal Architect Team',
      desc: 'Full-time dedicated senior principal architect, structural consultant, and Vastu-Tech master auditor assigned exclusively to your residence.',
    },
    {
      title: 'Italian Quarry Selection & Provenance',
      desc: 'Direct quarry selection of book-matched Calacatta, Michelangelo, and Statuario marble slabs imported from Carrara, Italy.',
    },
    {
      title: 'Liquid Metal & Artisan Joinery',
      desc: 'Hand-hammered liquid brass room dividers, fluted teakwood wall cladding, and custom onyx illuminated bar counters.',
    },
    {
      title: 'Full-Home Smart Automation Suite',
      desc: 'Integrated Lutron lighting scenes, motorized double-drapery, Bang & Olufsen soundscapes, and biometric access controls.',
    },
    {
      title: 'Private Sky Lounge & Terrace Engineering',
      desc: 'Weatherproof teak deck flooring, stainless steel outdoor kitchenettes, and concealed LED perimeter pool lighting.',
    },
    {
      title: 'Concierge Aftercare & Warranty',
      desc: 'Priority 24/7 concierge response team, bi-annual marble polish maintenance, and flat 10-year structural warranty.',
    },
  ];

  const comparisons = [
    { feature: 'Price per Sq.Ft', essential: '₹1,800 / sq.ft', signature: '₹2,800 / sq.ft', elite: 'Custom Quote' },
    { feature: 'Core Material', essential: 'Marine BWP Plywood', signature: 'High-Density HDMR & Teak', elite: 'Imported Solid Hardwood' },
    { feature: 'Kitchen Finish', essential: 'High-Gloss Acrylic / Laminate', signature: 'Italian PU Lacquer / Tinted Glass', elite: 'Calacatta Marble & Metal' },
    { feature: 'Hardware', essential: 'Blum Soft-Close Standard', signature: 'Hafele / Hettich Premium', elite: 'Custom Italian Brass Joinery' },
    { feature: 'Delivery Timeline', essential: '45 Days Guaranteed', signature: '60 Days Guaranteed', elite: 'Milestone Guaranteed' },
    { feature: 'Warranty', essential: 'Flat 10-Year Warranty', signature: 'Flat 10-Year Warranty', elite: 'Flat 10-Year Warranty' },
  ];

  const faqs = [
    {
      q: 'How is pricing determined for the Elite Commission Tier?',
      a: 'Elite Tier projects are evaluated via an itemized BOQ based on custom architectural drawings, imported material provenance, and specialized millwork complexity.',
    },
    {
      q: 'Can we specify imported international furniture and fixtures?',
      a: 'Yes. Our procurement team manages direct import, freight forwarding, customs clearance, and expert installation for international brands.',
    },
    {
      q: 'What is the project milestone structure for Elite Tier commissions?',
      a: 'Execution is split into transparent milestone gates, with progress tracked live in 4K resolution on your Space OS client dashboard.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Elite Private Commission Tier',
          description: 'Custom architect-designed private luxury commissions for large villas and estate homes in Chennai.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/pricing/elite" labels={{ 'elite': "Elite Tier" }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Bespoke Private Architecture
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Elite Private Commission <br />
              <span className="text-accent">Custom Valuation</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Custom architect-designed private luxury commissions for large estate villas, sky mansions, and legacy homes in Chennai. Imported Italian marble, liquid metal joinery, and dedicated principal team.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Elite Private Audit
              </Button>
              <Button as="a" href="/pricing/calculator" variant="secondary" size="lg">
                Calculate Project Budget →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">Bespoke</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Itemized BOQ</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">Milestone</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Phased Guarantee</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10 Yr</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Flat Warranty</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">24/7</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Concierge Service</span>
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
                <span className="text-[12px] text-on-surface-muted mt-0.5 block">{item.desc}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Detailed Inclusions */}
      <Section
        id="inclusions"
        eyebrow="Elite Commission Scope"
        title="What Is Included in Elite Tier"
        lede="Uncompromising artisanal luxury with total material freedom and dedicated senior team oversight."
      >
        <Grid cols={2} gap={6}>
          {inclusions.map((inc, idx) => (
            <div key={inc.title} className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4">
              <span className="font-display text-h2 font-bold text-accent shrink-0">0{idx + 1}</span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">{inc.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{inc.desc}</p>
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
                <th className="py-3 px-4">Signature Tier</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">Elite Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">{row.feature}</td>
                  <td className="py-3 px-4">{row.essential}</td>
                  <td className="py-3 px-4">{row.signature}</td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">{row.elite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 5. Before & After */}
      <Section
        id="transformation"
        eyebrow="Elite Estate Renovation"
        title="Elite Tier Private Estate Transformation"
        lede="Real 8,200 sq.ft villa transformation in Adyar under the Elite Tier."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{ src: '/images/hero/hero-slide-4.jpg', alt: 'Bare villa shell before Elite fit-out' }}
            afterImage={{ src: '/images/hero/hero-slide-2.jpg', alt: 'Completed Elite Tier villa in Adyar' }}
          />
        </div>
      </Section>

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. FAQ */}
      <Section id="faq" eyebrow="Questions Answered" title="Elite Tier FAQ">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group lx-liquid-glass rounded-xl p-4 border border-accent/30">
              <summary className="font-display text-body font-bold text-on-surface cursor-pointer flex items-center justify-between list-none">
                <span>{faq.q}</span>
                <span className="text-accent group-open:rotate-45 transition-transform text-h4">＋</span>
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
