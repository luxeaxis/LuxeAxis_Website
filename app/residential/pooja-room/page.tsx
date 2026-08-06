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

const ROUTE = '/residential/pooja-room';

export const metadata: Metadata = {
  title: 'Pooja Room Interior Designers in Chennai | Luxe Axis',
  description:
    'Sacred pooja room designs in Chennai. White Makrana marble, teakwood, backlit onyx, compact to walk-in mandirs. Flat 10-year warranty, 45-day delivery. Free consultation.',
  alternates: canonicalFor(ROUTE),
};

export default async function PoojaRoomPage() {
  const highlights = [
    {
      title: 'Sacred Spaces',
      desc: 'Compact Wall Units to Immersive Walk-In Temple Mandirs',
    },
    {
      title: 'Premium Materials',
      desc: 'White Makrana Marble, Seasoned Teak, Brass Inlays & Onyx Slabs',
    },
    {
      title: 'Backlit Devotional Lighting',
      desc: 'Warm Ambient Coves & Recessed LED Icon Profile Backlighting',
    },
    {
      title: 'Flat 10-Year Warranty',
      desc: 'Comprehensive Coverage Across Materials, Carvings & Finishes',
    },
    {
      title: '45-Day Move-In Guarantee',
      desc: 'Contractually Locked Timeline with Written Delay Compensation',
    },
  ];

  const sacredForms = [
    {
      tag: 'For Apartments & Compact Homes',
      title: 'Compact Pooja Unit',
      desc: 'A wall-mounted or freestanding cabinet that transforms a corner or alcove into a dedicated sacred space. Designed for apartments where a separate room is not possible without compromising on sanctity.',
      specs: [
        'Wall-mounted or freestanding compact designs',
        'Grade-A Teak or BWR ply with natural veneer shutters',
        'Warm LED icon niches and soft backlighting',
        'Integrated storage drawers for oil, cotton & pooja items',
        'Flat 10-year warranty included (Starting from Rs. 30,000)',
      ],
      image: '/posters/persona-router.avif',
    },
    {
      tag: 'For Villas & Large Apartments',
      title: 'Dedicated Pooja Room',
      desc: 'A full room or generous alcove with custom marble flooring, ceiling design, backlit niches, marble platform, and devotional lighting for a complete sacred experience within your home.',
      specs: [
        'White Makrana marble or granite prayer platform',
        'Custom Gyproc false ceiling with warm cove lighting',
        'Decorative brass jali and lattice screens',
        'Solid teakwood main cabinet with traditional carvings',
        'Flat 10-year warranty included (Starting from Rs. 80,000)',
      ],
      image: '/posters/portfolio.avif',
    },
    {
      tag: 'For Premium Luxury Villas',
      title: 'Walk-In Temple Mandir',
      desc: 'A fully immersive devotional sanctuary with temple-grade architecture. White marble flooring, carved teak columns, backlit onyx panels, and a vaulted ceiling create a home temple of lasting significance.',
      specs: [
        'White Makrana or Carrara marble mirror-polished flooring',
        'Carved teak columns and arched mandap entry',
        'Translucent backlit natural onyx rear panel',
        'Dome or vaulted ceiling with subtle gold leaf detailing',
        'Flat 10-year warranty included (Starting from Rs. 1,80,000)',
      ],
      image: '/posters/hero.avif',
    },
  ];

  const sacredMaterials = [
    {
      origin: 'Rajasthan, India',
      name: 'White Makrana Marble',
      desc: 'Pure white Makrana marble for platforms and prayer flooring. Cool to touch, sacred in tradition, and moisture-resistant for Chennai’s coastal climate. Polished to a mirror finish.',
    },
    {
      origin: 'Kerala Grade-A',
      name: 'Seasoned Teak Wood',
      desc: 'Grade-A seasoned teak for main cabinets and structural frames. Naturally oil-rich, resists warping and humidity, accepting fine carving for traditional temple motifs.',
    },
    {
      origin: 'Artisan Cast',
      name: 'Brass Accents & Jali',
      desc: 'Hand-cast brass jali panels, lamp holders, and decorative trim with anti-tarnish coating. Adds the warmth and golden glow of temple brass to every devotional corner.',
    },
    {
      origin: 'Translucent Stone',
      name: 'Backlit Natural Onyx',
      desc: 'Translucent onyx marble slabs lit from behind create a warm, ethereal glow. Used as rear focal panels in walk-in mandirs and dedicated rooms with unique veining.',
    },
  ];

  const galleryProjects = [
    {
      title: 'Walk-In White Marble & Teak Mandir',
      tag: 'Walk-In Mandir',
      location: 'Adyar, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'Compact Apartment Pooja Unit with LED Niches',
      tag: 'Compact Unit',
      location: 'T. Nagar, Chennai',
      image: '/posters/persona-router.avif',
    },
    {
      title: 'Dedicated Pooja Room with Backlit Onyx Panel',
      tag: 'Dedicated Room',
      location: 'Velachery, Chennai',
      image: '/posters/portfolio.avif',
    },
    {
      title: 'Traditional Brass Jali & Teak Pooja Sanctum',
      tag: 'Brass Jali',
      location: 'Anna Nagar, Chennai',
      image: '/posters/pricing-axis.avif',
    },
  ];

  const whyChooseUs = [
    {
      num: '01',
      title: 'Sacred Proportion & Vastu Alignment',
      desc: 'We follow strict Vastu Shastra guidelines and traditional proportional systems in every pooja room we design. Placement, North-East Ishanya orientation, and material selection align sacred principles with modern luxury.',
    },
    {
      num: '02',
      title: 'Flat 10-Year Warranty on Every Element',
      desc: 'From the marble platform to the teak cabinet to brass fittings, every element of your pooja room is covered under our flat 10-year warranty with no fine print.',
    },
    {
      num: '03',
      title: '3D Approval Before Any Work Begins',
      desc: 'We create photorealistic 3D VR renders of your pooja room before ordering a single material. You approve every detail and execution starts only after your explicit sign-off.',
    },
    {
      num: '04',
      title: '45-Day Contractual Delivery Guarantee',
      desc: 'Our 45-day delivery commitment is backed by a compensation clause written into your agreement. If we are late, you are compensated in writing.',
    },
    {
      num: '05',
      title: 'Post-Installation After-Care Service',
      desc: 'Our dedicated after-care team handles every service request after handover — marble re-polishing, wood touch-ups, brass cleaning, and lighting driver replacement.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Compact Pooja Unit',
      tag: 'Starter',
      price: 'Rs. 30K',
      unit: '/ unit',
      desc: 'Wall-mounted or freestanding cabinet for apartments and compact homes.',
      features: [
        'Teakwood or BWR marine ply carcass',
        'LED icon niche illumination',
        'Natural wood veneer or laminate finish',
        'Integrated oil & brass storage drawers',
        'Flat 10-year warranty & post-install care',
      ],
      cta: 'Get Compact Unit Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Dedicated Pooja Room',
      tag: 'Most Popular',
      price: 'Rs. 80K',
      unit: '/ room',
      desc: 'Full dedicated pooja room with marble platform, teak cabinet, ceiling work, and brass jali.',
      features: [
        'White Makrana marble or granite platform',
        'Solid seasoned teak main cabinet',
        'Gyproc false ceiling with cove lighting',
        'Decorative brass jali or lattice screens',
        '3D VR spatial preview',
        'Flat 10-year warranty & 45-day move-in guarantee',
      ],
      cta: 'Book Pooja Room Audit',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Walk-In Temple Mandir',
      tag: 'Luxury Grand',
      price: 'Rs. 1.8L',
      unit: '/ mandir',
      desc: 'A complete home temple with marble flooring, carved teak columns, backlit onyx, and arched ceiling.',
      features: [
        'White Makrana marble mirror-polished flooring',
        'Carved teak columns & arched mandap entry',
        'Translucent backlit onyx rear focal panel',
        'Dome or vaulted ceiling with gold leaf detailing',
        'Full 3D VR simulation',
        'Flat 10-year warranty & contractually locked timeline',
      ],
      cta: 'Explore Walk-In Mandir Design',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is the cost of a pooja room design in Chennai in 2025?',
      a: 'Compact pooja units start from Rs. 30,000. Dedicated pooja rooms range from Rs. 80,000 to Rs. 2,00,000. Walk-in mandirs start from Rs. 1,80,000 depending on size and materials. All quotes are fixed once signed with zero cost escalation.',
    },
    {
      q: 'How long does a pooja room installation take?',
      a: 'A compact pooja unit takes 7 to 10 days. A dedicated pooja room takes 15 to 20 days. Walk-in mandirs take 25 to 35 days under our 45-day delivery guarantee.',
    },
    {
      q: 'Does Luxe Axis’s flat 10-year warranty cover pooja room materials?',
      a: 'Yes. The flat 10-year warranty covers every element including cabinetry, marble work, brass fittings, backlighting, and finishes with no hidden conditions.',
    },
    {
      q: 'Which material is best for a pooja room in Chennai’s humid climate?',
      a: 'We recommend BWR-grade teak ply or solid teak for cabinetry, white Makrana marble or black granite for platforms, and powder-coated brass for fittings. These materials resist coastal moisture and age gracefully.',
    },
    {
      q: 'Can I see my pooja room in 3D before work begins?',
      a: 'Yes. Every project includes a full 3D VR visualization before execution. You approve every detail at the design stage before a single piece of wood is cut.',
    },
    {
      q: 'Can Luxe Axis design a compact pooja unit inside a bedroom or living room?',
      a: 'Yes. Our compact pooja unit designs are built specifically for apartments without a dedicated room. We integrate units within living room feature walls or alcoves, maintaining full devotional sanctity.',
    },
    {
      q: 'Which areas in Chennai does Luxe Axis serve for pooja room design?',
      a: 'We serve all major areas across Chennai including Adyar, T. Nagar, Velachery, OMR, Anna Nagar, Tambaram, Porur, Sholinganallur, Perungudi, and 16+ other locations.',
    },
    {
      q: 'What is the difference between a pooja unit and a dedicated pooja room?',
      a: 'A pooja unit is a compact standalone or wall-mounted cabinet designed for an existing living hall. A dedicated pooja room is a full room or alcove with custom flooring, ceiling, and lighting. Both are designed with equal reverence.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Pooja Room Interior Designers in Chennai',
          description:
            'Sacred pooja room designs in Chennai. White Makrana marble, teakwood, backlit onyx, compact to walk-in mandirs with 45-day delivery guarantee.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs
            path="/residential/pooja-room"
            labels={{ 'pooja-room': 'Pooja Room Design' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Sacred Craft. Sacred Space.
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Pooja Room Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Where reverence meets craft. Luxe Axis designs sacred spaces that
              honour tradition and endure for generations, with a flat 10-year
              warranty on every element.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free Consultation
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                View Sacred Projects →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  10,000+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Sacred Spaces
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Move-In Guarantee
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
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  3
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

      {/* 3. Three Sacred Forms */}
      <Section
        id="sacred-forms"
        eyebrow="Pooja Room Styles"
        title="One Craft, Three Sacred Forms"
        lede="From a compact unit tucked within a wall to a full walk-in mandir, we design each form with the same reverence for material and sacred proportion."
      >
        <Grid cols={3} gap={6}>
          {sacredForms.map((form) => (
            <div
              key={form.tag}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={form.image}
                    alt={form.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {form.tag}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {form.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {form.desc}
                </p>
                <ul className="space-y-1.5 text-small text-on-surface-2 mb-4 border-t border-border-subtle/40 pt-3">
                  {form.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2">
                      <span className="text-accent text-[12px]">✦</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Four Sacred Materials */}
      <Section
        id="sacred-materials"
        eyebrow="Sacred Materials"
        title="Materials That Honour the Space"
        lede="Every material we use in a pooja room is chosen for its spiritual significance, durability in Chennai’s coastal climate, and ability to age with grace."
      >
        <Grid cols={2} gap={6}>
          {sacredMaterials.map((mat) => (
            <div
              key={mat.name}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30"
            >
              <span className="text-overline text-accent uppercase font-bold tracking-wider block mb-1">
                {mat.origin}
              </span>
              <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                {mat.name}
              </h3>
              <p className="text-small text-on-surface-2 leading-relaxed">
                {mat.desc}
              </p>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Pooja Room Projects Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="Sacred Spaces Delivered"
        title="Pooja Rooms We Built Across Chennai"
        lede="From compact apartment units to full walk-in mandirs delivered across Chennai."
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

      {/* 6. Why Chennai Families Trust Us */}
      <Section
        id="why-us"
        eyebrow="Why Luxe Axis"
        title="Why Chennai Families Trust Us With Sacred Spaces"
        lede="A pooja room is not just a design brief — it is the spiritual center of the home. We bring equal care to every mandir we build."
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
        title="Before & After: Sacred Transformation"
        lede="A plain corner of a 3BHK in Velachery transformed into a dedicated pooja room with white marble, teak cabinetry, and backlit brass niches in 22 days."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Plain room corner before pooja room installation',
            }}
            afterImage={{
              src: '/posters/portfolio.avif',
              alt: 'Completed dedicated pooja room with marble and teak by Luxe Axis',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Dedicated Pooja Room — Velachery, Chennai
          </p>
        </div>
      </Section>

      {/* 8. Fixed-Price Packages */}
      <Section
        id="pricing"
        eyebrow="Pooja Room Packages"
        title="Fixed Price. No Surprises."
        lede="Every package includes 3D VR design, locked itemized quote, 45-day delivery, and flat 10-year warranty."
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
        title="Pooja Room FAQ"
        lede="Everything you need to know about designing your pooja room in Chennai."
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
