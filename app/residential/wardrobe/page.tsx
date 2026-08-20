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

const ROUTE = '/residential/wardrobe';

export const metadata: Metadata = {
  title: 'Bespoke Luxury Wardrobe Interior Designers in Chennai | Luxe Axis',
  description:
    'Custom sliding, walk-in, and hinged luxury wardrobes in Chennai. BWP marine ply carcass, Blum & Hafele soft-close hardware, 40+ finishes, 45-day delivery guarantee, and flat 10-year warranty.',
  keywords: [
    'wardrobe interior designers in chennai',
    'walk in wardrobe design chennai',
    'sliding wardrobe designers chennai',
    'hinged wardrobe cost chennai',
    'custom closet design chennai',
    'acrylic wardrobe shutters chennai',
    'fluted glass wardrobe chennai',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Bespoke Luxury Wardrobe Interior Designers in Chennai | Luxe Axis',
    description:
      'Custom sliding, walk-in, and hinged wardrobes with BWP marine ply, German hardware, and a 10-year warranty in Chennai.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/residential-wardrobe-hero.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis Bespoke Luxury Wardrobe Design Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bespoke Wardrobe Interior Designers in Chennai | Luxe Axis',
    description:
      'Custom sliding & walk-in wardrobes with German soft-close hardware and 10-year warranty.',
    images: ['/posters/residential-wardrobe-hero.png'],
  },
};

export default async function WardrobePage() {
  const highlights = [
    {
      title: '1,000+ Wardrobes',
      desc: 'Custom Built Across Sliding, Walk-In & Hinged Designs',
    },
    {
      title: 'BWR Marine Ply',
      desc: '100% Moisture & Humidity Resistant Carcass',
    },
    {
      title: '40+ Shutter Finishes',
      desc: 'High-Gloss Acrylic, PET Laminate, Tinted Glass & Veneer',
    },
    {
      title: 'Flat 10-Year Warranty',
      desc: 'Covers Shutters, Hinges, Tracks & Internal Fittings',
    },
    {
      title: '45-Day Delivery',
      desc: 'Contractually Guaranteed Move-In Timeline',
    },
  ];

  const wardrobeTypes = [
    {
      tag: 'Sliding Wardrobe',
      title: 'Maximum Space, Zero Swing Clearance',
      desc: 'Sliding wardrobes work in rooms where every centimetre of floor space is valuable. Doors glide in precision aluminium tracks with zero swing arc eating into the room.',
      specs: [
        'BWR marine ply carcass body',
        'Aluminium profile 3-track or 4-track system',
        '4-wheel roller with soft-close damper',
        'Laminate, acrylic, or tinted glass shutters',
        'Full internal fitting customization',
        'Flat 10-year warranty included',
      ],
      image: '/posters/wardrobe-tinted-glass-sliding.png',
    },
    {
      tag: 'Walk-In Wardrobe',
      title: 'A Room Devoted to Getting Dressed',
      desc: 'A walk-in wardrobe is the highest-capacity configuration. Three or four walls of storage, full-height hanging, drawer bank, and an optional central island unit.',
      specs: [
        '3-wall or 4-wall carcass layout',
        'Full-height long hang & short hang zones',
        'Drawer bank with soft-close runners',
        'Shoe rack & velvet accessories tray',
        'Optional central island unit with mirror',
        'Integrated warm LED wardrobe lighting',
      ],
      image: '/posters/wardrobe-walkin-closet.png',
    },
    {
      tag: 'Hinged Wardrobe',
      title: 'Full Access, Maximum Carcass Depth',
      desc: 'Hinged wardrobes open completely, giving you unobstructed access to the full carcass. They offer the highest storage density per linear foot for spacious bedrooms.',
      specs: [
        '600mm full-depth carcass',
        'Hydraulic soft-close hinges',
        'Full-height or segmented door panels',
        'Laminate, acrylic, veneer, or membrane shutters',
        'Complete internal fitting selection',
        'Flat 10-year warranty included',
      ],
      image: '/posters/wardrobe-solid-teak-hinged.png',
    },
    {
      tag: 'Modular Wardrobe',
      title: 'Engineered to Mix, Match, Expand',
      desc: 'Modular wardrobes are built from interchangeable factory components. Ideal for non-standard rooms or when you want to reconfigure later without a full rebuild.',
      specs: [
        'Factory-cut interchangeable modules',
        '50+ configuration combinations',
        'Expandable post-installation',
        'All 40+ shutter finishes available',
        'Same internal fittings as fixed wardrobes',
        'Flat 10-year warranty included',
      ],
      image: '/posters/wardrobe-corner-l-shape.png',
    },
  ];

  const internalFittings = [
    {
      title: 'Long Hang Section',
      desc: 'Full-height rail from 6 feet to ceiling for sarees, suits, evening wear, and formal dresses without creasing.',
      spec: 'Typically 600mm to 700mm wide per unit',
    },
    {
      title: 'Short Hang + Shelf',
      desc: 'Half-height rail for shirts, jackets, and casuals above, with folded shelf below for stacked garments.',
      spec: 'Rail at 1,000mm, shelf below at 500mm',
    },
    {
      title: 'Soft-Close Drawers',
      desc: '3-row or 5-row drawer bank with smooth-close runners rated for 30kg load capacity for accessories and linen.',
      spec: 'Tandem box runners, German hardware standard',
    },
    {
      title: 'Shoe Storage Rack',
      desc: 'Angled-slot or flat-base shoe storage sized to your pair count (12 to 30+ pairs) with face-out display.',
      spec: '3 angle settings: 15, 20, 25 degrees',
    },
    {
      title: 'Trouser Pull-Out',
      desc: '2-row or 3-row sliding trouser rack with non-slip rubberized clips that keep creases intact between wears.',
      spec: 'Holds 10 to 18 trousers per unit',
    },
    {
      title: 'Velvet Accessories Tray',
      desc: 'Velvet-lined tray with segmented compartments for watches, jewelry, cufflinks, and sunglasses.',
      spec: 'Custom compartment layout with optional glass cover',
    },
  ];

  const galleryProjects = [
    {
      title: 'Contemporary 4-Door Sliding Wardrobe Suite',
      tag: 'Sliding Wardrobe',
      location: 'Adyar, Chennai',
      image: '/posters/wardrobe-tinted-glass-sliding.png',
    },
    {
      title: '3-Wall Walk-In Wardrobe Suite',
      tag: 'Walk-In Suite',
      location: 'T. Nagar, Chennai',
      image: '/posters/wardrobe-walkin-closet.png',
    },
    {
      title: 'Full-Depth Veneer Hinged Wardrobe',
      tag: 'Hinged Wardrobe',
      location: 'OMR, Chennai',
      image: '/posters/wardrobe-solid-teak-hinged.png',
    },
    {
      title: 'Corner Vanity Modular Wardrobe System',
      tag: 'Modular Wardrobe',
      location: 'Anna Nagar, Chennai',
      image: '/posters/wardrobe-corner-l-shape.png',
    },
  ];

  const whyChooseUs = [
    {
      num: '01',
      title: 'Factory-Cut, Zero Site Variation',
      desc: 'Every panel is cut on precision CNC machines to 0.1mm tolerance. No carpenter guesswork or uneven site-cut edges.',
    },
    {
      num: '02',
      title: 'BWR Marine Ply by Default',
      desc: 'Boiling Water Resistant marine ply is the only carcass material we use. Chennai’s humidity will not cause swelling or delamination.',
    },
    {
      num: '03',
      title: '40+ Shutter Finish Options',
      desc: 'Laminate, acrylic, glass, membrane, veneer, and combinations. Every texture, gloss level, and color tailored for your suite.',
    },
    {
      num: '04',
      title: 'Flat 10-Year Warranty, No Exceptions',
      desc: 'Covers every shutter, hinge, track, drawer runner, and internal fitting with zero hidden service fees.',
    },
    {
      num: '05',
      title: '45-Day Installation Guarantee',
      desc: 'Your wardrobe designed, fabricated, and installed within 45 days backed by written contractual delay compensation.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Essential Sliding',
      tag: 'Starter',
      price: 'Rs. 45K',
      unit: '/ wardrobe',
      desc: 'A 2-door sliding wardrobe with a clean exterior and basic interior configuration.',
      features: [
        'BWR marine-grade plywood carcass',
        '2-door aluminum track system',
        'Laminate shutters (20+ colors)',
        'Long hang + 2 shelves inside',
        'Flat 10-year warranty & post-install service',
      ],
      cta: 'Get Essential Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Complete Wardrobe',
      tag: 'Most Popular',
      price: 'Rs. 85K',
      unit: '/ wardrobe',
      desc: 'A 3-door sliding wardrobe with full interior fittings, soft-close hardware, and your choice of finish.',
      features: [
        'BWR marine-grade plywood carcass',
        '3-door 4-wheel soft-close track system',
        'Laminate or acrylic shutters',
        'Long hang, short hang, drawers & shoe rack',
        'Trouser pull-out & accessories tray included',
        'Flat 10-year warranty & 45-day move-in guarantee',
      ],
      cta: 'Book Free Wardrobe Audit',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Walk-In Suite',
      tag: 'Premium',
      price: 'Rs. 1.8L',
      unit: '/ suite',
      desc: 'A full 3-wall or 4-wall walk-in wardrobe suite with LED lighting and central island option.',
      features: [
        '3-wall or 4-wall carcass layout',
        'Full-height long hang & shelf zones',
        'Drawer bank, shoe rack & accessories tray',
        'Optional central island with mirror portal',
        'Integrated warm LED wardrobe lighting',
        'Flat 10-year warranty & contractually locked timeline',
      ],
      cta: 'Explore Walk-In Suite',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What does wardrobe design cost in Chennai in 2025?',
      a: 'Wardrobe design in Chennai starts from Rs. 45,000 for a 2-door sliding wardrobe. A 3-door wardrobe with full interior fittings starts from Rs. 85,000. Walk-in wardrobes start from Rs. 1,80,000. All quotes are fixed-price.',
    },
    {
      q: 'How long does wardrobe installation take with Luxe Axis?',
      a: 'Luxe Axis guarantees wardrobe installation within 45 days of project start. This is a contractual commitment backed by written delay compensation in your agreement.',
    },
    {
      q: 'What materials does Luxe Axis use for wardrobes in Chennai’s climate?',
      a: 'We use BWR (Boiling Water Resistant) marine ply carcasses on every wardrobe. This is the only carcass material that reliably resists Chennai’s humidity without warping or delaminating.',
    },
    {
      q: 'Does Luxe Axis’s flat 10-year warranty cover wardrobe hinges and tracks?',
      a: 'Yes. Our flat 10-year warranty covers every component including shutters, hinges, soft-close dampers, sliding tracks, drawer runners, and internal fittings.',
    },
    {
      q: 'What is the difference between a sliding and a hinged wardrobe?',
      a: 'Sliding wardrobes have doors that move in a track, requiring no swing clearance—best for compact rooms. Hinged wardrobes open fully, offering complete access and maximum carcass depth.',
    },
    {
      q: 'Can I get a walk-in wardrobe if my bedroom is small?',
      a: 'Yes, provided the space is at least 5ft deep and 7ft wide (35 sq ft upward). For smaller rooms, a sliding wardrobe with custom internal fittings often stores more per square foot.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Wardrobe Interior Designers in Chennai',
          description:
            'Custom sliding, walk-in, and hinged wardrobes in Chennai. BWR marine ply carcass, soft-close hardware with 45-day delivery guarantee.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section with Ken Burns Cinematic Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[80vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        {/* Full-Bleed Background Image with Ken Burns Cinematic Effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/posters/residential-wardrobe-hero.png"
            alt="Luxe Axis Wardrobe Interior Designers in Chennai"
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
            path="/residential/wardrobe"
            labels={{ wardrobe: 'Wardrobe Design' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Precision Inside. Every Time.
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Wardrobe Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Luxe Axis builds wardrobes from factory-cut panels,
              humidity-resistant marine ply, and soft-close hardware. Every
              wardrobe installed in 45 days with a flat 10-year warranty on
              every component.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                as="a"
                href="/book-audit"
                size="lg"
                className="shadow-2xl"
              >
                Book Free Consultation
              </Button>
              <Button
                as="a"
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View Wardrobe Projects →
              </Button>
            </div>

            {/* Hero Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  1,000+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Wardrobes Built
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Installation Guarantee
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
                  40+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Shutter Finishes
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center col-span-2 sm:col-span-1">
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

      {/* 3. Four Configurations */}
      <Section
        id="wardrobe-types"
        eyebrow="Wardrobe Types"
        title="Four Configurations. One Perfect Fit."
        lede="Every wardrobe type is available in all finishes, with any internal fitting combination. Choose your configuration, then customize everything inside."
      >
        <Grid cols={2} gap={6}>
          {wardrobeTypes.map((type) => (
            <div
              key={type.tag}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={type.image}
                    alt={type.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {type.tag}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {type.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {type.desc}
                </p>
                <ul className="space-y-1.5 text-small text-on-surface-2 mb-4 border-t border-border-subtle/40 pt-3">
                  {type.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2">
                      <span className="text-accent text-[12px]">✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. What's Inside */}
      <Section
        id="internal-fittings"
        eyebrow="What's Inside"
        title="What's Inside Matters Most."
        lede="The outside of a wardrobe is what guests see. The inside is what you live with every day. We configure every internal zone to your exact clothing volume and access habits."
      >
        <Grid cols={3} gap={6}>
          {internalFittings.map((fit) => (
            <div
              key={fit.title}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-2">
                  {fit.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-3">
                  {fit.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-border-subtle/40">
                <span className="text-[12px] font-bold text-accent">
                  Config: {fit.spec}
                </span>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="Wardrobe Projects"
        title="1,000+ Wardrobes. Every One Guaranteed."
        lede="A selection from Luxe Axis’s wardrobe portfolio delivered across Chennai."
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

      {/* 6. Why Choose Us */}
      <Section
        id="why-us"
        eyebrow="Why Luxe Axis"
        title="Factory-Grade Quality. Decade-Long Guarantee."
        lede="A wardrobe is used every single day. Luxe Axis builds it to outlast the room it lives in."
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
        title="Before and After: Wardrobe Transformation"
        lede="An empty bedroom wall transformed into a full-height sliding wardrobe with mirror panels and soft-close hardware in 21 days."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/renovation-bedroom-before.png',
              alt: 'Bare bedroom wall before wardrobe installation',
            }}
            afterImage={{
              src: '/posters/renovation-bedroom-after.png',
              alt: 'Completed full-height sliding wardrobe by Luxe Axis in T. Nagar',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Floor-to-Ceiling Wardrobe Makeover — T. Nagar, Chennai
          </p>
        </div>
      </Section>

      {/* 8. Fixed-Price Packages */}
      <Section
        id="pricing"
        eyebrow="Wardrobe Packages"
        title="Fixed Price. No Surprises."
        lede="Every package includes 3D design, factory fabrication, installation, and flat 10-year warranty."
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
        title="Wardrobe Design FAQ"
        lede="Everything you need to know about designing custom wardrobes in Chennai."
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
