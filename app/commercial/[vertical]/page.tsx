import { getTestimonials } from '@/lib/content/source';
import { TestimonialBand } from '@/components/sections/CTASection';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container, Grid, Stack } from '@/components/layout';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';
import { COMMERCIAL_VERTICALS, ratesFor } from '@/lib/content/commercial';
import { formatBand, formatRupees } from '@/lib/pricing/estimate';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { heroSlidesForVertical } from '@/lib/content/heroSlides';

export const dynamicParams = false;

export async function generateStaticParams() {
  return COMMERCIAL_VERTICALS.map((vertical) => ({ vertical: vertical.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical: slug } = await params;
  const vertical = COMMERCIAL_VERTICALS.find(
    (candidate) => candidate.slug === slug,
  );
  if (!vertical) return {};

  return {
    title: `${vertical.name} Interior Designers in Chennai | Luxe Axis Commercial`,
    description: `${vertical.name} interiors in Chennai. ${vertical.summary} Written delivery commitment, flat 10-year warranty, fixed price per sqft.`,
    alternates: canonicalFor(`/commercial/${vertical.slug}`),
  };
}

export default async function CommercialVerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: slug } = await params;
  const vertical = COMMERCIAL_VERTICALS.find(
    (candidate) => candidate.slug === slug,
  );
  if (!vertical) notFound();
  const rates = ratesFor(vertical.slug);

  // Sector-specific sub-space types
  const subSpaces =
    slug === 'workplace'
      ? [
          {
            title: 'Open Collaborative Workstations',
            desc: 'Ergonomic benching systems with integrated cable spines, acoustic divider screens, and power drop modules.',
            image: '/posters/commercial-workplace-hero.png',
          },
          {
            title: 'Executive Cabins & Suite',
            desc: 'Acoustically isolated glass cabins with double-glazed partitions, custom veneer credenzas, and mood lighting.',
            image: '/posters/commercial-it-office-hero.png',
          },
          {
            title: 'AV Boardrooms & Conference',
            desc: 'Integrated zoom room technology, ceiling-array microphones, sound-absorbing wall cladding, and dimmable scenes.',
            image: '/posters/commercial-boardroom-hero.png',
          },
          {
            title: 'Breakout Lounges & Pantry',
            desc: 'High-top dining counters, collaborative booth seating, coffee bars, and sound-dampened ceiling baffles.',
            image: '/posters/commercial-reception-hero.png',
          },
        ]
      : slug === 'retail-hospitality'
        ? [
            {
              title: 'Flagship Retail Showrooms',
              desc: 'Calculated shopper circulation loops, high-CRI accent spotlighting, statement entrance portals, and display joinery.',
              image: '/posters/commercial-reception-hero.png',
            },
            {
              title: 'Boutique Fashion & Luxury Stores',
              desc: 'Custom brass garment racks, velvet fitting rooms, frameless mirror walls, and integrated cash wrap counters.',
              image: '/posters/commercial-boardroom-hero.png',
            },
            {
              title: 'Fine Dining & Specialty Restaurants',
              desc: 'Acoustic banquet seating, warm 2700K dimmable table lighting, commercial kitchen layout flow, and bar counters.',
              image: '/posters/commercial-workplace-hero.png',
            },
            {
              title: 'Boutique Hotel Lobbies & Lounges',
              desc: 'Grand reception desks, concierge lounges, ambient acoustic ceiling treatments, and durable stone flooring.',
              image: '/posters/commercial-it-office-hero.png',
            },
          ]
        : [
            {
              title: 'Polyclinics & Doctor Chambers',
              desc: 'Infection-resistant seamless vinyl flooring, anti-microbial laminate desks, and patient consultation privacy.',
              image: '/posters/commercial-reception-hero.png',
            },
            {
              title: 'Dental Operatories & Suites',
              desc: 'Pre-plumbed suction lines, shadowless task lighting, sterilisable surfaces, and soothing patient visual zones.',
              image: '/posters/commercial-it-office-hero.png',
            },
            {
              title: 'Diagnostic Labs & Sample Collection',
              desc: 'Cleanroom-compliant wall cladding, chemical-resistant resin counters, and organised technician workstations.',
              image: '/posters/commercial-boardroom-hero.png',
            },
            {
              title: 'Patient Waiting Lounges & Reception',
              desc: 'Calming color palettes, barrier-free wheelchair clearance, acoustic privacy desk partitions, and clear signage.',
              image: '/posters/commercial-workplace-hero.png',
            },
          ];

  const testimonials = await getTestimonials();

  // Sector FAQs
  const faqs = [
    {
      q: `What is the cost of ${vertical.name.toLowerCase()} interior design in Chennai?`,
      a: `Commercial ${vertical.name.toLowerCase()} rates in Chennai range from ₹100 to ₹350 per sqft for fit-out execution depending on area size, finishes, and technical complexity. All quotes are itemised upfront.`,
    },
    {
      q: `How long does execution take for a ${vertical.name.toLowerCase()} project?`,
      a: `Timelines depend on scope, approvals, and site readiness. Luxe Axis agrees milestone dates in your contract before work begins, with written delay compensation when we miss dates we control.`,
    },
    {
      q: `Does Luxe Axis provide 3D visualisations for ${vertical.name.toLowerCase()} spaces?`,
      a: `Yes. Every commercial project includes complete photorealistic 3D renders and VR walkthroughs for all rooms, reception areas, and specialized zones.`,
    },
    {
      q: `What is covered under the 10-year commercial warranty?`,
      a: `Our flat 10-year warranty covers all structural joinery, partitions, ceilings, hardware, and surface laminates/veneers with zero service fees.`,
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: `${vertical.name} Interior Design`,
          description: vertical.summary,
          url: `/commercial/${vertical.slug}`,
        })}
      />

      {/* 1. Hero Section with Ken Burns & CAD Grid Overlay */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={heroSlidesForVertical(vertical.slug)} overlay="grid" />

        <Container className="relative z-10">
          {/* The vertical's own name, not the humanised slug —
              `retail-hospitality` should read "Retail & Hospitality". */}
          <Breadcrumbs
            path={`/commercial/${vertical.slug}`}
            labels={{ [vertical.slug]: vertical.name }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Commercial Architecture & Interiors
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {vertical.name} Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {vertical.summary} Designed against how the space performs, backed
              by a written delivery commitment and flat 10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg" className="shadow-2xl">
                Request a Consult
              </Button>
              <Button
                as="a"
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View Commercial Projects →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  Written
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider font-semibold">
                  Delivery commitment
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  10 Yr
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider font-semibold">
                  Flat Warranty
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  100%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider font-semibold">
                  Fixed BOQ Quote
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  4.9 ★
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider font-semibold">
                  Google Rating
                </span>
              </div>
            </div>
          </Stack>
        </Container>
      </section>

      {/* 2. Key Constraints Section */}
      <Section
        id="constraints"
        eyebrow="What this sector fails on"
        title="The Constraints We Design Against"
        lede="Not a feature list — the critical operational factors that make this kind of space succeed or fail once open."
      >
        <Grid cols={2} gap={6}>
          {vertical.concerns.map((concern, idx) => (
            <div
              key={concern}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h3 font-bold text-accent shrink-0">
                0{idx + 1}
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {concern}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  Engineered into the initial CAD floor plan and 3D spatial
                  layout to eliminate mid-project alterations and operational
                  friction.
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 3. Sub-Space Types Grid */}
      <Section
        id="spaces"
        eyebrow="Specialised Zones"
        title={`Key ${vertical.name} Spatial Environments`}
        lede={`Every corner of your ${vertical.name.toLowerCase()} designed for maximum performance, ergonomics, and aesthetic authority.`}
      >
        <Grid cols={2} gap={6}>
          {subSpaces.map((space) => (
            <div
              key={space.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={space.image}
                    alt={space.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {space.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {space.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Published Rates Table */}
      {rates.length > 0 && (
        <Section
          id="rates"
          eyebrow="What it costs"
          title="Published Commercial Rates"
          lede="Stated openly with transparent BOQ breakdowns, execution margin, and design fee structure."
        >
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-small">
              <thead>
                <tr className="border-b border-border-subtle text-left text-accent">
                  <th scope="col" className="py-3 pr-4 font-display font-bold">
                    Segment
                  </th>
                  <th scope="col" className="py-3 pr-4 font-display font-bold">
                    Typical Area
                  </th>
                  <th scope="col" className="py-3 pr-4 font-display font-bold">
                    Build Rate
                  </th>
                  <th scope="col" className="py-3 font-display font-bold">
                    Design Fee
                  </th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr
                    key={rate.id}
                    className="border-b border-border-subtle/40 align-top"
                  >
                    <th
                      scope="row"
                      className="py-4 pr-4 text-left font-display font-bold text-on-surface"
                    >
                      {rate.label}
                    </th>
                    <td className="py-4 pr-4 text-on-surface-2">
                      {rate.area
                        ? `${rate.area.min.toLocaleString('en-IN')}–${rate.area.max.toLocaleString('en-IN')} sq ft`
                        : 'Custom Area'}
                    </td>
                    <td className="py-4 pr-4 font-mono tabular-nums text-on-surface-2">
                      <span className="block font-bold text-accent">
                        ₹{rate.perSqFt.low}–{rate.perSqFt.high} / sq ft
                      </span>
                      {rate.conceptFee !== null && (
                        <span className="block text-[12px] text-on-surface-muted">
                          + {formatRupees(rate.conceptFee)} concept fee
                        </span>
                      )}
                      {rate.executionMargin !== null && (
                        <span className="block text-[12px] text-on-surface-muted">
                          + {Math.round(rate.executionMargin * 100)}% execution
                          margin
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-mono tabular-nums text-on-surface-2">
                      {formatBand(rate.designFee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* 5. Before and After Slider */}
      <Section
        id="before-after"
        eyebrow="Proven Results"
        title={`Before and After: ${vertical.name} Fit-Out`}
        lede="Bare commercial shell transformed into a high-performance branded space."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: `Bare shell before ${vertical.name.toLowerCase()} fit-out`,
            }}
            afterImage={{
              src: '/posters/portfolio.avif',
              alt: `Completed ${vertical.name.toLowerCase()} interior in Chennai`,
            }}
          />
        </div>
      </Section>

      {/* 6. Process Steps */}
      <ProcessSteps />

      {/* 7. Client Reviews */}
      <TestimonialBand testimonials={testimonials} />

      {/* 8. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title={`${vertical.name} Interior FAQ`}
        lede="Key answers before booking your commercial consultation."
      >
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

      {/* 9. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
