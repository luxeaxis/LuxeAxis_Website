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
import { APARTMENTS_PORTFOLIO_HERO_SLIDES } from '@/lib/content/heroSlides';

const ROUTE = '/portfolio/apartments';

export const metadata: Metadata = {
  title: 'Luxury Apartment Interiors in Chennai | Luxe Axis Portfolio',
  description:
    'Luxury 2BHK, 3BHK, and 4BHK apartment interior design in Chennai. Smart space optimization, Blum soft-close kitchens, sensor wardrobes & 45-day delivery guarantee.',
  alternates: canonicalFor(ROUTE),
};

export default async function ApartmentsPortfolioPage() {
  const highlights = [
    { title: 'Space Optimization', desc: 'Zero Dead Corner Layout Planning' },
    { title: 'Blum Soft-Close', desc: 'BWP Marine Plywood Kitchen Cabinets' },
    { title: 'Sensor Lighting', desc: 'LED Wardrobes & Cove Ceilings' },
    { title: '45-Day Handover', desc: 'Contractual Delay Compensation' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Guarantee' },
  ];

  const projects = [
    {
      title: 'The T. Nagar 3BHK Residence',
      location: 'T. Nagar, Chennai',
      area: '1,850 sq.ft',
      tier: 'Signature Tier',
      desc: 'Smart 3BHK apartment with fluted louvers, concealed pooja room mandap, and acrylic modular kitchen.',
      image: '/posters/project-2bhk-tnagar.png',
    },
    {
      title: 'Velachery 4BHK Luxury Flat',
      location: 'Velachery, Chennai',
      area: '2,400 sq.ft',
      tier: 'Signature Tier',
      desc: 'Spacious 4BHK featuring Italian Botticino marble breakfast counter, Gyproc false ceiling, and magnetic architectural track lights.',
      image: '/posters/apt-velachery-4bhk.png',
    },
    {
      title: 'Sholinganallur 2BHK Modern Home',
      location: 'Sholinganallur, Chennai',
      area: '1,250 sq.ft',
      tier: 'Essential Tier',
      desc: 'Compact 2BHK designed with space-saving fluted oak media console, bronze mirror wall accents, and warm ambient LED lighting.',
      image: '/posters/apt-sholinganallur-2bhk.png',
    },
    {
      title: 'Anna Nagar Gated Apartment',
      location: 'Anna Nagar, Chennai',
      area: '2,100 sq.ft',
      tier: 'Signature Tier',
      desc: 'Elegant 3BHK with backlit translucent quartz TV backdrop, smoked walnut cabinetry, and smart home lighting scenes.',
      image: '/posters/apt-annanagar-gated.png',
    },
  ];

  const features = [
    {
      title: 'Zero-Dead-Space Ergonomics',
      desc: 'Maximizing every square foot in urban Chennai apartments with smart storage, pull-out larders, and concealed furniture.',
    },
    {
      title: 'Acoustic Balcony & Window Sealing',
      desc: 'UPVC and aluminium double-pane windows that seal out traffic noise while letting in natural daylight.',
    },
    {
      title: 'Custom Modular Millwork',
      desc: 'Marine BWP plywood cabinets with anti-termite treatment and 100% moisture resistance for humid coastal Chennai weather.',
    },
    {
      title: '45-Day Fast Fit-Out Handover',
      desc: 'Offsite pre-factory fabrication ensuring on-site assembly is completed in 45 days with zero neighbor disruption.',
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is the cost of apartment interior design in Chennai?',
      a: 'Apartment interiors range from ₹3.5 Lakhs for a 1BHK Essential fit-out up to ₹25 Lakhs for a 3BHK/4BHK Signature luxury transformation.',
    },
    {
      q: 'How long does a 3BHK apartment fit-out take?',
      a: 'We guarantee 3BHK apartment handover within 45 days of 3D design approval, backed by a written contract guarantee.',
    },
    {
      q: 'Is modular kitchen and wardrobe hardware covered under warranty?',
      a: 'Yes. All hardware (Hettich, Hafele, Blum) and cabinetry are covered under our flat 10-year warranty with zero service fees.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Luxury Apartment Interiors in Chennai',
          description:
            'Luxury 2BHK, 3BHK, and 4BHK apartment interior design in Chennai.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage with Full-Bleed Animated Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={APARTMENTS_PORTFOLIO_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs
            path="/portfolio/apartments"
            labels={{ apartments: 'Luxury Apartments' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Urban Apartment Interiors
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Luxury Apartment <br />
              <span className="text-accent">Interiors in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Luxury 2BHK, 3BHK, and 4BHK apartment interior design in Chennai.
              Smart space optimization, Blum soft-close kitchens, sensor
              wardrobes, and 45-day handover guarantee.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg" className="shadow-2xl">
                Book Apartment Audit
              </Button>
              <Button
                as="a"
                href="/pricing"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View Apartment Calculator →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  150+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Flats Completed
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
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
        eyebrow="Featured Apartment Works"
        title="Curated Urban Flats"
        lede="Explore our delivered 2BHK, 3BHK, and 4BHK apartment projects across Chennai."
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
                    45-Day Handover
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
        eyebrow="Smart Apartment Architecture"
        title="Engineering Modern Flat Spaces"
        lede="Key features designed for effortless urban apartment living."
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
        eyebrow="Apartment Makeover"
        title="Bare Shell Flat to Modern 3BHK Home"
        lede="Real apartment transformation in T. Nagar, Chennai."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/apt-before-construction-raw.png',
              alt: 'Bare shell 3BHK flat in T. Nagar before turnkey design and execution',
            }}
            afterImage={{
              src: '/posters/project-2bhk-tnagar.png',
              alt: 'Completed luxury 3BHK apartment interior in T. Nagar',
            }}
          />
        </div>
      </Section>

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. Reviews */}
      <TestimonialBand testimonials={testimonials} />

      {/* 8. FAQ */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Apartment Interior FAQ"
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

      <CTASection />
    </main>
  );
}
