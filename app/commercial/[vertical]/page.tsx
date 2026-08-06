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
  const vertical = COMMERCIAL_VERTICALS.find((candidate) => candidate.slug === slug);
  if (!vertical) return {};

  return {
    title: `${vertical.name} Interior Designers in Chennai | Luxe Axis Commercial`,
    description: `${vertical.name} interiors in Chennai. ${vertical.summary} 45-day fit-out guarantee, flat 10-year warranty, fixed price per sqft.`,
    alternates: canonicalFor(`/commercial/${vertical.slug}`),
  };
}

export default async function CommercialVerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical: slug } = await params;
  const vertical = COMMERCIAL_VERTICALS.find((candidate) => candidate.slug === slug);
  if (!vertical) notFound();
  const rates = ratesFor(vertical.slug);

  // Sector-specific sub-space types
  const subSpaces =
    slug === 'workplace'
      ? [
          {
            title: 'Open Collaborative Workstations',
            desc: 'Ergonomic benching systems with integrated cable spines, acoustic divider screens, and power drop modules.',
            image: '/images/hero/hero-slide-3.jpg',
          },
          {
            title: 'Executive Cabins & Suite',
            desc: 'Acoustically isolated glass cabins with double-glazed partitions, custom veneer credenzas, and mood lighting.',
            image: '/images/hero/hero-slide-1.jpg',
          },
          {
            title: 'AV Boardrooms & Conference',
            desc: 'Integrated zoom room technology, ceiling-array microphones, sound-absorbing wall cladding, and dimmable scenes.',
            image: '/images/hero/hero-slide-4.jpg',
          },
          {
            title: 'Breakout Lounges & Pantry',
            desc: 'High-top dining counters, collaborative booth seating, coffee bars, and sound-dampened ceiling baffles.',
            image: '/images/hero/hero-slide-2.jpg',
          },
        ]
      : slug === 'retail-hospitality'
      ? [
          {
            title: 'Flagship Retail Showrooms',
            desc: 'Calculated shopper circulation loops, high-CRI accent spotlighting, statement entrance portals, and display joinery.',
            image: '/images/hero/hero-slide-4.jpg',
          },
          {
            title: 'Boutique Fashion & Luxury Stores',
            desc: 'Custom brass garment racks, velvet fitting rooms, frameless mirror walls, and integrated cash wrap counters.',
            image: '/images/hero/hero-slide-1.jpg',
          },
          {
            title: 'Fine Dining & Specialty Restaurants',
            desc: 'Acoustic banquet seating, warm 2700K dimmable table lighting, commercial kitchen layout flow, and bar counters.',
            image: '/images/hero/hero-slide-2.jpg',
          },
          {
            title: 'Boutique Hotel Lobbies & Lounges',
            desc: 'Grand reception desks, concierge lounges, ambient acoustic ceiling treatments, and durable stone flooring.',
            image: '/images/hero/hero-slide-3.jpg',
          },
        ]
      : [
          {
            title: 'Polyclinics & Doctor Chambers',
            desc: 'Infection-resistant seamless vinyl flooring, anti-microbial laminate desks, and patient consultation privacy.',
            image: '/images/hero/hero-slide-2.jpg',
          },
          {
            title: 'Dental Operatories & Suites',
            desc: 'Pre-plumbed suction lines, shadowless task lighting, sterilisable surfaces, and soothing patient visual zones.',
            image: '/images/hero/hero-slide-3.jpg',
          },
          {
            title: 'Diagnostic Labs & Sample Collection',
            desc: 'Cleanroom-compliant wall cladding, chemical-resistant resin counters, and organised technician workstations.',
            image: '/images/hero/hero-slide-1.jpg',
          },
          {
            title: 'Patient Waiting Lounges & Reception',
            desc: 'Calming color palettes, barrier-free wheelchair clearance, acoustic privacy desk partitions, and clear signage.',
            image: '/images/hero/hero-slide-4.jpg',
          },
        ];

  // Sector-specific client reviews
  const testimonials =
    slug === 'workplace'
      ? [
          {
            name: 'Vikram Sundaram',
            company: 'TechPulse Solutions, OMR',
            quote: 'Luxe Axis delivered our 6,000 sqft IT office in Sholinganallur within 42 days. Cable management and boardroom acoustics are flawless.',
            stars: 5,
          },
          {
            name: 'Radhika Ranganathan',
            company: 'Nexus Capital, Nungambakkam',
            quote: 'Our executive floor in Nungambakkam looks like a international MNC headquarters. The glass cabins and reception desk are stunning.',
            stars: 5,
          },
        ]
      : slug === 'retail-hospitality'
      ? [
          {
            name: 'Karthik Subramanian',
            company: 'Aura Boutique, T. Nagar',
            quote: 'Shopper footfall increased noticeably after the redesign. The lighting CRI makes our silk saree collection look incredible.',
            stars: 5,
          },
          {
            name: 'Ananya Vasudevan',
            company: 'Maison Bistro, Adyar',
            quote: 'The dining room acoustics and bar counter design have earned endless client compliments. Delivered on budget with zero delays.',
            stars: 5,
          },
        ]
      : [
          {
            name: 'Dr. S. K. Jayaraman',
            company: 'Apex Dental Care, Anna Nagar',
            quote: 'NABH compliance and sterile plumbing were handled expertly. Patients comment on how calm and premium our waiting room feels.',
            stars: 5,
          },
          {
            name: 'Dr. Meera Vasudev',
            company: 'LifeCare Clinic, Guindy',
            quote: 'The team completed our 3-chamber consultation clinic in 38 days. Professional, hygienic, and extremely well planned.',
            stars: 5,
          },
        ];

  // Sector FAQs
  const faqs = [
    {
      q: `What is the cost of ${vertical.name.toLowerCase()} interior design in Chennai?`,
      a: `Commercial ${vertical.name.toLowerCase()} rates in Chennai range from ₹100 to ₹350 per sqft for fit-out execution depending on area size, finishes, and technical complexity. All quotes are itemised upfront.`,
    },
    {
      q: `How long does execution take for a ${vertical.name.toLowerCase()} project?`,
      a: `Luxe Axis guarantees completion within 45 days of 3D design approval, backed by a written delay compensation clause in your contract.`,
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

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          {/* The vertical's own name, not the humanised slug —
              `retail-hospitality` should read "Retail & Hospitality". */}
          <Breadcrumbs
            path={`/commercial/${vertical.slug}`}
            labels={{ [vertical.slug]: vertical.name }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Commercial Architecture & Interiors
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              {vertical.name} Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              {vertical.summary} Designed against how the space performs, backed by a 45-day fit-out guarantee and flat 10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Request a Consult
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                View Commercial Projects →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">45 Days</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Fit-Out Guarantee</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10 Yr</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Flat Warranty</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">100%</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Fixed BOQ Quote</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">4.9 ★</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Google Rating</span>
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
            <div key={concern} className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4">
              <span className="font-display text-h3 font-bold text-accent shrink-0">0{idx + 1}</span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">{concern}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  Engineered into the initial CAD floor plan and 3D spatial layout to eliminate mid-project alterations and operational friction.
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
            <div key={space.title} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image src={space.image} alt={space.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">{space.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{space.desc}</p>
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
                  <th scope="col" className="py-3 pr-4 font-display font-bold">Segment</th>
                  <th scope="col" className="py-3 pr-4 font-display font-bold">Typical Area</th>
                  <th scope="col" className="py-3 pr-4 font-display font-bold">Build Rate</th>
                  <th scope="col" className="py-3 font-display font-bold">Design Fee</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr key={rate.id} className="border-b border-border-subtle/40 align-top">
                    <th scope="row" className="py-4 pr-4 text-left font-display font-bold text-on-surface">
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
                          + {Math.round(rate.executionMargin * 100)}% execution margin
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
              src: '/images/hero/hero-slide-4.jpg',
              alt: `Bare shell before ${vertical.name.toLowerCase()} fit-out`,
            }}
            afterImage={{
              src: '/images/hero/hero-slide-2.jpg',
              alt: `Completed ${vertical.name.toLowerCase()} interior in Chennai`,
            }}
          />
        </div>
      </Section>

      {/* 6. Process Steps */}
      <ProcessSteps />

      {/* 7. Client Reviews */}
      <Section
        id="reviews"
        eyebrow="Verified Feedback"
        title={`What ${vertical.name} Clients Say`}
        lede="Delivered on schedule with 100% fixed BOQ commitment."
      >
        <Grid cols={2} gap={6}>
          {testimonials.map((t) => (
            <div key={t.name} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="flex text-accent text-small mb-3">{'★'.repeat(t.stars)}</div>
                <blockquote className="text-body text-on-surface-2 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <div className="pt-4 border-t border-border-subtle/50">
                <strong className="block font-display text-small font-bold text-on-surface">{t.name}</strong>
                <span className="text-overline text-accent uppercase tracking-wider">{t.company}</span>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 8. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title={`${vertical.name} Interior FAQ`}
        lede="Key answers before booking your commercial consultation."
      >
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

      {/* 9. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
