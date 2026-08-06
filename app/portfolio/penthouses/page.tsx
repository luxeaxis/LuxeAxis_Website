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

const ROUTE = '/portfolio/penthouses';

export const metadata: Metadata = {
  title: 'Penthouse & High-Rise Interiors in Chennai | Luxe Axis Portfolio',
  description:
    'Panoramic duplex penthouses, sky villas, and high-rise luxury interiors in Chennai. Custom Calacatta marble, double-height acoustic joinery, and home automation.',
  alternates: canonicalFor(ROUTE),
};

export default function PenthousesPortfolioPage() {
  const highlights = [
    { title: 'Skyline Panoramas', desc: 'Double-Height Glass Wall Framing' },
    { title: 'Imported Marble', desc: 'Calacatta & Statuario Italian Slabs' },
    { title: 'Acoustic Insulation', desc: 'Sound-Dampened Double Glazing' },
    { title: 'Bespoke Joinery', desc: 'Fluted Walnut & Liquid Brass Panels' },
    { title: 'Flat 10-Year Warranty', desc: 'Zero Fine Print Structural Guarantee' },
  ];

  const projects = [
    {
      title: 'The OMR Duplex Penthouse',
      location: 'OMR, Chennai',
      area: '5,800 sq.ft',
      tier: 'Signature Tier',
      desc: 'Double-height living room with book-matched Calacatta marble wall, suspended brass chandelier, and automated sky lounge.',
      image: '/images/hero/hero-slide-1.jpg',
    },
    {
      title: 'Nungambakkam Sky Villa',
      location: 'Nungambakkam, Chennai',
      area: '6,400 sq.ft',
      tier: 'Elite Tier',
      desc: 'Panoramic terrace apartment with Venetian plaster walls, motorized drapery, and integrated Bang & Olufsen soundscapes.',
      image: '/images/hero/hero-slide-2.jpg',
    },
    {
      title: 'Adyar Riverfront Penthouse',
      location: 'Adyar, Chennai',
      area: '5,200 sq.ft',
      tier: 'Elite Tier',
      desc: 'Full-floor residence with private elevator vestibule, smoked oak flooring, and custom Italian glass wardrobes.',
      image: '/images/hero/hero-slide-3.jpg',
    },
    {
      title: 'Anna Nagar Tower Residence',
      location: 'Anna Nagar, Chennai',
      area: '4,600 sq.ft',
      tier: 'Signature Tier',
      desc: 'Minimalist penthouse featuring cantilevered stone breakfast island, concealed pantry door, and smart lighting scenes.',
      image: '/images/hero/hero-slide-4.jpg',
    },
  ];

  const features = [
    {
      title: 'Double-Height Architectural Statements',
      desc: 'Cladding walls up to 22 feet with unbroken book-matched Italian marble slabs and acoustic acoustic baffles.',
    },
    {
      title: 'Integrated Home Automation & Lighting',
      desc: 'Circadian lighting scenes, motorized sheer curtains, and climate control managed from a single iPad panel.',
    },
    {
      title: 'Private Sky Lounges & Terraces',
      desc: 'Weatherproof teak deck flooring, stainless steel outdoor kitchenettes, and concealed LED perimeter lighting.',
    },
    {
      title: 'Acoustic Soundproofing',
      desc: 'Double-glazed acoustic partitions ensuring total silence from city noise and high-altitude wind resonance.',
    },
  ];

  const testimonials = [
    {
      name: 'Ketan & Shweta Parekh',
      location: 'Nungambakkam, Chennai',
      quote:
        'Our 6,400 sqft penthouse transformation by Luxe Axis is breath-taking. The double-height marble wall and home automation work flawlessly.',
    },
    {
      name: 'Dr. Vikramaditya',
      location: 'OMR, Chennai',
      quote:
        'Handing over a 5,800 sqft penthouse in 60 days seemed impossible, but Luxe Axis delivered on time with zero cost escalation.',
    },
  ];

  const faqs = [
    {
      q: 'What is the cost of penthouse interior design in Chennai?',
      a: 'Penthouse interior fit-outs typically start from ₹60 Lakhs to ₹2 Crore+ depending on square footage, marble selections, custom joinery, and automation tiers.',
    },
    {
      q: 'How do you handle heavy material transport to top floors?',
      a: 'We coordinate with tower management, use specialized exterior hoists or service elevators, and protect all public corridors during material delivery.',
    },
    {
      q: 'How long does a penthouse interior fit-out take?',
      a: 'Typical penthouse projects are completed within 60 to 75 days, backed by written delay compensation in your contract.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Penthouse & High-Rise Interiors in Chennai',
          description: 'Panoramic duplex penthouses, sky villas, and high-rise luxury interiors in Chennai.',
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
              <li aria-current="page" className="text-accent font-semibold">Penthouse Residences</li>
            </ol>
          </nav>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                High-Rise Architectural Fit-Outs
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Penthouse & Sky Villa <br />
              <span className="text-accent">Interiors in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Panoramic duplex penthouses, sky villas, and high-rise luxury interiors. Custom Italian marble, double-height acoustic joinery, and integrated home automation.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Penthouse Audit
              </Button>
              <Button as="a" href="/pricing" variant="secondary" size="lg">
                View Investment Tiers →
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">15+</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Penthouses Completed</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">60 Days</strong>
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
        eyebrow="Featured Penthouse Works"
        title="Curated Sky Residences"
        lede="Explore our delivered penthouse and duplex projects across Chennai."
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
        eyebrow="Architectural Excellence"
        title="Engineering High-Rise Sanctuaries"
        lede="Key architectural features designed for high-altitude luxury living."
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
        eyebrow="Penthouse Renovation"
        title="Bare Shell Sky Apartment to Luxury Penthouse"
        lede="Real high-rise penthouse transformation in OMR, Chennai."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{ src: '/images/hero/hero-slide-4.jpg', alt: 'Bare shell penthouse space before fit-out' }}
            afterImage={{ src: '/images/hero/hero-slide-1.jpg', alt: 'Completed penthouse interior in OMR' }}
          />
        </div>
      </Section>

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. Reviews */}
      <Section
        id="reviews"
        eyebrow="Client Testimonials"
        title="What Penthouse Owners Say"
        lede="Verified client feedback from penthouse projects in Chennai."
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
      <Section id="faq" eyebrow="Questions Answered" title="Penthouse Interior FAQ">
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
