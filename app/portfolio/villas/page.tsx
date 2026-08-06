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

const ROUTE = '/portfolio/villas';

export const metadata: Metadata = {
  title: 'Luxury Villa & Gated Estate Interiors in Chennai | Luxe Axis Portfolio',
  description:
    'Private estate villas, independent bungalows, and luxury gated community home interiors in Chennai. Vastu-Tech solar alignment, Italian marble & brass joinery.',
  alternates: canonicalFor(ROUTE),
};

export default function VillasPortfolioPage() {
  const highlights = [
    { title: 'Vastu-Tech Grid', desc: 'Solar Orientation & Cosmic Energy Alignment' },
    { title: 'Italian Marble', desc: 'Book-Matched Calacatta & Michelangelo Stone' },
    { title: 'Custom Millwork', desc: 'Teakwood Doors & Liquid Metal Partitions' },
    { title: 'Smart Home Automation', desc: 'Circadian Lighting & Security Integration' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Villa Guarantee' },
  ];

  const projects = [
    {
      title: 'The Emerald Villa',
      location: 'Adyar, Chennai',
      area: '8,200 sq.ft',
      tier: 'Elite Tier',
      desc: 'Sprawling 5BHK gated villa featuring central open-to-sky courtyard, Vastu-Tech brass mandap, and Calacatta marble flooring.',
      image: '/images/hero/hero-slide-4.jpg',
    },
    {
      title: 'Besant Nagar Coastal Estate',
      location: 'Besant Nagar, Chennai',
      area: '7,500 sq.ft',
      tier: 'Elite Tier',
      desc: 'Contemporary beachside villa with teakwood ceiling rafters, sea-facing master suite lounge, and automated infinity pool deck.',
      image: '/images/hero/hero-slide-1.jpg',
    },
    {
      title: 'ECR Sanctuary Bungalow',
      location: 'ECR, Chennai',
      area: '9,000 sq.ft',
      tier: 'Elite Tier',
      desc: 'Private gated estate with tropical courtyard landscaping, double-volume dining room, and custom wine cellar.',
      image: '/images/hero/hero-slide-2.jpg',
    },
    {
      title: 'Anna Nagar Heritage Villa',
      location: 'Anna Nagar, Chennai',
      area: '6,800 sq.ft',
      tier: 'Signature Tier',
      desc: 'Modernized traditional villa with carved solid teak main door, onyx lighted bar counter, and home theater suite.',
      image: '/images/hero/hero-slide-3.jpg',
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

  const testimonials = [
    {
      name: 'R. K. Swaminathan',
      location: 'Adyar, Chennai',
      quote:
        'Luxe Axis designed and executed our 8,200 sqft villa in Adyar with extraordinary craft. The Vastu-Tech layout and marble work exceed expectations.',
    },
    {
      name: 'Nisha & Senthil Nathan',
      location: 'ECR, Chennai',
      quote:
        'Our ECR estate villa feels like a 5-star private resort. Delivered on schedule with complete financial transparency throughout.',
    },
  ];

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
          description: 'Private estate villas, independent bungalows, and luxury gated community home interiors in Chennai.',
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
              <li><a href="/portfolio" className="hover:text-accent transition-colors">Portfolio</a></li>
              <span>/</span>
              <li aria-current="page" className="text-accent font-semibold">Gated Estate Villas</li>
            </ol>
          </nav>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Private Estate Architecture
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Luxury Villa & Estate <br />
              <span className="text-accent">Interiors in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Private estate villas, independent bungalows, and luxury gated community homes. Vastu-Tech solar alignment, Italian marble, and bespoke teakwood joinery.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Villa Design Audit
              </Button>
              <Button as="a" href="/pricing" variant="secondary" size="lg">
                View Villa BOQ Calculator →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">25+</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Villas Delivered</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">75 Days</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Handover Guarantee</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10 Yr</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Flat Warranty</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">4.9 ★</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Google Rating</span>
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

      {/* 3. Showcase Projects */}
      <Section
        id="projects"
        eyebrow="Featured Villa Works"
        title="Curated Private Estates"
        lede="Explore our delivered villa and bungalow projects across Chennai."
      >
        <Grid cols={2} gap={6}>
          {projects.map((p) => (
            <div key={p.title} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {p.tier}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-h3 font-bold text-on-surface">{p.title}</h3>
                  <span className="text-overline text-accent font-bold">📍 {p.location}</span>
                </div>
                <p className="text-small text-on-surface-2 leading-relaxed mb-3">{p.desc}</p>
                <div className="pt-3 border-t border-border-subtle/40 flex items-center justify-between text-small text-on-surface-3">
                  <span>Carpet Area: <strong>{p.area}</strong></span>
                  <span className="text-accent font-medium">10-Year Warranty</span>
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
            <div key={f.title} className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4">
              <span className="font-display text-h2 font-bold text-accent shrink-0">0{idx + 1}</span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">{f.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{f.desc}</p>
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
            beforeImage={{ src: '/images/hero/hero-slide-4.jpg', alt: 'Bare villa shell before fit-out' }}
            afterImage={{ src: '/images/hero/hero-slide-2.jpg', alt: 'Completed villa interior in Adyar' }}
          />
        </div>
      </Section>

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. Reviews */}
      <Section
        id="reviews"
        eyebrow="Client Testimonials"
        title="What Villa Owners Say"
        lede="Verified client feedback from villa projects in Chennai."
      >
        <Grid cols={2} gap={6}>
          {testimonials.map((t) => (
            <div key={t.name} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="flex text-accent text-small mb-3">★★★★★</div>
                <blockquote className="text-body text-on-surface-2 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <div className="pt-4 border-t border-border-subtle/50">
                <strong className="block font-display text-small font-bold text-on-surface">{t.name}</strong>
                <span className="text-overline text-accent uppercase tracking-wider">📍 {t.location}</span>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 8. FAQ */}
      <Section id="faq" eyebrow="Questions Answered" title="Villa Interior FAQ">
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
