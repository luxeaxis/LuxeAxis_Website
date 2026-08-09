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
import { PORTFOLIO_HERO_SLIDES } from '@/lib/content/heroSlides';

const ROUTE = '/portfolio';

export const metadata: Metadata = {
  title: 'Portfolio & Completed Projects Catalogue | Luxe Axis',
  description:
    'Curated interior projects in Chennai. Penthouses, gated estate villas, luxury apartments, and commercial workplaces. Real photography, 10-year flat warranty.',
  alternates: canonicalFor(ROUTE),
};

export default async function PortfolioPage() {
  const highlights = [
    { title: 'Penthouses', desc: 'High-Rise Panoramic Sky Villas' },
    { title: 'Gated Estate Villas', desc: 'Vastu-Tech Private Sanctuaries' },
    { title: 'Luxury Apartments', desc: 'Smart 2BHK, 3BHK & 4BHK Homes' },
    { title: 'Commercial Fit-Outs', desc: 'IT Corridors & Corporate HQs' },
    { title: 'Real Photography', desc: 'Published Only With Client Consent' },
  ];

  const categories = [
    {
      title: 'Penthouse & Sky Villas',
      count: '15+ Projects',
      desc: 'Panoramic high-rise duplex transformations with double-height Italian marble walls and automated sky lounges.',
      href: '/portfolio/penthouses',
      image: '/posters/residential-living-room-hero.png',
    },
    {
      title: 'Gated Estate Villas',
      count: '25+ Projects',
      desc: 'Sprawling private sanctuary architecture with Vastu-Tech solar alignment, central courtyards, and solid teakwood joinery.',
      href: '/portfolio/villas',
      image: '/posters/residential-luxury-hero.png',
    },
    {
      title: 'Luxury Apartments',
      count: '150+ Projects',
      desc: 'Smart 2BHK, 3BHK, and 4BHK urban flat interiors featuring Blum soft-close BWP kitchens and sensor wardrobes.',
      href: '/portfolio/apartments',
      image: '/posters/residential-apartments-hero.png',
    },
  ];

  const showcaseProjects = [
    {
      title: 'The Emerald Villa',
      category: 'Villa',
      location: 'Adyar, Chennai',
      area: '8,200 sq.ft',
      tier: 'Elite Tier',
      image: '/posters/residential-luxury-hero.png',
      desc: '5BHK gated villa featuring central open-to-sky courtyard, Vastu-Tech brass mandap, and Calacatta marble flooring.',
    },
    {
      title: 'The OMR Duplex Penthouse',
      category: 'Penthouse',
      location: 'OMR, Chennai',
      area: '5,800 sq.ft',
      tier: 'Signature Tier',
      image: '/posters/residential-living-room-hero.png',
      desc: 'Double-height living room with book-matched Calacatta marble wall, suspended brass chandelier, and automated sky lounge.',
    },
    {
      title: 'Nungambakkam Sky Villa',
      category: 'Penthouse',
      location: 'Nungambakkam, Chennai',
      area: '6,400 sq.ft',
      tier: 'Elite Tier',
      image: '/posters/residential-apartments-hero.png',
      desc: 'Panoramic terrace apartment with Venetian plaster walls, motorized drapery, and integrated Bang & Olufsen soundscapes.',
    },
    {
      title: 'The T. Nagar 3BHK Residence',
      category: 'Apartment',
      location: 'T. Nagar, Chennai',
      area: '1,850 sq.ft',
      tier: 'Signature Tier',
      image: '/posters/home-interiors-hero.png',
      desc: 'Smart 3BHK apartment with fluted louvers, concealed pooja room mandap, and acrylic modular kitchen.',
    },
    {
      title: 'Besant Nagar Coastal Estate',
      category: 'Villa',
      location: 'Besant Nagar, Chennai',
      area: '7,500 sq.ft',
      tier: 'Elite Tier',
      image: '/posters/nri-hub-hero.png',
      desc: 'Contemporary beachside villa with teakwood ceiling rafters, sea-facing master suite lounge, and automated deck.',
    },
    {
      title: 'Velachery 4BHK Luxury Flat',
      category: 'Apartment',
      location: 'Velachery, Chennai',
      area: '2,400 sq.ft',
      tier: 'Signature Tier',
      image: '/posters/residential-bedroom-hero.png',
      desc: 'Spacious 4BHK featuring Italian marble dining counter, floor-to-ceiling sliding wardrobes, and Gyproc false ceilings.',
    },
    {
      title: 'Sholinganallur Open IT Campus',
      category: 'Commercial',
      location: 'Sholinganallur, Chennai',
      area: '12,000 sq.ft',
      tier: 'Commercial Fit-Out',
      image: '/posters/digital-hub-hero.png',
      desc: 'Activity-based workstations, collaborative tech hubs, quiet zones, and acoustic sound-masking ceiling baffles.',
    },
    {
      title: 'Anna Nagar Heritage Villa',
      category: 'Villa',
      location: 'Anna Nagar, Chennai',
      area: '6,800 sq.ft',
      tier: 'Signature Tier',
      image: '/posters/residential-pooja-room-hero.png',
      desc: 'Modernized traditional villa with carved solid teak main door, onyx lighted bar counter, and home theater suite.',
    },
  ];

  const whyPortfolio = [
    {
      num: '01',
      title: 'Real Photography, Zero Fake Renders',
      desc: 'Every image in our portfolio represents a real, completed home or commercial space delivered to a client in Chennai.',
    },
    {
      num: '02',
      title: 'Client Consent Guarantee',
      desc: 'We respect privacy. A client home is published only after written consent, honoring our non-disclosure commitment.',
    },
    {
      num: '03',
      title: 'Transparent Sourcing & Provenance',
      desc: 'From Italian marble quarries in Tuscany to Hettich hardware in Germany, every material provenance is documented.',
    },
    {
      num: '04',
      title: '100% Contractual On-Time Handover',
      desc: 'Every project shown was handed over on or before schedule under our written contractual milestone timeline guarantee.',
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'Can I visit a completed Luxe Axis project in person?',
      a: 'Yes. Upon request and subject to client permission, we arrange private walk-through visits to completed or ongoing villa and apartment sites.',
    },
    {
      q: 'Are all projects shown real photographs?',
      a: 'Yes. We do not substitute physical portfolio galleries with 3D renders. All images represent real completed projects in Chennai.',
    },
    {
      q: 'How are investment tiers (Essential, Signature, Elite) assigned?',
      a: 'Tiers are determined by carpet area, material specifications (e.g., acrylic vs Italian lacquer, Indian vs imported marble), and custom joinery complexity.',
    },
    {
      q: 'Does Luxe Axis handle turnkey end-to-end execution?',
      a: 'Yes. We manage design, civil modifications, MEP engineering, material procurement, factory fabrication, on-site installation, and final handover.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Portfolio & Completed Projects Catalogue | Luxe Axis',
          description:
            'Curated interior projects in Chennai. Penthouses, gated estate villas, luxury apartments, and commercial workplaces.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage with Animated Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={PORTFOLIO_HERO_SLIDES} />

        <Container className="relative z-10">
          <Breadcrumbs path="/portfolio" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Curated Architectural & Interior Works
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Completed Projects <br />
              <span className="text-accent">Catalogue</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Real photography of finished luxury residences and commercial environments across Chennai.
              Explore our curated penthouse sky villas, gated estate sanctuaries,
              high-rise apartments, and corporate IT headquarters.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg" className="shadow-2xl">
                Book Free Design Audit
              </Button>
              <Button
                as="a"
                href="/pricing"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                Calculate Project BOQ →
              </Button>
            </div>

            {/* Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  45+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Delivered Works
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  100%
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  On-Time Handover
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  10 Yr
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Flat Warranty
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  4.9 ★
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Google Rating
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center col-span-2 sm:col-span-1">
                <strong className="block font-display text-h3 text-accent font-bold">
                  3+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Chennai Studios
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

      {/* 3. Category Selector Cards */}
      <Section
        id="categories"
        eyebrow="Explore By Property Type"
        title="Curated Residence Categories"
        lede="Filter our portfolio by dedicated property scale and architectural complexity."
      >
        <Grid cols={3} gap={6}>
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {cat.count}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {cat.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {cat.desc}
                </p>
              </div>
              <Button
                as="a"
                href={cat.href}
                variant="secondary"
                className="w-full justify-center"
              >
                View {cat.title} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Showcase Projects Grid */}
      <Section
        id="showcase"
        eyebrow="All Delivered Works"
        title="Completed Projects Gallery"
        lede="Real photographs of delivered homes and commercial spaces across Chennai."
      >
        <Grid cols={2} gap={6}>
          {showcaseProjects.map((p) => (
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
                    Category: <strong>{p.category}</strong> ({p.area})
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

      {/* 5. Why Luxe Axis Portfolio */}
      <Section
        id="why-portfolio"
        eyebrow="Portfolio Standard"
        title="Why Our Portfolio Is Trusted"
        lede="We believe in empirical proof over marketing hype."
      >
        <Grid cols={2} gap={6}>
          {whyPortfolio.map((item) => (
            <div
              key={item.num}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h2 font-bold text-accent shrink-0">
                {item.num}
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {item.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 6. Before & After Slider */}
      <Section
        id="transformation"
        eyebrow="Real Transformations"
        title="Before and After: Real Chennai Residence"
        lede="Bare shell space transformed into a luxury Vastu-Tech home in Adyar, Chennai."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare villa shell before fit-out',
            }}
            afterImage={{
              src: '/posters/hero.avif',
              alt: 'Completed luxury interior by Luxe Axis',
            }}
          />
        </div>
      </Section>

      {/* 7. Process */}
      <ProcessSteps />

      {/* 8. Verified Reviews */}
      <TestimonialBand testimonials={testimonials} />

      {/* 9. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="Portfolio FAQ">
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

      {/* 10. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
