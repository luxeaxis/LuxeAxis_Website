import { getTestimonials } from '@/lib/content/source';
import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { JsonLd } from '@/components/JsonLd';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';

const ROUTE = '/residential/luxury';

export const metadata: Metadata = {
  title: 'Luxury Interior Designers in Chennai | Luxe Axis',
  description:
    'Luxury interior designers in Chennai. Calacatta marble, Italian veneer, solid brass hardware. 45-day delivery guarantee, flat 10-year warranty, bespoke 3D commissions.',
  alternates: canonicalFor(ROUTE),
};

export default async function LuxuryPage() {
  const highlights = [
    {
      title: 'Bespoke Commission',
      desc: 'Designed Once, Exclusively for Your Home',
    },
    {
      title: 'Verified Provenance',
      desc: 'Authentic Calacatta Marble & Italian Veneers',
    },
    {
      title: '45-Day Guarantee',
      desc: 'Contractual Delivery with Delay Compensation',
    },
    {
      title: 'Flat 10-Year Warranty',
      desc: 'Zero Fine Print, Zero Exclusions, Zero Service Fees',
    },
    {
      title: '3D VR Approval',
      desc: 'Full 3D Visual Sign-Off Before Work Begins',
    },
  ];

  const philosophyPillars = [
    {
      num: '01',
      title: 'Provenance',
      desc: 'Materials sourced for origin and quality, not catalog availability. Calacatta marble, Italian veneers, and solid brass hardware approved by you before procurement.',
    },
    {
      num: '02',
      title: 'Exactness',
      desc: 'Millimeter precision in every joint, edge, and surface. Crafted by skilled master artisans under direct Luxe Axis supervision with zero site compromise.',
    },
    {
      num: '03',
      title: 'Permanence',
      desc: 'A flat 10-year warranty on every element. No fine print, no exclusions, no service fees. Built to endure without maintenance anxiety.',
    },
  ];

  const materialsProvenance = [
    {
      origin: 'Apuane Alps, Tuscany',
      name: 'Calacatta Marble',
      tag: 'Natural Stone',
      desc: 'The benchmark of natural stone. Dramatic veining, warmth underfoot, and a presence that defines entire rooms. Sealed and calibrated for Chennai’s climate.',
      specs: [
        'Book-matched slabs selected on site',
        'Polished, honed, and leathered finishes',
        'Flooring, feature walls & countertops',
        'Sealed against humidity & staining',
      ],
    },
    {
      origin: 'Certified European Suppliers',
      name: 'Italian Veneer',
      tag: 'Premium Wood',
      desc: 'Wood that speaks in texture. Each panel is hand-selected for grain continuity and applied to joinery, wardrobes, feature walls, and ceiling cassettes.',
      specs: [
        'Grain-matched and sequenced panels',
        'European walnut, oak, and wenge',
        'Certified sustainable sourcing',
        'Lacquered, oiled, and waxed finishes',
      ],
    },
    {
      origin: 'Hettich, Hafele & Custom Fabrication',
      name: 'Solid Brass Hardware',
      tag: 'Bespoke Hardware',
      desc: 'The elements you touch every day. Handles, hinges, pulls, and locks in solid brass, not surface-plated. Precision-engineered to last decades.',
      specs: [
        'Solid brass, not surface-plated',
        'Satin, brushed, and polished finishes',
        'Custom-fabricated pulls and handles',
        'Hettich and Hafele soft-close systems',
      ],
    },
  ];

  const galleryProjects = [
    {
      title: 'Marble & Brass Residence Villa',
      tag: 'Luxury Villa',
      location: 'Adyar, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'Venetian Plaster Master Suite',
      tag: 'Master Suite',
      location: 'Nungambakkam, Chennai',
      image: '/posters/portfolio.avif',
    },
    {
      title: 'Italian Veneer Kitchen Suite',
      tag: 'Luxury Kitchen',
      location: 'Besant Nagar, Chennai',
      image: '/posters/pricing-axis.avif',
    },
    {
      title: 'Full-Floor Penthouse Interior',
      tag: 'Penthouse',
      location: 'OMR, Chennai',
      image: '/posters/persona-router.avif',
    },
  ];

  const whyChooseLuxury = [
    {
      num: '01',
      title: 'Verified Material Provenance',
      desc: 'Every stone slab, veneer panel, and hardware component comes from a verified source with origin documentation.',
    },
    {
      num: '02',
      title: '3D Commission Before Execution',
      desc: 'You walk through every room, finish, and lighting scenario in 3D before a single element is procured.',
    },
    {
      num: '03',
      title: 'Single Team, End to End',
      desc: 'No subcontracted surprises. Our own skilled artisans and installation teams work under direct Luxe Axis supervision.',
    },
    {
      num: '04',
      title: '45-Day Contractual Delivery',
      desc: 'Our 45-day guarantee is written into your signed contract with a compensation clause for delay.',
    },
    {
      num: '05',
      title: 'Flat 10-Year Warranty, No Fine Print',
      desc: 'Every element is covered for 10 years with zero service fees, zero exclusions, and zero fine print.',
    },
  ];

  const commissionTiers = [
    {
      scope: 'Villa & Bungalow',
      name: 'Whole Home Commission',
      desc: 'Complete luxury fit-out from foyer to master suite. Every room designed as part of a single cohesive architectural narrative.',
      linkText: 'Request Villa Proposal',
      href: '/book-audit',
      featured: false,
    },
    {
      scope: 'Penthouse & 4BHK',
      name: 'Premium Apartment',
      desc: 'Luxury apartment interiors with imported stone, custom veneer joinery, and bespoke lighting automation.',
      linkText: 'Request Penthouse Proposal',
      href: '/book-audit',
      featured: true,
    },
    {
      scope: 'Single Room or Zone',
      name: 'Signature Room',
      desc: 'Transform one space to the level of precision that sets the tone for the entire home. Master bedroom, private study, or dining room.',
      linkText: 'Request Signature Proposal',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is the cost of luxury interior design in Chennai?',
      a: 'Luxury interior design in Chennai is bespoke-priced per project. Villa and penthouse commissions typically range from Rs. 50 lakhs to Rs. 3 crores depending on scope, materials, and square footage. All quotes are fixed price with no hidden escalations.',
    },
    {
      q: 'How long does a luxury home interior project take in Chennai?',
      a: 'Luxe Axis guarantees luxury home handover in 45 days from 3D design sign-off. This covers material procurement, stone installation, custom veneer joinery, false ceiling, lighting, and final snag clearance.',
    },
    {
      q: 'Does Luxe Axis’s flat 10-year warranty cover luxury finishes like marble and veneer?',
      a: 'Yes. Our flat 10-year warranty covers every element of your luxury interior: Calacatta marble flooring, Italian veneer joinery, false ceiling, brass hardware, and ambient lighting systems with zero fine print.',
    },
    {
      q: 'What luxury materials does Luxe Axis use for interior design in Chennai?',
      a: 'We source Calacatta and Statuario marble from Tuscany, hand-selected Italian veneer from certified European suppliers, and solid brass hardware from Hettich, Hafele, and custom fabricators.',
    },
    {
      q: 'Can I see my luxury interior in 3D before work begins?',
      a: 'Yes. Every luxury project includes a photorealistic 3D walkthrough of your entire home. You approve every room, material finish, lighting scenario, and furniture placement before procurement begins.',
    },
    {
      q: 'What types of homes does Luxe Axis design luxury interiors for?',
      a: 'Luxe Axis designs luxury interiors for independent villas, bungalows, penthouses, premium 4BHK apartments, duplex homes, and heritage properties across Chennai.',
    },
    {
      q: 'Which areas in Chennai does Luxe Axis serve for luxury interior design?',
      a: 'Our luxury interior projects span all premium Chennai corridors: Adyar, Besant Nagar, Nungambakkam, OMR, Anna Nagar, Mylapore, Thiruvanmiyur, and Sholinganallur.',
    },
    {
      q: 'How is Luxe Axis different from other luxury interior designers in Chennai?',
      a: 'We combine verified material provenance, a contractually locked 45-day delivery guarantee, and a flat 10-year warranty into every luxury commission with zero subcontracted surprises.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Luxury Interior Designers in Chennai',
          description:
            'Luxury interior designers in Chennai. Calacatta marble, Italian veneer, solid brass hardware. 45-day delivery guarantee, flat 10-year warranty.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section with Ken Burns Cinematic Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[80vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        {/* Full-Bleed Background Image with Ken Burns Cinematic Effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/posters/residential-luxury-hero.png"
            alt="Luxe Axis Bespoke Luxury Interior Design in Chennai"
            fill
            priority
            className="object-cover animate-ken-burns opacity-40 scale-105"
          />
          {/* Ambient Gradient Overlay for High-Contrast Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-deep via-surface-deep/90 to-surface-deep/60" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface-deep via-surface-deep/80 to-transparent" />
        </div>

        <Container className="relative z-10">
          <Breadcrumbs
            path="/residential/luxury"
            labels={{ luxury: 'Luxury Interiors' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Chennai&apos;s Bespoke Luxury Interior Studio
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Luxury Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Calacatta marble. Italian veneer. Solid brass hardware. Every Luxe
              Axis luxury project is a singular commission, designed once for
              you, and delivered in 45 days with a flat 10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                as="a"
                href="/book-audit"
                size="lg"
                className="shadow-2xl"
              >
                Begin Your Luxury Project
              </Button>
              <Button
                as="a"
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View Luxury Portfolio →
              </Button>
            </div>

            {/* Hero Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  200+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Luxury Projects
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Delivery Guarantee
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
                  Master Artisans
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

      {/* 3. Luxury Manifesto */}
      <Section
        id="manifesto"
        eyebrow="Our Philosophy"
        title="Luxury Is Not Excess. It Is Exactness."
        lede="Every material carries a story. Every joint is finished to a tolerance that no catalog product can match."
      >
        <Grid cols={3} gap={6}>
          {philosophyPillars.map((p) => (
            <div
              key={p.num}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-h2 font-bold text-accent">
                  {p.num}
                </span>
                <h3 className="font-display text-h3 font-bold text-on-surface mt-2 mb-2">
                  {p.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Material Provenance */}
      <Section
        id="provenance"
        eyebrow="Material Provenance"
        title="What Goes In Matters As Much As What Shows."
        lede="Every Luxe Axis luxury project is specified from verified origins. European stone, certified veneers, and hardware built to outlast decades."
      >
        <Grid cols={3} gap={6}>
          {materialsProvenance.map((mat) => (
            <div
              key={mat.name}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-1 rounded bg-accent/20 border border-accent/40 text-accent font-ui text-[10px] font-bold uppercase tracking-wider">
                  {mat.tag}
                </span>
                <p className="text-overline text-on-surface-muted uppercase tracking-wider mt-3">
                  {mat.origin}
                </p>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {mat.name}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {mat.desc}
                </p>
                <ul className="space-y-1.5 text-small text-on-surface-2 border-t border-border-subtle/40 pt-3">
                  {mat.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="text-accent text-[12px]">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="Luxury Projects"
        title="200+ Homes. Every One a Singular Commission."
        lede="Villas, penthouses, and premium apartments across Chennai. Delivered in 45 days with flat 10-year warranty."
      >
        <Grid cols={2} gap={6}>
          {galleryProjects.map((p) => (
            <div
              key={p.title}
              className="group relative rounded-2xl overflow-hidden border border-accent/30 aspect-[16/10] shadow-2xl"
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                  {p.tag}
                </span>
                <h3 className="font-display text-h3 font-bold text-on-surface mt-2">
                  {p.title}
                </h3>
                <p className="text-small text-accent font-medium mt-1">
                  📍 {p.location}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 6. Why Choose Luxe Axis */}
      <Section
        id="why-choose-luxury"
        eyebrow="Why Luxe Axis for Luxury"
        title="Five Reasons Discerning Clients Choose Us"
        lede="The difference between a premium interior and a luxury one is accountability."
      >
        <Grid cols={2} gap={6}>
          {whyChooseLuxury.map((item) => (
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

      {/* 7. Featured Residence Spotlight */}
      <Section
        id="featured-residence"
        eyebrow="Featured Commission"
        title="The Adyar Residence"
        lede="A 6,200 sq.ft villa designed to last a generation. Calacatta marble throughout, Italian veneer joinery, bespoke brass hardware."
      >
        <div className="relative rounded-2xl overflow-hidden border border-accent/30 aspect-[16/9] shadow-2xl">
          <Image
            src="/posters/hero.avif"
            alt="The Adyar Residence luxury villa interior"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-surface-deep/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 max-w-2xl">
            <span className="px-3 py-1 rounded bg-accent text-surface-deep font-ui text-[11px] font-bold uppercase tracking-wider">
              Villa Interior • 6,200 sqft
            </span>
            <h3 className="font-display text-h2 font-bold text-on-surface mt-2 mb-2">
              The Adyar Residence
            </h3>
            <p className="text-small text-on-surface-2 leading-relaxed mb-4">
              Calacatta marble throughout, Italian veneer joinery, bespoke brass
              hardware. Designed in 3D, delivered in 45 days with a flat 10-year
              warranty.
            </p>
            <Button as="a" href="/book-audit">
              Request Villa Proposal →
            </Button>
          </div>
        </div>
      </Section>

      {/* 8. Interactive Before & After Slider */}
      <Section
        id="before-after"
        eyebrow="Real Projects"
        title="Before and After: Luxury Transformations"
        lede="Bare concrete to Calacatta marble. Every luxury project delivered in 45 days with flat 10-year warranty."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare villa shell before luxury fit-out',
            }}
            afterImage={{
              src: '/posters/hero.avif',
              alt: 'Completed luxury villa interior by Luxe Axis in Adyar',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Luxury Villa Transformation — Adyar, Chennai
          </p>
        </div>
      </Section>

      {/* 9. Signature Commission Tiers */}
      <Section
        id="commission-tiers"
        eyebrow="Signature Pricing"
        title="Every Project Is a Singular Commission"
        lede="Luxury interiors are not sold from a price list. Every project begins with a private consultation and fixed proposal."
      >
        <Grid cols={3} gap={6}>
          {commissionTiers.map((tier) => (
            <div
              key={tier.name}
              className={`lx-liquid-glass rounded-2xl p-6 border flex flex-col justify-between shadow-2xl relative ${
                tier.featured ? 'border-accent bg-accent/5' : 'border-accent/30'
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Most Popular
                </span>
              )}
              <div>
                <span className="text-overline text-accent uppercase font-bold tracking-wider">
                  {tier.scope}
                </span>
                <h3 className="font-display text-h3 font-bold text-on-surface mt-2 mb-3">
                  {tier.name}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-6">
                  {tier.desc}
                </p>
              </div>
              <Button
                as="a"
                href={tier.href}
                variant={tier.featured ? 'primary' : 'secondary'}
                className="w-full justify-center"
              >
                {tier.linkText} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 10. 5-Step Process */}
      <ProcessSteps />

      {/* 11. Client Stories */}
      <TestimonialBand testimonials={testimonials} />

      {/* 12. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Luxury Questions Answered"
        title="Luxury Interior FAQ"
        lede="Everything you need to know before beginning a luxury commission."
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

      {/* 13. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
