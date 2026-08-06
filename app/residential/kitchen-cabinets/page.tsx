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

const ROUTE = '/residential/kitchen-cabinets';

export const metadata: Metadata = {
  title: 'Modular Kitchen Cabinets in Chennai | Luxe Axis',
  description:
    'CNC-cut modular kitchen cabinets in Chennai. BWR marine ply carcass, Hettich soft-close hardware, 40+ finishes. Flat 10-year warranty, 45-day delivery guarantee. Free quote.',
  alternates: canonicalFor(ROUTE),
};

export default async function KitchenCabinetsPage() {
  const highlights = [
    {
      title: 'Factory-CNC Cut',
      desc: '0.1mm Precision Machine Routing on Every Panel',
    },
    {
      title: 'BWR Marine Ply',
      desc: '100% Moisture & Boiling Water Resistant Carcass',
    },
    {
      title: 'Hettich Hardware',
      desc: 'Soft-Close Hinges & Full-Extension Tandem Drawers',
    },
    {
      title: '45-Day Delivery',
      desc: 'Contractually Guaranteed Move-In Timeline',
    },
    {
      title: 'Flat 10-Year Warranty',
      desc: 'Carcass, Shutters, Edge Banding & Hardware',
    },
  ];

  const cabinetAnatomy = [
    {
      layer: 'Layer 1',
      title: 'Carcass Body',
      desc: 'The structural body of every cabinet. We use 18mm BWR-grade marine plywood, not particle board or MDF. Boiling-water-resistant and moisture-proof for Chennai’s coastal climate.',
      spec: '18mm BWR Marine Ply Carcass',
    },
    {
      layer: 'Layer 2',
      title: 'Shutter Front',
      desc: 'The visible face of the cabinet. Available in membrane, PET laminate, PU lacquer, and acrylic finishes. 40+ color and texture options with slab, groove, and glass profiles.',
      spec: '40+ Finishes with PVC Edge Banding',
    },
    {
      layer: 'Layer 3',
      title: 'Hardware System',
      desc: 'Hinges, drawer channels, lift mechanisms, and tandem boxes. We specify Hettich and Hafele hardware exclusively. Soft-close is standard, rated for 100,000 cycles.',
      spec: 'Hettich / Hafele 100K Cycle Rating',
    },
    {
      layer: 'Layer 4',
      title: 'Edge Banding',
      desc: 'The thin ABS strip that seals all exposed plywood edges against moisture ingress. 2mm thick ABS edge banding, laser-applied for a seamless zero-gap joint.',
      spec: '2mm ABS Laser Edge Banding',
    },
  ];

  const internalStorage = [
    {
      title: 'Pull-Out Drawers',
      desc: 'Full-extension tandem box drawers with soft-close. Maximum use of base cabinet depth for pots, pans, and daily access.',
      spec: 'Hettich Arcitech / Tandembox',
    },
    {
      title: 'Corner Carousel Units',
      desc: 'Carousel or LeMans units for corner cabinets. Eliminates the dead corner space in L-shaped and U-shaped kitchens with 100% visibility.',
      spec: 'Hettich / Hafele Carousel',
    },
    {
      title: 'Tall Pantry Units',
      desc: 'Floor-to-ceiling pantry towers up to 2.4m height. Built-in pull-out shelves, cutlery inserts, and integrated oven housing.',
      spec: 'Up to 2.4m Height Pull-Out',
    },
    {
      title: 'Drawer Organisers',
      desc: 'Cutlery, spice, and knife drawer inserts in stainless steel and ABS. Fitted to drawer dimensions exactly with zero rattling.',
      spec: 'Stainless Steel & ABS Inserts',
    },
  ];

  const galleryProjects = [
    {
      title: 'White Gloss Modular Kitchen Cabinets',
      tag: 'U-Shape Kitchen',
      location: 'Adyar, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'Grey Laminate L-Kitchen Cabinets',
      tag: 'L-Shape Kitchen',
      location: 'T. Nagar, Chennai',
      image: '/posters/persona-router.avif',
    },
    {
      title: 'Hettich Soft-Close Drawer Detail',
      tag: 'Hardware Detail',
      location: 'Velachery, Chennai',
      image: '/posters/portfolio.avif',
    },
    {
      title: 'Floor-to-Ceiling Tall Pantry Unit',
      tag: 'Tall Unit',
      location: 'Anna Nagar, Chennai',
      image: '/posters/pricing-axis.avif',
    },
  ];

  const whyChooseUs = [
    {
      num: '01',
      title: 'Factory-CNC Precision at 0.1mm',
      desc: 'All cabinet panels are CNC-routed in our factory to 0.1mm tolerance, ensuring perfectly flush doors, zero panel gaps, and consistent quality that site carpenters cannot replicate.',
    },
    {
      num: '02',
      title: 'BWR Marine Ply. Never MDF.',
      desc: 'We never use MDF or particle board for carcasses. Chennai’s humidity demands BWR-grade marine plywood, which is boiling-water-resistant and will not swell or delaminate.',
    },
    {
      num: '03',
      title: 'Hettich Hardware, Soft-Close as Standard',
      desc: 'Every door and drawer includes Hettich or Hafele soft-close mechanisms as a standard inclusion, rated for 100,000 open-close cycles.',
    },
    {
      num: '04',
      title: '45-Day Delivery Guaranteed',
      desc: 'Cabinet installation is completed within 45 days of design sign-off under a written contractual delay compensation guarantee.',
    },
    {
      num: '05',
      title: 'Flat 10-Year Warranty on Every Cabinet',
      desc: 'Carcass, shutter, hardware, edge banding, and all finishes are covered under a flat 10-year warranty with zero exclusions.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Carcass Only',
      tag: 'Basic',
      price: 'Rs. 1,200',
      unit: '/ linear ft',
      desc: '18mm BWR marine ply carcass with 2mm ABS laser edge banding. Customer supplies own shutters.',
      features: [
        '18mm BWR marine ply carcass',
        '2mm ABS laser edge banding',
        'CNC precision to 0.1mm',
        'Flat 10-year warranty',
        'Post-installation service team',
      ],
      cta: 'Get Carcass Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'With Shutter',
      tag: 'Most Popular',
      price: 'Rs. 2,200',
      unit: '/ linear ft',
      desc: 'Complete cabinet with BWR carcass, laminate or membrane shutter, and Hettich soft-close hinges.',
      features: [
        'BWR marine ply carcass included',
        'Laminate or membrane shutter front',
        'Hettich German soft-close hinges',
        '40+ finish options available',
        'Flat 10-year warranty & 45-day move-in',
      ],
      cta: 'Get Full Cabinet Quote',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Full Hardware',
      tag: 'Premium',
      price: 'Rs. 3,200',
      unit: '/ linear ft',
      desc: 'Complete kitchen cabinet system with acrylic/lacquer shutters, full Hettich tandem drawers & internal organisers.',
      features: [
        '19mm BWP marine ply carcass',
        'Acrylic or PU lacquer shutter',
        'Hettich tandem box drawers',
        'Internal cutlery & spice organisers included',
        'Flat 10-year warranty & contractually locked timeline',
      ],
      cta: 'Explore Premium Cabinets',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is the cost of modular kitchen cabinets in Chennai in 2025?',
      a: 'Carcass-only cabinets start from Rs. 1,200 per linear foot. Full cabinets with laminate shutters and Hettich hinges start from Rs. 2,200 per linear foot. Full hardware cabinets with acrylic shutters start from Rs. 3,200 per linear foot. All quotes are fixed-price.',
    },
    {
      q: 'What carcass material does Luxe Axis use for kitchen cabinets?',
      a: 'We use 18mm BWR-grade (Boiling Water Resistant) marine plywood for all cabinet carcasses. We never use MDF or particle board, which absorb moisture and swell in Chennai’s coastal climate.',
    },
    {
      q: 'Does the flat 10-year warranty cover kitchen cabinets?',
      a: 'Yes. Our flat 10-year warranty covers the carcass, shutters, hardware, and edge banding. Any failure within 10 years is repaired or replaced at zero cost.',
    },
    {
      q: 'What hardware brands does Luxe Axis specify for kitchen cabinets?',
      a: 'We specify Hettich and Hafele hardware for all hinges, drawer channels, lift mechanisms, and tandem boxes. Soft-close is standard on every door and drawer.',
    },
    {
      q: 'How are Luxe Axis cabinets manufactured?',
      a: 'All panels are CNC-routed in our factory to 0.1mm tolerance, ensuring perfectly flush doors, zero gaps between cabinets, and consistent factory quality.',
    },
    {
      q: 'How long does kitchen cabinet installation take?',
      a: 'Cabinet fabrication and installation for a standard kitchen takes 7 to 12 days after site measurements are confirmed, covered under our 45-day delivery guarantee.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Modular Kitchen Cabinets in Chennai',
          description:
            'CNC-cut modular kitchen cabinets in Chennai. BWR marine ply carcass, Hettich soft-close hardware, 40+ finishes with 45-day delivery guarantee.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/residential/kitchen-cabinets" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Factory Precision. Zero Compromise.
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Modular Kitchen Cabinets <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              CNC-cut to 0.1mm precision, BWR marine ply carcass, Hettich
              soft-close hardware, and 40+ finish options. Fixed price, flat
              10-year warranty on every panel.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Get Free Cabinet Quote
              </Button>
              <Button
                as="a"
                href="/residential/modular-kitchen"
                variant="secondary"
                size="lg"
              >
                Full Kitchen Services →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  10,000+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Kitchens Built
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  0.1mm
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  CNC Tolerance
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  40+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Finish Options
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
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Delivery Guarantee
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

      {/* 3. Anatomy of a Cabinet */}
      <Section
        id="anatomy"
        eyebrow="Cabinet Construction"
        title="Anatomy of a Luxe Axis Cabinet"
        lede="Four components build every cabinet. Each is specified, sourced, and certified. This is what separates a kitchen that lasts 10 years from one that starts failing in two."
      >
        <Grid cols={2} gap={6}>
          {cabinetAnatomy.map((c) => (
            <div
              key={c.layer}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <span className="text-overline text-accent uppercase font-bold tracking-wider block mb-1">
                  {c.layer}
                </span>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {c.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {c.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-border-subtle/40">
                <span className="text-[12px] font-bold text-accent">
                  Specification: {c.spec}
                </span>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Internal Storage Solutions */}
      <Section
        id="internal-storage"
        eyebrow="Internal Fittings"
        title="Storage Solutions Inside Every Cabinet"
        lede="The exterior is what you see. The interior is what you use every day. We specify the right internal fitting for every cabinet position."
      >
        <Grid cols={2} gap={6}>
          {internalStorage.map((s) => (
            <div
              key={s.title}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-2">
                  {s.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-3">
                  {s.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-border-subtle/40">
                <span className="text-[12px] font-bold text-accent">
                  Hardware: {s.spec}
                </span>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Cabinet Projects Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="Cabinet Projects"
        title="10,000+ Kitchens. Every Cabinet Guaranteed."
        lede="From compact straight kitchens in apartments to large U-shaped kitchens in villas across Chennai."
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

      {/* 6. Why Chennai Homeowners Choose Us */}
      <Section
        id="why-us"
        eyebrow="Why Luxe Axis"
        title="Why Chennai Homeowners Choose Our Kitchen Cabinets"
        lede="The cabinets need to work as well on day 3,650 as they did on day one."
      >
        <div className="space-y-4 max-w-4xl mx-auto">
          {whyChooseUs.map((w) => (
            <div
              key={w.num}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h2 font-bold text-accent shrink-0">
                {w.num}
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {w.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {w.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. Interactive Before & After Slider */}
      <Section
        id="before-after"
        eyebrow="Real Project"
        title="Before and After: Kitchen Cabinet Transformation"
        lede="A raw kitchen wall transformed into a precision-built modular cabinet system with quartz countertop and under-cabinet LED in 18 days."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Raw kitchen wall before modular cabinet installation',
            }}
            afterImage={{
              src: '/posters/hero.avif',
              alt: 'Completed modular kitchen cabinets by Luxe Axis in Adyar',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Modular Kitchen Cabinet Makeover — Adyar, Chennai
          </p>
        </div>
      </Section>

      {/* 8. Fixed Price Per Linear Foot Packages */}
      <Section
        id="pricing"
        eyebrow="Cabinet Packages"
        title="Fixed Price Per Linear Foot"
        lede="All packages include 3D kitchen design, CNC-cut BWR ply carcass, and flat 10-year warranty."
      >
        <Grid cols={3} gap={6}>
          {pricingTiers.map((tier) => (
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
                  {tier.tag}
                </span>
                <h3 className="font-display text-h3 font-bold text-on-surface mt-1">
                  {tier.name}
                </h3>
                <div className="my-4 flex items-baseline gap-1">
                  <span className="font-display text-[36px] font-bold text-accent">
                    {tier.price}
                  </span>
                  <span className="text-small text-on-surface-muted">
                    {tier.unit}
                  </span>
                </div>
                <p className="text-small text-on-surface-2 mb-4 pb-4 border-b border-border-subtle/50">
                  {tier.desc}
                </p>
                <ul className="space-y-2 mb-6 text-small text-on-surface-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                as="a"
                href={tier.href}
                variant={tier.featured ? 'primary' : 'secondary'}
                className="w-full justify-center"
              >
                {tier.cta} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 9. 5-Step Process */}
      <ProcessSteps />

      {/* 10. Client Stories */}
      <TestimonialBand testimonials={testimonials} />

      {/* 11. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Kitchen Cabinet FAQ"
        lede="Common questions about modular kitchen cabinets in Chennai."
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

      {/* 12. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
