import { TestimonialBand } from '@/components/sections/CTASection';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Grid, Stack } from '@/components/layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { InclusionList, TierSummary } from '@/components/sections/TierSummary';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq, FaqJsonLd } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';
import { getFaqs, getTiers, getTestimonials } from '@/lib/content/source';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getTiers()).map((tier) => ({ tier: tier.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string }>;
}): Promise<Metadata> {
  const { tier: tierId } = await params;
  const tier = (await getTiers()).find((candidate) => candidate.id === tierId);
  if (!tier) return {};

  const pageTitle = `${tier.name} — Luxury Residential Interior Design in Chennai | Luxe Axis`;
  const pageDesc = `${tier.summary} Turnkey execution with BWP marine plywood, German hardware, 45-day guaranteed handover, and a 10-year flat warranty.`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [
      `${tier.name.toLowerCase()} interior design chennai`,
      'turnkey residential interiors chennai',
      'luxury home interior packages',
      'modular kitchen and wardrobe',
    ],
    alternates: canonicalFor(`/residential/${tier.id}`),
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalFor(`/residential/${tier.id}`).canonical,
      images: [
        {
          url: '/posters/residential-hub-hero.png',
          width: 1200,
          height: 630,
          alt: `${tier.name} Luxe Axis Luxury Interior Design Chennai`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: ['/posters/residential-hub-hero.png'],
    },
  };
}

export default async function TierPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier: tierId } = await params;
  const [allTiers, faqs] = await Promise.all([getTiers(), getFaqs()]);
  const tier = allTiers.find((candidate) => candidate.id === tierId);

  if (!tier) notFound();

  const otherTiers = allTiers.filter((t) => t.id !== tier.id);

  const tierHighlights: Record<string, { title: string; desc: string }[]> = {
    essential: [
      { title: '₹1,800 / sq.ft', desc: 'Transparent Rate Card' },
      { title: '45-Day Handover', desc: 'Guaranteed On-Time Delivery' },
      { title: 'Blum Soft-Close', desc: 'German Cabinet Hardware' },
      { title: 'BWP Plywood', desc: '100% Water & Termite Proof' },
      { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
    ],
    signature: [
      { title: '₹2,800 / sq.ft', desc: 'Bespoke Luxury Finish' },
      { title: 'Signature Handover', desc: 'Guaranteed On-Time Delivery' },
      { title: 'Italian PU Lacquer', desc: 'High-Gloss & Matte Joinery' },
      { title: 'Home Automation', desc: 'Smart Lighting & Curtains' },
      { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
    ],
    elite: [
      { title: 'Bespoke Quote', desc: 'Custom Architectural BOQ' },
      { title: 'Milestone Delivery', desc: 'Strict Phased Execution' },
      { title: 'Calacatta Marble', desc: 'Imported Italian Slabs' },
      { title: 'Liquid Metal Joinery', desc: 'Hand-Finished Brass' },
      { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
    ],
  };

  const defaultHighlights = [
    { title: '₹1,800 / sq.ft', desc: 'Transparent Rate Card' },
    { title: '45-Day Handover', desc: 'Guaranteed On-Time Delivery' },
    { title: 'Blum Soft-Close', desc: 'German Cabinet Hardware' },
    { title: 'BWP Plywood', desc: '100% Water & Termite Proof' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];
  const highlights = tierHighlights[tier.id] ?? defaultHighlights;

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
      signature: 'Signature Timeline',
      elite: 'Milestone Guaranteed',
    },
    {
      feature: 'Warranty',
      essential: 'Flat 10-Year Warranty',
      signature: 'Flat 10-Year Warranty',
      elite: 'Flat 10-Year Warranty',
    },
  ];

  const testimonials = await getTestimonials();

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: `${tier.name} residential interior design`,
          description: tier.summary,
          url: `/residential/${tier.id}`,
        })}
      />
      <FaqJsonLd items={faqs} />

      {/* 1. Hero Stage */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <div className="mb-6">
            <Breadcrumbs path={`/residential/${tier.id}`} />
          </div>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Turnkey Residential Tier
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              {tier.name} <br />
              <span className="text-accent">Residential Interior Design</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              {tier.summary} Backed by our 10-year flat structural warranty,
              factory-direct manufacturing, and contractual delivery guarantees.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book {tier.name} Audit
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

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  {tier.id === 'essential'
                    ? '₹1,800'
                    : tier.id === 'signature'
                      ? '₹2,800'
                      : 'Bespoke'}
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  {tier.id === 'elite' ? 'Itemized BOQ' : 'Per Carpet Sq.Ft'}
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  {tier.id === 'essential'
                    ? '45 Days'
                    : tier.id === 'signature'
                      ? 'Signature'
                      : 'Milestone'}
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
                  Cost Escalation
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

      {/* 3. Primary Scope & Tier Summary */}
      <Section
        id="scope"
        eyebrow="Detailed Specifications"
        title={`What Is Included in ${tier.name}`}
        lede="Comprehensive breakdown of material grades, hardware, and studio deliverables."
      >
        <Grid cols={2} gap={8} className="lg:grid-cols-[2fr_1fr]">
          <section
            aria-labelledby="included-heading"
            className="lx-liquid-glass rounded-2xl p-6 border border-accent/30"
          >
            <Stack gap={5}>
              <h2
                id="included-heading"
                className="font-display text-h2 font-bold text-on-surface"
              >
                Included Specifications & Deliverables
              </h2>
              <InclusionList inclusions={tier.inclusions} />
            </Stack>
          </section>
          <TierSummary tier={tier} />
        </Grid>
      </Section>

      {/* 4. Tier Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="Tier Matrix"
        title="Compare All Three Tiers Side-by-Side"
        lede="See how the Essential, Signature, and Elite tiers compare in materials and delivery."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead>
              <tr className="border-b border-border-subtle/60 text-accent font-display text-body font-bold">
                <th className="py-3 px-4">Specification</th>
                <th
                  className={`py-3 px-4 ${tier.id === 'essential' ? 'text-accent bg-accent/10 rounded-t-lg' : ''}`}
                >
                  Essential Tier
                </th>
                <th
                  className={`py-3 px-4 ${tier.id === 'signature' ? 'text-accent bg-accent/10 rounded-t-lg' : ''}`}
                >
                  Signature Tier
                </th>
                <th
                  className={`py-3 px-4 ${tier.id === 'elite' ? 'text-accent bg-accent/10 rounded-t-lg' : ''}`}
                >
                  Elite Commission
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40 text-on-surface-2">
              {comparisons.map((row) => (
                <tr key={row.feature}>
                  <td className="py-3 px-4 font-bold text-on-surface">
                    {row.feature}
                  </td>
                  <td
                    className={`py-3 px-4 ${tier.id === 'essential' ? 'font-semibold text-accent bg-accent/5' : ''}`}
                  >
                    {row.essential}
                  </td>
                  <td
                    className={`py-3 px-4 ${tier.id === 'signature' ? 'font-semibold text-accent bg-accent/5' : ''}`}
                  >
                    {row.signature}
                  </td>
                  <td
                    className={`py-3 px-4 ${tier.id === 'elite' ? 'font-semibold text-accent bg-accent/5' : ''}`}
                  >
                    {row.elite}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 5. Before & After Transformation Slider */}
      <Section
        id="transformation"
        eyebrow="Real Project Result"
        title={`${tier.name} Transformation Makeover`}
        lede={`Real Chennai residence transformed under the ${tier.name}.`}
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src:
                tier.id === 'essential'
                  ? '/posters/apt-before-construction-raw.png'
                  : tier.id === 'signature'
                    ? '/posters/penthouse-before-omr.png'
                    : '/posters/res-luxury-before-raw-shell.png',
              alt: `Bare shell residence before ${tier.name} fit-out`,
            }}
            afterImage={{
              src:
                tier.id === 'essential'
                  ? '/posters/project-2bhk-tnagar.png'
                  : tier.id === 'signature'
                    ? '/posters/penthouse-hero-omr.png'
                    : '/posters/res-luxury-featured-adyar-estate.png',
              alt: `Completed ${tier.name} interior in Chennai`,
            }}
          />
        </div>
      </Section>

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. Testimonials */}
      <TestimonialBand testimonials={testimonials} />

      {/* 8. Compare Other Tiers Grid */}
      <Section
        id="other-tiers"
        eyebrow="Explore Alternatives"
        title="Compare Other Investment Tiers"
        lede="Evaluate our other structured tiers to find the exact match for your home."
      >
        <Grid cols={2} gap={6}>
          {otherTiers.map((ot) => (
            <div
              key={ot.id}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {ot.name}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {ot.summary}
                </p>
              </div>
              <Button
                as="a"
                href={`/residential/${ot.id}`}
                variant="secondary"
                className="w-full justify-center"
              >
                View {ot.name} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 9. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title={`${tier.name} FAQ`}>
        <Faq items={faqs} />
      </Section>

      {/* 10. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
