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

const ROUTE = '/residential/tv-unit';

export const metadata: Metadata = {
  title: 'TV Unit Design in Chennai | Luxe Axis',
  description:
    'Custom TV unit design in Chennai. Floating panels, backlit media walls, floor-to-ceiling modular units. BWR marine ply, Hettich hardware. 45-day delivery, flat 10-year warranty.',
  alternates: canonicalFor(ROUTE),
};

export default async function TvUnitPage() {
  const highlights = [
    {
      title: 'BWR Marine Ply',
      desc: '100% Humidity-Proof Carcass for Coastal Air',
    },
    {
      title: 'Backlit LED Ready',
      desc: 'Integrated Cove, Halo & Accent Profile Lighting',
    },
    {
      title: 'Factory Precision',
      desc: '0.1mm CNC-Cut Panels for Flawless Alignment',
    },
    {
      title: 'Flat 10-Year Warranty',
      desc: 'Comprehensive Coverage Across Carcass, Panels & Hardware',
    },
    {
      title: '45-Day Build Guarantee',
      desc: 'Contractually Locked Delivery with Delay Compensation',
    },
  ];

  const fourPillars = [
    {
      num: '01',
      title: 'Designed Around Your Screen Size',
      desc: 'Every TV unit is dimensioned to your screen size. Panel height, width, depth, and viewing distance are calculated first so ergonomics lead the aesthetics.',
    },
    {
      num: '02',
      title: 'Built for Indian Humidity',
      desc: 'All carcasses use BWR marine-grade plywood from Century Ply. Chennai’s coastal air does not warp, swell, or delaminate marine ply. Covered under flat 10-year warranty.',
    },
    {
      num: '03',
      title: 'Lighting That Elevates the Wall',
      desc: 'Backlit LED cove behind the TV panel, integrated strip lighting in open shelves, and accent downlights in closed cabinets for an elevated media experience.',
    },
    {
      num: '04',
      title: 'Storage Built Into the Design',
      desc: 'Open shelves for decor, closed cabinets for set-top boxes and routers, and hidden pull-out drawers for remotes and cables. Storage disappears into the wall design.',
    },
  ];

  const designStyles = [
    {
      tag: 'Most Popular in 2BHK',
      title: 'Floating Panel',
      subtitle: 'Minimal Weight. Maximum Impact.',
      desc: 'A wall-mounted TV unit with zero floor contact. Clean lines, open floor space, and a modern profile that makes any living room feel larger.',
      features: [
        'Wall-mounted, zero floor footprint',
        'Under-panel LED glow strip included',
        'Storage cabinet with soft-close Hettich hardware',
        'Ideal for rooms with 9 to 10 ft walls',
      ],
      image: '/posters/persona-router.avif',
    },
    {
      tag: 'Maximum Storage',
      title: 'Floor to Ceiling',
      subtitle: 'Total Coverage. Total Storage.',
      desc: 'Columns of closed cabinets extend from floor to ceiling, flanking the TV panel with storage that doubles as an architectural feature wall.',
      features: [
        'Full vertical cabinets on either side of TV',
        'Mixed open shelves and closed shutters',
        'Integrated cable management channels',
        'Best for rooms with 10 ft plus slab height',
      ],
      image: '/posters/portfolio.avif',
    },
    {
      tag: 'Fully Configurable',
      title: 'Modular Wall',
      subtitle: 'Configure Every Module Your Way.',
      desc: 'Standardized modules in different widths and heights combine to create a wall that looks custom but is factory-precise. Reconfigure as your home evolves.',
      features: [
        'Mix closed cabinets, open niches & drawers',
        'Replace one module without dismantling others',
        'Asymmetric compositions for editorial looks',
        'Hettich & Hafele hardware standard',
      ],
      image: '/posters/pricing-axis.avif',
    },
    {
      tag: 'Luxury & Villas',
      title: 'Backlit Media Wall',
      subtitle: 'The Wall That Glows.',
      desc: 'An integrated backlit panel behind the TV creates a glowing halo that reduces eye strain and transforms the wall into a cinematic centerpiece.',
      features: [
        'LED halo cove behind TV panel',
        'Shelf-integrated accent strip lighting',
        'Tunable white 2700K to 6500K available',
        'Smart dimmer scene control compatible',
      ],
      image: '/posters/hero.avif',
    },
  ];

  const sizingGuide = [
    {
      homeType: '2BHK Apartment',
      title: 'Compact Living Room',
      sub: 'Avg 130 to 160 sq ft',
      wallWidth: '5 to 6 ft',
      tvSize: '43 to 55 inch',
      height: '4 to 4.5 ft',
      storage: 'Under-panel cabinets',
      bestStyle: 'Floating Panel',
      cost: 'From Rs. 35,000',
    },
    {
      homeType: '3BHK Apartment',
      title: 'Standard Living Room',
      sub: 'Avg 180 to 220 sq ft',
      wallWidth: '8 to 10 ft',
      tvSize: '55 to 65 inch',
      height: '6 to 7 ft',
      storage: 'Full modular wall with shelves',
      bestStyle: 'Modular Wall or Floor to Ceiling',
      cost: 'From Rs. 75,000',
    },
    {
      homeType: '4BHK & Villa',
      title: 'Grand Living Room',
      sub: '350 sq ft and above',
      wallWidth: 'Wall to Wall',
      tvSize: '65 to 85 inch',
      height: 'Floor to ceiling',
      storage: 'Bar nook or study zone integrated',
      bestStyle: 'Backlit Floor-to-Ceiling',
      cost: 'From Rs. 1.5 Lakhs',
    },
  ];

  const galleryProjects = [
    {
      title: 'Backlit Media Wall in 4BHK Living Suite',
      tag: 'Backlit Media Wall',
      location: 'Adyar, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'Floor-to-Ceiling Modular Media Wall',
      tag: 'Floor to Ceiling',
      location: 'Velachery, Chennai',
      image: '/posters/portfolio.avif',
    },
    {
      title: 'Floating TV Panel with Cove LED',
      tag: 'Floating Panel',
      location: 'OMR, Chennai',
      image: '/posters/persona-router.avif',
    },
    {
      title: 'Modular TV Wall with Open Shelves',
      tag: 'Modular Wall',
      location: 'Anna Nagar, Chennai',
      image: '/posters/pricing-axis.avif',
    },
  ];

  const pricingTiers = [
    {
      name: 'Floating Panel',
      tag: 'Essential',
      price: 'Rs. 35,000',
      unit: '/ unit',
      desc: 'Wall-mounted floating panel with under-unit storage cabinets and LED under-glow strip.',
      features: [
        'BWR marine-grade plywood carcass',
        'Hettich soft-close hinges',
        'Matte or laminate shutter finish',
        'Under-unit LED glow strip',
        'Flat 10-year warranty & post-install service',
      ],
      cta: 'Get Floating Panel Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Modular Media Wall',
      tag: 'Most Popular',
      price: 'Rs. 75,000',
      unit: '/ unit',
      desc: 'Full modular wall with open shelves, closed cabinets, backlit cove and premium finish.',
      features: [
        '19mm BWR marine-grade plywood carcass',
        'Hettich full-extension drawer system',
        'Open niches and closed shutters',
        'LED backlit cove behind TV panel',
        'Shelf accent strip lighting',
        'Flat 10-year warranty & 45-day build guarantee',
      ],
      cta: 'Get Modular Wall Quote',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Floor-to-Ceiling Signature',
      tag: 'Signature',
      price: 'Rs. 1.5L',
      unit: '/ unit',
      desc: 'Custom floor-to-ceiling unit with stone-look panels, integrated smart LED, Hafele hardware & bespoke design.',
      features: [
        'BWP marine ply carcass throughout',
        'Hafele full-extension soft-close hardware',
        'Stone-look or natural veneer panel finish',
        'Multi-zone smart dimmer LED system',
        'Integrated bar or study nook option',
        'Flat 10-year warranty & contractually locked timeline',
      ],
      cta: 'Explore Signature TV Unit',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'How much does a custom TV unit cost in Chennai?',
      a: 'Custom TV unit costs in Chennai start from Rs. 35,000 for a floating panel with storage cabinets. A premium modular media wall starts from Rs. 75,000. Full floor-to-ceiling signature units start from Rs. 1.5 lakhs. All quotes are fixed price.',
    },
    {
      q: 'What is a backlit TV wall and is it worth it?',
      a: 'A backlit TV wall incorporates indirect LED strip lighting behind the panel or within cove channels. It creates a soft, halo ambient glow that reduces eye strain during night viewing while turning your wall into a dramatic design centerpiece.',
    },
    {
      q: 'How long does TV unit installation take with Luxe Axis?',
      a: 'Luxe Axis guarantees TV unit delivery and installation within 45 days of design sign-off, backed by written delay compensation in your contract.',
    },
    {
      q: 'What material is best for TV units in Chennai’s climate?',
      a: 'We use 18mm/19mm BWR (Boiling Water Resistant) marine-grade plywood carcasses from Century Ply. Marine ply does not warp or swell under Chennai’s coastal humidity, unlike MDF or particle board.',
    },
    {
      q: 'Does Luxe Axis’s flat 10-year warranty cover TV units?',
      a: 'Yes. Our flat 10-year warranty covers the carcass plywood, shutter panels, Hettich/Hafele hardware, and edge banding with zero hidden service fees.',
    },
    {
      q: 'How does Luxe Axis handle cable management?',
      a: 'Every TV unit includes concealed internal cable conduits, brush grommets, and dedicated socket housings so set-top box wires, HDMI cables, and power cords remain completely invisible.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'TV Unit Design in Chennai',
          description:
            'Custom TV unit design in Chennai. Floating panels, backlit media walls, floor-to-ceiling modular units with 45-day delivery guarantee.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs
            path="/residential/tv-unit"
            labels={{ 'tv-unit': 'TV Unit Design' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Chennai&apos;s Custom TV Unit Studio
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              TV Unit Design <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Every room revolves around it. Custom floating panels, backlit
              media walls and floor-to-ceiling modular TV units built for
              Chennai homes. 8,000+ units delivered. 45-day guarantee, flat
              10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free TV Unit Consultation
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                View TV Unit Projects →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  8,000+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  TV Units Built
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Build Guarantee
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

      {/* 3. The Four Pillars */}
      <Section
        id="four-pillars"
        eyebrow="Media Architecture"
        title="The Wall Every Room Revolves Around"
        lede="We design every media wall to balance visual proportion, concealed cabling, multi-layer lighting, and marine-grade durability."
      >
        <Grid cols={2} gap={6}>
          {fourPillars.map((p) => (
            <div
              key={p.num}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h2 font-bold text-accent shrink-0">
                {p.num}
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
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

      {/* 4. Four Design Systems */}
      <Section
        id="design-systems"
        eyebrow="TV Unit Design Systems"
        title="Four Styles. One Centrepiece."
        lede="Each style solves a different room problem. We match the design to your wall dimensions, storage needs, and visual weight."
      >
        <Grid cols={2} gap={6}>
          {designStyles.map((style) => (
            <div
              key={style.tag}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {style.tag}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-1">
                  {style.title}
                </h3>
                <p className="text-overline text-accent uppercase font-bold tracking-wider mb-2">
                  {style.subtitle}
                </p>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {style.desc}
                </p>
                <ul className="space-y-1.5 text-small text-on-surface-2 mb-4 border-t border-border-subtle/40 pt-3">
                  {style.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-accent text-[12px]">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. TV Wall Sizing Guide */}
      <Section
        id="sizing-guide"
        eyebrow="TV Wall Sizing Guide"
        title="Right Dimensions for Every Home"
        lede="TV unit proportions are determined by room size, wall width, and screen diagonal."
      >
        <Grid cols={3} gap={6}>
          {sizingGuide.map((g) => (
            <div
              key={g.homeType}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-1 rounded bg-accent/20 border border-accent/40 text-accent font-ui text-[10px] font-bold uppercase tracking-wider">
                  {g.homeType}
                </span>
                <h3 className="font-display text-h3 font-bold text-on-surface mt-3">
                  {g.title}
                </h3>
                <p className="text-overline text-on-surface-muted uppercase tracking-wider mb-4">
                  {g.sub}
                </p>
                <div className="mb-4 pb-4 border-b border-border-subtle/40">
                  <span className="text-overline text-accent uppercase font-bold tracking-wider block">
                    Recommended Wall Width
                  </span>
                  <span className="font-display text-h2 font-bold text-accent">
                    {g.wallWidth}
                  </span>
                </div>
                <ul className="space-y-2 text-small text-on-surface-2 mb-4">
                  <li className="flex justify-between">
                    <span className="text-on-surface-muted">TV Size:</span>
                    <strong className="text-on-surface">{g.tvSize}</strong>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-on-surface-muted">Unit Height:</span>
                    <strong className="text-on-surface">{g.height}</strong>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-on-surface-muted">Best Style:</span>
                    <strong className="text-accent">{g.bestStyle}</strong>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-on-surface-muted">
                      Starting Cost:
                    </span>
                    <strong className="text-on-surface">{g.cost}</strong>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 6. Material Partners */}
      <MaterialPartners />

      {/* 7. Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="TV Unit Projects"
        title="8,000+ Media Walls. Every One Guaranteed."
        lede="From compact floating panels in Tambaram to full backlit media walls in Adyar villas."
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

      {/* 8. Interactive Before & After Slider */}
      <Section
        id="before-after"
        eyebrow="Real Transformation"
        title="Before and After: Living Room Media Wall"
        lede="A plain living room wall transformed into a backlit media wall in Velachery, Chennai."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Plain living room wall before TV unit installation',
            }}
            afterImage={{
              src: '/posters/hero.avif',
              alt: 'Completed backlit media wall TV unit by Luxe Axis in Velachery',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Media Wall Transformation — Velachery, Chennai
          </p>
        </div>
      </Section>

      {/* 9. Fixed-Price Packages */}
      <Section
        id="pricing"
        eyebrow="TV Unit Packages"
        title="Fixed-Price TV Units. No Surprises."
        lede="Every package includes 3D design, fixed-price quote, 45-day build guarantee, and flat 10-year warranty."
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
        eyebrow="Questions Answered"
        title="TV Unit FAQ"
        lede="Everything you need to know before booking your TV unit consultation."
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
