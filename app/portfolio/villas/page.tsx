import { getTestimonials } from '@/lib/content/source';
import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { canonicalFor } from '@/lib/seo/hreflang';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { VILLAS_PORTFOLIO_HERO_SLIDES } from '@/lib/content/heroSlides';

const ROUTE = '/portfolio/villas';

export const metadata: Metadata = {
  title:
    'Luxury Villa & Gated Estate Interiors in Chennai | Luxe Axis Portfolio',
  description:
    'Private estate villas, independent bungalows, and luxury gated community home interiors in Chennai. Vastu-Tech solar alignment, Italian marble & brass joinery.',
  alternates: canonicalFor(ROUTE),
};

export default async function VillasPortfolioPage() {
  const highlights = [
    {
      title: 'Vastu-Tech Grid',
      desc: 'Solar Orientation & Cosmic Energy Alignment',
    },
    {
      title: 'Italian Marble',
      desc: 'Book-Matched Calacatta & Michelangelo Stone',
    },
    {
      title: 'Custom Millwork',
      desc: 'Teakwood Doors & Liquid Metal Partitions',
    },
    {
      title: 'Smart Home Automation',
      desc: 'Circadian Lighting & Security Integration',
    },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Villa Guarantee' },
  ];

  const projects = [
    {
      title: 'The Emerald Villa',
      location: 'Adyar, Chennai',
      area: '8,200 sq.ft',
      tier: 'Elite Tier',
      desc: 'Sprawling 5BHK gated villa featuring central open-to-sky courtyard, Vastu-Tech brass mandap, and Calacatta marble flooring.',
      image: '/posters/project-villa-velachery.png',
    },
    {
      title: 'Besant Nagar Coastal Estate',
      location: 'Besant Nagar, Chennai',
      area: '7,500 sq.ft',
      tier: 'Elite Tier',
      desc: 'Contemporary beachside villa with exposed teakwood ceiling rafters, sea-facing master suite lounge, and automated infinity pool deck.',
      image: '/posters/villa-besant-nagar-coastal.png',
    },
    {
      title: 'ECR Sanctuary Bungalow',
      location: 'ECR, Chennai',
      area: '9,000 sq.ft',
      tier: 'Elite Tier',
      desc: 'Private gated estate with central tropical courtyard landscaping, double-volume dining room, and solid live-edge teak dining suite.',
      image: '/posters/villa-ecr-sanctuary.png',
    },
    {
      title: 'Anna Nagar Heritage Villa',
      location: 'Anna Nagar, Chennai',
      area: '6,800 sq.ft',
      tier: 'Signature Tier',
      desc: 'Modernized traditional villa with handcrafted teak fluted paneling, backlit honey onyx bar counter, and home theater suite.',
      image: '/posters/villa-annanagar-heritage.png',
    },
  ];

  const features = [
    {
      title: 'Courtyard & Indoor-Outdoor Integration',
      desc: 'Designing central skylit courtyards that bring natural daylight, fresh ventilation, and lush greenery into the living core.',
    },
    {
      title: 'Vastu-Tech Orientation Precision',
      desc: 'Aligning prayer rooms, master beds, kitchens, and water bodies precisely to ancient Vastu compass vectors.',
    },
    {
      title: 'Heavy Italian Marble Joinery',
      desc: 'Custom-carved marble staircase steps, book-matched tv consoles, and seamlessly flush floor transitions.',
    },
    {
      title: 'Private Entertainment & Wellness Suites',
      desc: 'Dedicated home theaters, spa bath chambers, gym suites, and executive home office studies.',
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is the cost of villa interior design in Chennai?',
      a: 'Villa interior projects in Chennai typically range from ₹40 Lakhs for essential fit-outs up to ₹2 Crore+ for bespoke Elite whole-home commissions.',
    },
    {
      q: 'Do you work alongside our civil architect?',
      a: 'Yes. We collaborate closely with your civil architect and structural engineers from ground-breaking to final handover.',
    },
    {
      q: 'How long does a full villa interior project take?',
      a: 'Full villa interiors are typically completed within 75 to 90 days, governed by contractual milestone guarantees.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Luxury Villa & Gated Estate Interiors in Chennai',
          description:
            'Private estate villas, independent bungalows, and luxury gated community home interiors in Chennai.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage with Full-Bleed Animated Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={VILLAS_PORTFOLIO_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs
            path="/portfolio/villas"
            labels={{ villas: 'Gated Estate Villas' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Private Estate Architecture
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Luxury Villa & Estate <br />
              <span className="text-accent">Interiors in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Private estate villas, independent bungalows, and luxury gated
              community homes. Vastu-Tech solar alignment, Italian marble, and
              bespoke teakwood joinery.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg" className="shadow-2xl">
                Book Villa Design Audit
              </Button>
              <Button
                as="a"
                href="/pricing"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View Villa BOQ Calculator →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  25+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Villas Delivered
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  75 Days
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

      {/* 3. Showcase Projects */}
      <Section
        id="projects"
        eyebrow="Featured Villa Works"
        title="Curated Private Estates"
        lede="Explore our delivered villa and bungalow projects across Chennai."
      >
        <Grid cols={2} gap={6}>
          {projects.map((p) => (
            <div
              key={p.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {p.tier}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-h3 font-bold text-on-surface">
                    {p.title}
                  </h3>
                  <span className="text-overline text-accent font-bold">
                    📍 {p.location}
                  </span>
                </div>
                <p className="text-small text-on-surface-2 leading-relaxed mb-3">
                  {p.desc}
                </p>
                <div className="pt-3 border-t border-border-subtle/40 flex items-center justify-between text-small text-on-surface-muted">
                  <span>
                    Carpet Area: <strong>{p.area}</strong>
                  </span>
                  <span className="text-accent font-medium">
                    10-Year Warranty
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Design Features */}
      <Section
        id="features"
        eyebrow="Bespoke Villa Elements"
        title="Crafting Sanctuary Architecture"
        lede="Key architectural features designed for sprawling estate residences."
      >
        <Grid cols={2} gap={6}>
          {features.map((f, idx) => (
            <div
              key={f.title}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h2 font-bold text-accent shrink-0">
                0{idx + 1}
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

      {/* 5. Before & After */}
      <Section
        id="transformation"
        eyebrow="Villa Renovation"
        title="Bare Shell Villa to Vastu-Tech Estate"
        lede="Real villa transformation in Adyar, Chennai."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/emerald-villa-before.png',
              alt: 'Raw bare-shell villa estate in Adyar before turnkey execution',
            }}
            afterImage={{
              src: '/posters/project-villa-velachery.png',
              alt: 'Completed luxury estate villa living room in Adyar',
            }}
          />
        </div>
      </Section>

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. Reviews */}
      <TestimonialBand testimonials={testimonials} />

      {/* 8. FAQ */}
      <Section id="faq" eyebrow="Questions Answered" title="Villa Interior FAQ">
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
