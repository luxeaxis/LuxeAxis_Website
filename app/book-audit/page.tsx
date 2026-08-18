import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { BookAuditForm } from '@/components/BookAuditForm';
import { Container, Grid, Stack } from '@/components/layout';
import { Icon } from '@/components/Icon';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq, FaqJsonLd } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs, getTrustPoints, getTestimonials } from '@/lib/content/source';

const ROUTE = '/book-audit';

export const metadata: Metadata = {
  title: 'Book a Free Luxury Design & Vastu Audit | Luxe Axis Chennai',
  description:
    'Schedule a 60-minute spatial design audit with a senior interior architect. CAD layout assessment, Vastu-Tech compass check, and itemized BOQ cost estimate in Chennai.',
  keywords: [
    'book interior design consultation chennai',
    'free interior design audit',
    'vastu floorplan consultation chennai',
    'luxury interior cost estimate chennai',
    'boq interior estimation',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Book a Free Luxury Design & Vastu Audit | Luxe Axis Chennai',
    description:
      'Schedule a 60-minute spatial design audit with a senior interior architect. CAD layout assessment, Vastu-Tech compass check, and itemized BOQ cost estimate.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/home-interiors-hero.png',
        width: 1200,
        height: 630,
        alt: 'Book a Free Design Audit with Luxe Axis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Free Luxury Design & Vastu Audit | Luxe Axis Chennai',
    description:
      '60-minute design audit: CAD layout analysis, Vastu-Tech compass scan, and itemized BOQ estimate.',
    images: ['/posters/home-interiors-hero.png'],
  },
};

export default async function BookAuditPage() {
  const [trustPoints, faqs] = await Promise.all([getTrustPoints(), getFaqs()]);

  const auditFaqs = [...faqs].filter(
    (f) => f.id === 'abroad' || f.id === 'contractors' || f.id === 'materials',
  );

  const highlights = [
    { title: '60-Min Session', desc: 'In-Person or Virtual Video Audit' },
    { title: 'CAD Analysis', desc: 'Spatial Ergonomics & Flow Check' },
    { title: 'Vastu-Tech Scan', desc: 'Solar Compass Orientation' },
    { title: 'Itemized BOQ', desc: 'Transparent Cost Estimation' },
    { title: '0% Hard Sell', desc: 'Purely Consultative Session' },
  ];

  const deliverables = [
    {
      num: '01',
      title: '2D Layout & Flow Optimization',
      desc: 'Senior architect evaluates spatial ergonomics, traffic movement, and zero-dead-space furniture positioning.',
    },
    {
      num: '02',
      title: 'Vastu-Tech Solar Compass Scan',
      desc: 'Ancient Vastu orientation audit mapped against your floorplan compass vectors for light, air, and energy.',
    },
    {
      num: '03',
      title: 'Material & Finish Selection',
      desc: 'Touch and inspect Italian marble samples, BWP plywood cores, acrylic veneers, and Blum soft-close hardware.',
    },
    {
      num: '04',
      title: 'Itemized BOQ Cost Breakdown',
      desc: 'Receive a component-by-component financial breakdown with zero hidden fees and contractual price lock.',
    },
  ];

  const comparisons = [
    {
      feature: 'Consultant',
      generic: 'Commissioned sales representative with target quotas',
      luxeaxis: 'Senior interior architect with 8+ years project experience',
    },
    {
      feature: 'Layout Review',
      traditional: 'Generic catalog templates pushed regardless of space',
      luxeaxis: 'Custom CAD spatial optimization & Vastu-Tech solar scan',
    },
    {
      feature: 'Pricing Clarity',
      traditional: 'Vague lump-sum figure with post-handover surprises',
      luxeaxis: 'Itemized component BOQ locked in contract',
    },
    {
      feature: 'Visual Simulation',
      traditional: 'Hand-drawn pencil sketches or no 3D preview',
      luxeaxis: 'Photorealistic 4K 3D VR spatial simulation',
    },
  ];

  const testimonials = await getTestimonials();

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ReserveAction',
          name: 'Book a Free Design Audit | Luxe Axis Chennai',
          description:
            'A free 60-minute spatial design audit with a senior interior architect.',
          url: ROUTE,
        }}
      />
      <FaqJsonLd items={auditFaqs} />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/book-audit" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                60-Minute Spatial Consultation
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Book Your Free <br />
              <span className="text-accent">Design Consultation Audit</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              A free 60-minute audit with a senior interior architect. Tell us
              about your home or commercial space, and we will agree on a
              convenient time. No obligation, no hard sell, and zero spam.
            </p>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  100% Free
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  No Obligation
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  60 Mins
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Audit Duration
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  CAD & 3D
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Layout Assessment
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  Vastu Scan
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Solar Orientation
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  4.9 ★
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Google Rating
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

      {/* 3. Primary Interactive Audit Form Section */}
      <Section
        id="audit-form"
        eyebrow="Reserve Your Slot"
        title="Select Your Consultation Details"
      >
        <Grid cols={2} gap={8} className="lg:grid-cols-[3fr_2fr]">
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30">
            <BookAuditForm />
          </div>

          <aside
            aria-labelledby="what-happens-heading"
            className="lx-liquid-glass rounded-2xl p-6 border border-accent/30"
          >
            <Stack gap={5}>
              <h2
                id="what-happens-heading"
                className="font-display text-h3 font-bold text-on-surface"
              >
                What Happens Next
              </h2>
              <ol className="flex flex-col gap-4">
                {[
                  'A senior interior architect reviews your space details and contacts you within 2 hours to confirm a time.',
                  'The audit is 60 minutes, conducted in-person at our studio/site or virtually over video call.',
                  'You receive an optimized 2D layout, Vastu-Tech scan, and an itemized BOQ quote with zero financial commitment.',
                ].map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3 text-small text-on-surface-2"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-icon-lg w-icon-lg shrink-0 items-center justify-center rounded-round border border-accent/40 font-mono text-overline text-accent font-bold"
                    >
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>

              <ul className="flex flex-col gap-2.5 border-t border-border-subtle/50 pt-5">
                {trustPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-small text-on-surface-2"
                  >
                    <Icon
                      name="check"
                      size="sm"
                      decorative
                      className="shrink-0 text-accent"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-small text-accent font-medium">
                  🔒 You will speak directly to a senior interior architect, not
                  a bot or sales agent.
                </p>
              </div>
            </Stack>
          </aside>
        </Grid>
      </Section>

      {/* 4. Deliverables Grid */}
      <Section
        id="deliverables"
        eyebrow="Audit Deliverables"
        title="What You Get in Your 60-Minute Session"
        lede="Tangible design insights provided free during your audit."
      >
        <Grid cols={2} gap={6}>
          {deliverables.map((d) => (
            <div
              key={d.num}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h2 font-bold text-accent shrink-0">
                {d.num}
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {d.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {d.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="Audit Difference"
        title="Luxe Axis Audit vs Generic Sales Calls"
        lede="How our technical architectural audit differs from traditional contractor sales pitches."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Generic Interior Sales Calls</th>
                <th className="py-3 px-4 text-accent bg-accent/10 rounded-t-lg">
                  Luxe Axis 60-Min Audit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-on-surface-muted">
                    {row.traditional}
                  </td>
                  <td className="py-3 px-4 font-semibold text-accent bg-accent/5">
                    {row.luxeaxis}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6. Before & After Transformation Slider */}
      <Section
        id="transformation"
        eyebrow="Real Project Result"
        title="Transformation From Audit to Completed Home"
        lede="Real apartment in T. Nagar transformed after an initial Luxe Axis design audit."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/apt-before-construction-raw.png',
              alt: 'Bare shell flat in T. Nagar before design audit',
            }}
            afterImage={{
              src: '/posters/home-interiors-hero.png',
              alt: 'Completed 3BHK home interior in T. Nagar after Luxe Axis audit',
            }}
          />
        </div>
      </Section>

      {/* 7. Process */}
      <ProcessSteps />

      {/* 8. Testimonials */}
      <TestimonialBand testimonials={testimonials} />

      {/* 9. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="Audit FAQ">
        <Faq items={auditFaqs} />
      </Section>

      {/* 10. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
