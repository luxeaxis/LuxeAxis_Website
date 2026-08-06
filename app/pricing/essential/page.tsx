import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/pricing/essential';

export const metadata: Metadata = {
  title: 'Essential Luxury Tier (₹1,800/sqft) | Luxe Axis Pricing',
  description:
    'Complete specifications and breakdown of the Essential Luxury Tier at ₹1,800/sq.ft. Blum hardware, marine BWP plywood, 45-day guaranteed handover & 10-year warranty.',
  alternates: canonicalFor(ROUTE),
};

export default function EssentialPricingPage() {
  const highlights = [
    { title: '₹1,800 / sq.ft', desc: 'Transparent All-Inclusive Rate' },
    { title: '45-Day Handover', desc: 'Contractual Delay Compensation' },
    { title: 'Blum Soft-Close', desc: 'German Cabinet Hardware' },
    { title: 'Marine BWP Plywood', desc: '100% Water & Termite Proof' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];

  const inclusions = [
    {
      title: 'Space & Layout Engineering',
      desc: '2D CAD space optimization, Vastu-Tech compass verification, and ergonomic working triangle layout planning.',
    },
    {
      title: 'Modular Kitchen & Cabinetry',
      desc: 'BWP Marine grade plywood cabinets with high-gloss acrylic or laminate finish, Blum soft-close hinges, and Quartz countertop.',
    },
    {
      title: 'Wardrobes & Storage',
      desc: 'Floor-to-ceiling sliding or hinged wardrobes with interior organizer drawers, sensor LED strip lighting, and toughened glass shutters.',
    },
    {
      title: 'False Ceiling & Lighting',
      desc: 'Gyproc perimeter cove false ceiling with warm architectural LED spotlights, magnetic track channels, and concealed wires.',
    },
    {
      title: 'Paint & Surface Finishes',
      desc: 'Asian Paints Royal Touch emulsion with anti-fungal primer coating and fluted wooden acoustic accent panels.',
    },
    {
      title: 'Project Management & Warranty',
      desc: 'Dedicated site manager, off-site factory fabrication, daily progress photos on Space OS, and 10-year structural warranty.',
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
      q: 'Are there any hidden costs in the Essential Tier rate of ₹1,800/sq.ft?',
      a: 'No. The ₹1,800/sq.ft rate includes design, 3D visualization, materials, labor, installation, GST, and 10-year warranty. The price in your signed BOQ is final.',
    },
    {
      q: 'Can I upgrade specific components in the Essential Tier?',
      a: 'Yes. You can select component upgrades (e.g., upgrading kitchen shutters to lacquered glass or adding smart switches) itemized transparently.',
    },
    {
      q: 'What happens if project delivery exceeds 45 days?',
      a: 'If we exceed our 45-day handover deadline without written client scope changes, we pay contractual delay compensation directly to you.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Essential Luxury Tier (₹1,800/sqft)',
          description: 'Complete specifications and breakdown of the Essential Luxury Tier at ₹1,800/sq.ft.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-small text-on-surface-3">
              <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
              <span>/</span>
              <li><a href="/pricing" className="hover:text-accent transition-colors">Pricing</a></li>
              <span>/</span>
              <li aria-current="page" className="text-accent font-semibold">Essential Tier</li>
            </ol>
          </nav>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Turnkey Luxury Standard
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Essential Luxury Tier <br />
              <span className="text-accent">₹1,800 / sq.ft</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Curated premium interior fit-out for apartments and modern homes in Chennai. German Blum hardware, 100% BWP marine plywood, 45-day guaranteed handover, and 10-year flat warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Essential Tier Audit
              </Button>
              <Button as="a" href="/pricing/calculator" variant="secondary" size="lg">
                Calculate Exact Budget →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">₹1,800</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Per Carpet Sq.Ft</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">45 Days</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Guaranteed Delivery</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10 Yr</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Flat Warranty</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">0%</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Hidden Charges</span>
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

      {/* 3. Detailed Inclusions */}
      <Section
        id="inclusions"
        eyebrow="Comprehensive Scope"
        title="What Is Included at ₹1,800/sq.ft"
        lede="Complete turnkey coverage from design and factory manufacturing to final white-glove cleaning."
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
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">Essential Tier</th>
                <th className="py-3 px-4">Signature Tier</th>
                <th className="py-3 px-4">Elite Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">{row.feature}</td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">{row.essential}</td>
                  <td className="py-3 px-4">{row.signature}</td>
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
        eyebrow="Essential Renovation"
        title="Essential Tier Apartment Transformation"
        lede="Real 3BHK flat transformation in Velachery under the Essential Tier."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{ src: '/images/hero/hero-slide-4.jpg', alt: 'Bare shell flat before Essential fit-out' }}
            afterImage={{ src: '/images/hero/hero-slide-3.jpg', alt: 'Completed Essential Tier apartment in Velachery' }}
          />
        </div>
      </Section>

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. FAQ */}
      <Section id="faq" eyebrow="Questions Answered" title="Essential Tier FAQ">
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
