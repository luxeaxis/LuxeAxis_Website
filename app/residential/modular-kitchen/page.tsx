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
import { MaterialPartners } from '@/components/sections/MaterialPartners';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';

const ROUTE = '/residential/modular-kitchen';

export const metadata: Metadata = {
  title: 'German Modular Kitchen Interior Designers in Chennai | Luxe Axis',
  description:
    'Chennai’s top modular kitchen designers. German Hettich & Hafele hardware, BWP marine ply, custom layouts, 45-day delivery guarantee, and flat 10-year warranty.',
  keywords: [
    'modular kitchen interior designers in chennai',
    'german modular kitchen chennai',
    'bwp marine ply modular kitchen',
    'hettich modular kitchen chennai',
    'modular kitchen cost per sq ft chennai',
    'l-shaped modular kitchen chennai',
    'island modular kitchen designers',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'German Modular Kitchen Interior Designers in Chennai | Luxe Axis',
    description:
      'German Hettich & Hafele hardware, 100% BWP marine plywood, 45-day guaranteed handover, and flat 10-year warranty in Chennai.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/residential-modular-kitchen-hero.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis German Modular Kitchen Interiors Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Modular Kitchen Designers Chennai | Luxe Axis',
    description:
      'German Hettich hardware, BWP marine ply, 45-day handover, and 10-year warranty.',
    images: ['/posters/residential-modular-kitchen-hero.png'],
  },
};

export default async function ModularKitchenPage() {
  const highlights = [
    {
      title: 'Hettich Hardware',
      desc: 'German Soft-Close Hinges & Full-Extension Drawer Systems',
    },
    {
      title: 'BWR Marine Ply',
      desc: '100% Boiling Water Resistant Carcass for Coastal Humidity',
    },
    {
      title: '45-Day Guarantee',
      desc: 'Contractually Locked Timeline with Written Delay Compensation',
    },
    {
      title: 'Flat 10-Year Warranty',
      desc: 'Comprehensive Coverage Across Materials, Shutters & Hardware',
    },
    {
      title: 'Fixed Price Quote',
      desc: 'Itemized Transparent Pricing with Zero Scope Creep',
    },
  ];

  const modularVsCarpenter = [
    {
      title: 'BWR Marine-Grade Plywood Carcass',
      desc: 'Boiling Water Resistant ply from Century Ply resists Chennai’s coastal humidity. No delamination, no swelling. Covered under our flat 10-year warranty.',
    },
    {
      title: 'Hettich & Hafele Soft-Close Systems',
      desc: '200,000 open/close cycle rating on every hinge and drawer channel. No slamming, no sagging doors even after five years of daily use.',
    },
    {
      title: 'Factory Precision to 0.1mm',
      desc: 'Modules cut in controlled factory conditions under CNC guidance, not hand-sawn on site. Every door aligns and every drawer runs true.',
    },
    {
      title: 'Module-Level Replaceability',
      desc: 'Replace one damaged cabinet without dismantling the rest of the kitchen. This modular independence is impossible with carpenter-built units.',
    },
  ];

  const layouts = [
    {
      badge: 'Most Popular in Chennai',
      title: 'L-Shape Kitchen',
      desc: 'Two walls of cabinetry forming a right angle. Maximizes the work triangle between hob, sink, and refrigerator. Ideal for open-plan living and dining combinations.',
      sqft: '120 sq ft and above',
      image: '/posters/kitchen-layout-lshape.png',
    },
    {
      badge: 'Best for 2BHK Apartments',
      title: 'Parallel Kitchen',
      desc: 'Facing rows of cabinets maximize storage in a narrow corridor. Highest cabinet count per square foot. The most efficient layout for Chennai 2BHK apartments.',
      sqft: '80 sq ft and above',
      image: '/posters/kitchen-layout-parallel.png',
    },
    {
      badge: 'Maximum Storage',
      title: 'U-Shape Kitchen',
      desc: 'Three walls of cabinets deliver the highest usable storage in any layout. Dedicated prep, cooking, and cleaning zones for large families.',
      sqft: '150 sq ft and above',
      image: '/posters/kitchen-layout-ushape.png',
    },
    {
      badge: 'Luxury Homes & Villas',
      title: 'Island Kitchen',
      desc: 'A freestanding island adds a second prep surface, breakfast bar, or integrated hob zone. Designed for villas, penthouses, and large 4BHK homes.',
      sqft: '200 sq ft and above',
      image: '/posters/room-modular-kitchen.png',
    },
  ];

  const finishes = [
    {
      name: 'Matte Finish',
      tag: 'Clean & Timeless',
      desc: 'A non-reflective, fingerprint-resistant surface that reads as contemporary in every light condition. Available in 40+ colors from warm whites to deep anthracites.',
      points: [
        'Fingerprint and smudge resistant PET laminate',
        '40+ color options tailored for Indian palettes',
        'Scratch-resistant surface finish',
        'Flat 10-year finish warranty',
      ],
      image: '/posters/kitchen-layout-lshape.png',
    },
    {
      name: 'High-Gloss Finish',
      tag: 'Brilliant & Aspirational',
      desc: 'Mirror-bright acrylic or lacquer creates a light-amplifying kitchen that commands attention. Ideal for kitchens with limited natural light.',
      points: [
        'Maximum light reflection for compact kitchens',
        'High-gloss acrylic or polyurethane shutters',
        'UV-stable color that will not yellow over time',
        'Flat 10-year finish warranty',
      ],
      image: '/posters/kitchen-layout-parallel.png',
    },
    {
      name: 'Woodgrain Finish',
      tag: 'Warm & Natural',
      desc: 'The warmth of natural timber without the maintenance. High-resolution woodgrain HPL laminate reads as real timber with anti-bacterial surface protection.',
      points: [
        'Realistic wood texture and tactile depth',
        'No warping, splitting, or re-oiling required',
        'Greenlam HPL with anti-bacterial surface',
        'Flat 10-year finish warranty',
      ],
      image: '/posters/kitchen-layout-ushape.png',
    },
  ];

  const galleryProjects = [
    {
      title: 'Premium L-Shape with Quartz Island',
      tag: 'L-Shape Kitchen',
      location: 'Adyar, Chennai',
      image: '/posters/kitchen-hero-bg.png',
    },
    {
      title: 'Compact Parallel Kitchen in 2BHK',
      tag: 'Parallel Kitchen',
      location: 'Velachery, Chennai',
      image: '/posters/kitchen-layout-parallel.png',
    },
    {
      title: 'Anthracite Matte Modular Kitchen',
      tag: 'Matte Finish',
      location: 'T. Nagar, Chennai',
      image: '/posters/residential-kitchen-cabinets-hero.png',
    },
    {
      title: 'High-Gloss White 3BHK Kitchen',
      tag: 'High-Gloss',
      location: 'OMR, Chennai',
      image: '/posters/service-modular-kitchen.png',
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter Modular',
      tag: 'Starter',
      price: 'Rs. 1.2L',
      unit: '/ kitchen',
      desc: '8 to 12 cabinets. BWR marine ply carcass, Hettich soft-close hinges, laminate shutters & quartz counter.',
      features: [
        'BWR marine-grade plywood carcass',
        'Hettich German soft-close hinges',
        'High-pressure laminate shutters',
        'Granite or quartz countertop',
        'Flat 10-year warranty & post-install service',
      ],
      cta: 'Get Starter Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Premium Modular',
      tag: 'Most Popular',
      price: 'Rs. 2.5L',
      unit: '/ kitchen',
      desc: '12 to 18 cabinets. 19mm BWR marine ply, Hettich full-extension drawers, acrylic shutters & tall unit.',
      features: [
        '19mm BWR marine-grade plywood carcass',
        'Hettich full-extension soft-close drawer system',
        'Premium acrylic or matte PET shutters',
        'Profiled edge quartz countertop',
        'Tall unit with spice & pantry pull-outs',
        'Flat 10-year warranty & 45-day move-in guarantee',
      ],
      cta: 'Get Premium Kitchen Quote',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Luxury Kitchen',
      tag: 'Signature',
      price: 'Rs. 5L',
      unit: '/ kitchen',
      desc: '18+ cabinets. 19mm BWP marine ply, Hafele hardware, lacquer/veneer shutters & integrated appliances.',
      features: [
        '19mm BWP 710 marine plywood carcass',
        'Hafele full-extension soft-close hardware',
        'PU lacquer, natural veneer, or glass shutters',
        'Premium quartz or engineered stone island',
        'Integrated appliance housing & LED profile lighting',
        'Flat 10-year warranty & contractually locked timeline',
      ],
      cta: 'Explore Luxury Kitchen',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is the cost of a modular kitchen in Chennai in 2025?',
      a: 'Modular kitchen costs in Chennai range from Rs. 1.2 lakhs for a basic setup to Rs. 5+ lakhs for a luxury kitchen with imported hardware and quartz counters. A premium kitchen with Hettich fittings and acrylic shutters for a 3BHK typically costs between Rs. 2.5 and Rs. 5 lakhs. All quotes are fixed-price.',
    },
    {
      q: 'How long does modular kitchen installation take?',
      a: 'Luxe Axis guarantees modular kitchen installation and handover in 45 days from design sign-off. This covers 3D design, factory fabrication, on-site fitting, countertop installation, and appliance integration under written delay compensation.',
    },
    {
      q: 'What is the difference between a modular kitchen and a carpenter-made kitchen?',
      a: 'A modular kitchen uses factory-engineered modules cut to 0.1mm precision from certified marine-grade plywood with rated German hardware. Carpenter kitchens are hand-built on site. Modular kitchens resist moisture, allow individual module replacement, and carry a flat 10-year warranty.',
    },
    {
      q: 'What hardware brands does Luxe Axis use for modular kitchens?',
      a: 'We specify Hettich soft-close hinges and drawer systems as standard across all packages, with Hafele full-extension hardware on premium and luxury tiers. Carcass material is Century Ply BWR marine plywood.',
    },
    {
      q: 'Is marine plywood worth it for Chennai’s climate?',
      a: 'Yes. Chennai’s coastal humidity makes BWR or BWP marine-grade plywood essential for kitchen carcasses to prevent delamination and swelling. Standard ply or MDF deteriorates within 3 to 5 years.',
    },
    {
      q: 'Can I see my modular kitchen in 3D before work begins?',
      a: 'Yes. Every project includes a full photorealistic 3D render showing cabinet layout, shutter color, countertop, and appliance positions. You approve every detail before production begins.',
    },
    {
      q: 'Does Luxe Axis’s flat 10-year warranty cover the modular kitchen?',
      a: 'Yes. Our flat 10-year warranty covers carcass plywood, shutter finish, hinges, drawer channels, countertops, and installation workmanship with zero hidden conditions.',
    },
    {
      q: 'Which kitchen layout is best for a standard Chennai 3BHK?',
      a: 'An L-shape or Parallel layout is ideal for a standard 3BHK (100–140 sq ft), creating an efficient work triangle between hob, sink, and refrigerator while maximizing storage.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Modular Kitchen Interior Designers in Chennai',
          description:
            'Chennai’s top modular kitchen designers. German Hettich & Hafele hardware, BWR marine ply, custom layouts with 45-day delivery guarantee.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section with Ken Burns Cinematic Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[80vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        {/* Full-Bleed Background Image with Ken Burns Cinematic Effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/posters/kitchen-hero-bg.png"
            alt="Luxe Axis Modular Kitchen Interior Designers in Chennai"
            fill
            priority
            className="object-cover animate-ken-burns opacity-40 scale-105"
          />
          {/* Ambient Gradient Overlay for High-Contrast Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-deep via-surface-deep/90 to-surface-deep/60" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface-deep via-surface-deep/80 to-transparent" />
        </div>

        <Container className="relative z-10">
          <Breadcrumbs path="/residential/modular-kitchen" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Chennai&apos;s Modular Kitchen Specialists
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Modular Kitchen Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              German hardware. Marine-grade plywood. Engineered for heavy Indian
              cooking. 2,000+ modular kitchens delivered across Chennai with
              45-day installation and flat 10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                as="a"
                href="/book-audit"
                size="lg"
                className="shadow-2xl"
              >
                Book Free Kitchen Consultation
              </Button>
              <Button
                as="a"
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View Kitchen Portfolio →
              </Button>
            </div>

            {/* Hero Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  2,000+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Kitchens Built
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Move-In Guarantee
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

      {/* 3. Modular vs Carpenter Kitchen */}
      <Section
        id="modular-vs-carpenter"
        eyebrow="Modular vs Carpenter Kitchen"
        title="Built for Indian Cooking. Built to Last Decades."
        lede="A carpenter-built kitchen is hand-cut on site from whatever plywood is available. A Luxe Axis modular kitchen is factory-engineered from certified marine-grade plywood with German hardware rated for 200,000 cycles."
      >
        <Grid cols={2} gap={6}>
          {modularVsCarpenter.map((feat) => (
            <div
              key={feat.title}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30"
            >
              <h3 className="font-display text-h4 font-bold text-on-surface mb-2">
                {feat.title}
              </h3>
              <p className="text-small text-on-surface-2 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Kitchen Layouts */}
      <Section
        id="layouts"
        eyebrow="Choose Your Layout"
        title="The Layout Engineered for Your Kitchen Space"
        lede="We design every modular kitchen around your actual floor measurements, cooking habits, and family lifestyle."
      >
        <Grid cols={2} gap={6}>
          {layouts.map((l) => (
            <div
              key={l.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={l.image}
                    alt={l.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {l.badge}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {l.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-3">
                  {l.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-border-subtle/40 flex items-center justify-between">
                <span className="text-overline text-accent uppercase font-bold tracking-wider">
                  Recommended Size
                </span>
                <span className="text-small font-bold text-on-surface">
                  {l.sqft}
                </span>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Brand Partners */}
      <MaterialPartners />

      {/* 6. Finishes */}
      <Section
        id="finishes"
        eyebrow="Finishes That Define the Kitchen"
        title="Three Finishes. One Decade of Warranty."
        lede="Every shutter finish is scratch-resistant, moisture-resistant, and warranted for 10 years."
      >
        <Grid cols={3} gap={6}>
          {finishes.map((f) => (
            <div
              key={f.name}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={f.image}
                    alt={f.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {f.name}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {f.desc}
                </p>
                <ul className="space-y-1.5 text-small text-on-surface-2 mb-4 border-t border-border-subtle/40 pt-3">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="text-accent text-[12px]">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 7. Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="Kitchen Projects"
        title="2,000+ Kitchens. Every One Guaranteed."
        lede="From compact parallel kitchens in 2BHK apartments to island kitchens in Adyar villas."
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

      {/* 8. Before & After Slider */}
      <Section
        id="before-after"
        eyebrow="Real Transformation"
        title="Before and After: Kitchen Transformation"
        lede="An old carpenter-built kitchen transformed into a modern modular kitchen in Adyar, Chennai."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/renovation-kitchen-before.png',
              alt: 'Old carpenter-built kitchen before modular makeover',
            }}
            afterImage={{
              src: '/posters/renovation-kitchen-after.png',
              alt: 'Completed modular kitchen by Luxe Axis in Adyar Chennai',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Modular Kitchen Makeover — Adyar, Chennai
          </p>
        </div>
      </Section>

      {/* 9. Fixed-Price Packages */}
      <Section
        id="pricing"
        eyebrow="Modular Kitchen Packages"
        title="Fixed-Price Kitchens. No Surprises."
        lede="Every package includes 3D kitchen design, fixed-price quote, 45-day installation guarantee and flat 10-year warranty."
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

      {/* 10. 5-Step Process */}
      <ProcessSteps />

      {/* 11. Client Stories */}
      <TestimonialBand testimonials={testimonials} />

      {/* 12. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Kitchen Questions Answered"
        title="Modular Kitchen FAQ"
        lede="Everything you need to know before booking your modular kitchen consultation."
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
