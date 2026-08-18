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

const ROUTE = '/residential/false-ceiling';

export const metadata: Metadata = {
  title: 'Architectural False Ceiling Designers in Chennai | Luxe Axis',
  description:
    'Modern false ceiling design in Chennai. Saint-Gobain Gyproc moisture-resistant boards, perimeter cove lighting, magnetic track lights, wooden rafters, and 10-year warranty.',
  keywords: [
    'false ceiling designers in chennai',
    'modern false ceiling designs living room',
    'gyproc false ceiling cost chennai',
    'cove lighting ceiling designs',
    'wooden rafter ceiling chennai',
    'acoustic false ceiling chennai',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Architectural False Ceiling Designers in Chennai | Luxe Axis',
    description:
      'Saint-Gobain Gyproc ceilings, cove lighting, magnetic tracks, and wooden rafters with 10-year structural warranty in Chennai.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/residential-false-ceiling-hero.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis Architectural False Ceiling Design Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architectural False Ceiling Designers in Chennai | Luxe Axis',
    description:
      'Saint-Gobain Gyproc ceilings and integrated lighting with 10-year warranty.',
    images: ['/posters/residential-false-ceiling-hero.png'],
  },
};

export default async function FalseCeilingPage() {
  const highlights = [
    {
      title: 'Gypsum and POP',
      desc: 'Saint-Gobain Moisture-Resistant Gyproc Boards',
    },
    { title: 'LED Cove Ready', desc: 'Tunable White 2700K–6500K Integration' },
    {
      title: '45-Day Guarantee',
      desc: 'Contractually Locked Installation Timeline',
    },
    {
      title: 'Flat 10-Year Warranty',
      desc: 'Zero Crack, Sag, or Delamination Guarantee',
    },
    {
      title: '3D Design Visualization',
      desc: 'Photorealistic 3D Ceiling Renders Before Work Begins',
    },
  ];

  const ceilingTypes = [
    {
      tag: 'Most Popular in Chennai',
      title: 'Cove Ceiling',
      subtitle: 'Hidden Light. Ambient Drama.',
      desc: 'A recessed perimeter shelf conceals LED strip lighting, washing the ceiling with soft indirect glow. Zero visible fixtures, zero harsh shadows.',
      features: [
        'SMD 5050 LED strips in recess channel',
        'Tunable white 2700K to 6500K available',
        'Smart dimmer and scene control compatible',
        'Combined with centre recessed downlights',
      ],
      image: '/posters/residential-false-ceiling-hero.png',
    },
    {
      tag: 'Architectural Statement',
      title: 'Coffered Ceiling',
      subtitle: 'Architectural Weight. Timeless Proportion.',
      desc: 'A grid of recessed panels adds structural character to living rooms and dining areas. Each coffer frames a pendant light or concealed downlight.',
      features: [
        'Grid layout engineered to room proportions',
        'Pendant or downlight housing per coffer',
        'POP moulding on coffer edges available',
        'Acoustic insulation layer optional',
      ],
      image: '/posters/service-false-ceiling.png',
    },
    {
      tag: 'Master Bedroom Preferred',
      title: 'Tray Ceiling',
      subtitle: 'Layered Depth. Multi-Zone Light.',
      desc: 'A stepped recess that creates a floating inner plane above the room. Preferred for master bedrooms where light control defines evening mood.',
      features: [
        'Two or three stepped tray levels',
        'Cove strip per tier for layered light',
        'Visual height gain of 6 to 12 inches',
        'Ideal for rooms with 10 ft and above slab',
      ],
      image: '/posters/service-master-bedroom.png',
    },
    {
      tag: 'Luxury Homes & Theatres',
      title: 'Stretch Ceiling',
      subtitle: 'Seamless Surface. Infinite Form.',
      desc: 'A tensioned PVC or fabric membrane achieves organic curves and fully backlit panels that traditional gypsum cannot form.',
      features: [
        'Curved, concave & organic forms possible',
        'Fully backlit translucent PVC panels',
        'Printed or custom-colored membranes',
        'Home theatre acoustic fabric options',
      ],
      image: '/posters/apt-after-living-luxury.png',
    },
  ];

  const ledSpecs = [
    {
      title: 'Tunable White, 2700K to 6500K',
      desc: 'One ceiling, every mood. Warm candlelight for evenings, cool daylight for work, neutral white for daily living.',
    },
    {
      title: 'Zero Glare, Indirect Wash',
      desc: 'Hidden strip placement in the recess channel eliminates visible light sources and harsh shadow edges.',
    },
    {
      title: 'IP-Rated for Wet Areas',
      desc: 'IP44-rated moisture-resistant LED strips for bathroom, kitchen ceilings, and Chennai humid summers.',
    },
    {
      title: 'Covered Under Flat 10-Year Warranty',
      desc: 'Every LED strip, power driver, fixture, and wiring connection included under flat warranty.',
    },
  ];

  const roomGuide = [
    {
      room: 'Living Room',
      design: 'Cove + Coffered Combo',
      desc: 'Ambient LED perimeter wash with a coffered feature zone above seating. Maximum drama with full dimmer control.',
      image: '/posters/residential-false-ceiling-hero.png',
    },
    {
      room: 'Master Bedroom',
      design: 'Tray with Dimmable Cove',
      desc: 'Warm 2700K cove in a stepped tray. Supports healthy sleep lighting and full scene control from the bedside.',
      image: '/posters/service-master-bedroom.png',
    },
    {
      room: 'Dining Room',
      design: 'Single Coffered Bay',
      desc: 'One centred coffer frames a chandelier over the table. Creates focal separation between dining and living zones.',
      image: '/posters/service-false-ceiling.png',
    },
    {
      room: 'Kitchen',
      design: 'Flat Gypsum with Task Lights',
      desc: 'IP44-rated moisture-resistant board with recessed downlights over work zones. Clean, hygienic, easy to repaint.',
      image: '/posters/kitchen-layout-lshape.png',
    },
    {
      room: 'Pooja Room',
      design: 'Stepped Tray with Warm Cove',
      desc: 'Layered gypsum tiers with warm 2700K indirect light. Sacred geometry in POP border creates a sanctified focal point.',
      image: '/posters/pooja-dedicated-room.png',
    },
    {
      room: 'Kids Room & Study',
      design: 'Clean White with Task Zones',
      desc: 'Anti-glare recessed lights over the study desk. Cool 5000K for focus, warm 2700K for sleep.',
      image: '/posters/room-kids-room.png',
    },
  ];

  const galleryProjects = [
    {
      title: 'Cove LED False Ceiling in 4BHK Suite',
      tag: 'Cove LED',
      location: 'Adyar, Chennai',
      image: '/posters/residential-false-ceiling-hero.png',
    },
    {
      title: 'Coffered Ceiling in Dining Area',
      tag: 'Coffered',
      location: 'Velachery, Chennai',
      image: '/posters/service-false-ceiling.png',
    },
    {
      title: 'Master Bedroom Tray Ceiling',
      tag: 'Tray Ceiling',
      location: 'OMR, Chennai',
      image: '/posters/service-master-bedroom.png',
    },
    {
      title: 'Stretch Ceiling in Villa Home Theatre',
      tag: 'Stretch Ceiling',
      location: 'Adyar Villa, Chennai',
      image: '/posters/apt-after-living-luxury.png',
    },
  ];

  const pricingTiers = [
    {
      name: 'Gypsum Standard',
      tag: 'Standard',
      price: 'Rs. 55',
      unit: '/ sq ft',
      desc: 'Plain gypsum board with recessed downlights. Ideal for bedrooms and utility rooms.',
      features: [
        'Saint-Gobain moisture-resistant Gyproc board',
        'GI metal grid suspension framework',
        'Recessed LED downlight cutouts included',
        'POP skim finish & 2 coats ceiling paint',
        'Flat 10-year warranty & post-install support',
      ],
      cta: 'Get Standard Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Cove LED Design',
      tag: 'Most Popular',
      price: 'Rs. 110',
      unit: '/ sq ft',
      desc: 'Full cove or tray design with dimmable LED strips. The most requested ceiling in Chennai.',
      features: [
        'Cove, coffered, or stepped tray design',
        'SMD LED cove strip with tunable white',
        'Smart dimmer panel included',
        'Recessed downlights in centre field',
        'POP border moulding available',
        'Flat 10-year warranty & 45-day installation',
      ],
      cta: 'Get Cove LED Quote',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Signature Design',
      tag: 'Signature',
      price: 'Rs. 200',
      unit: '/ sq ft',
      desc: 'Stretch panels, custom profiles, acoustic tiles, and smart home integration for luxury homes.',
      features: [
        'Stretch PVC or fabric translucent membrane',
        'Fully backlit LED uniform light panels',
        'Acoustic insulation layer included',
        'Smart home dimmer & scene integration',
        'Custom profile & architectural moulding',
        'Flat 10-year warranty & white-glove delivery',
      ],
      cta: 'Explore Signature Ceilings',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is a false ceiling and why should I install one?',
      a: 'A false ceiling sits below the structural slab and serves four purposes: conceals wiring, pipes, and AC ducts; improves room acoustics; enables layered lighting with cove strips and downlights; and gives your home architectural character.',
    },
    {
      q: 'Which false ceiling type is best for a Chennai 3BHK?',
      a: 'For a standard Chennai 3BHK, a cove ceiling in the living room and a tray ceiling in the master bedroom is the most popular combination. Bedrooms 2 and 3 typically use flat gypsum with recessed downlights.',
    },
    {
      q: 'How much does false ceiling installation cost in Chennai?',
      a: 'False ceiling costs in Chennai start from Rs. 55 per sq ft for plain gypsum. Cove LED designs start from Rs. 110 per sq ft. Stretch ceilings and signature designs start from Rs. 200 per sq ft.',
    },
    {
      q: 'How long does false ceiling installation take?',
      a: 'Luxe Axis guarantees false ceiling installation within 45 days of design sign-off, backed by written delay compensation in your contract.',
    },
    {
      q: 'Can false ceilings handle Chennai’s heat and humidity?',
      a: 'Yes. We use Saint-Gobain moisture-resistant (MR) Gyproc board as standard for all Chennai ceilings. MR board will not sag, crack, or grow mold under coastal humidity.',
    },
    {
      q: 'Is LED cove lighting included in the false ceiling price?',
      a: 'Yes. Our Cove LED package (Rs. 110/sq ft) includes SMD LED cove strip lights, wiring, power drivers, and smart dimmer panel integration.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'False Ceiling Interior Designers in Chennai',
          description:
            'False ceiling interior designers in Chennai. Cove, coffered, tray, and stretch ceiling systems with integrated LED lighting.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section with Ken Burns Cinematic Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[80vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        {/* Full-Bleed Background Image with Ken Burns Cinematic Effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/posters/residential-false-ceiling-hero.png"
            alt="Luxe Axis False Ceiling Interior Designers in Chennai"
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
            path="/residential/false-ceiling"
            labels={{ 'false-ceiling': 'False Ceiling Design' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Chennai&apos;s False Ceiling Specialists
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              False Ceiling Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              The ceiling is the fifth wall. Cove, coffered, tray, and stretch
              ceiling systems with integrated LED lighting. 5,000+ false
              ceilings delivered across Chennai. 45-day guarantee, flat 10-year
              warranty.
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
                View Ceiling Projects →
              </Button>
            </div>

            {/* Hero Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  5,000+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Ceilings Done
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Install Guarantee
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

      {/* 3. Ceiling Design Systems */}
      <Section
        id="design-systems"
        eyebrow="Ceiling Design Systems"
        title="Four Ceiling Designs. One Studio."
        lede="Each ceiling type solves a different spatial problem. We design the right system for your room dimensions and lighting needs."
      >
        <Grid cols={2} gap={6}>
          {ceilingTypes.map((type) => (
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
                <h3 className="font-display text-h3 font-bold text-on-surface mb-1">
                  {type.title}
                </h3>
                <p className="text-overline text-accent uppercase font-bold tracking-wider mb-2">
                  {type.subtitle}
                </p>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {type.desc}
                </p>
                <ul className="space-y-1.5 text-small text-on-surface-2 mb-4 border-t border-border-subtle/40 pt-3">
                  {type.features.map((f) => (
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

      {/* 4. LED Integration Standard */}
      <Section
        id="led-integration"
        eyebrow="LED Integration Standard"
        title="Cove Lighting That Transforms Every Room"
        lede="Light defines how a room feels. Tunable white strips shift from warm candlelight at 2700K to crisp daylight at 6500K."
      >
        <Grid cols={2} gap={6}>
          {ledSpecs.map((spec) => (
            <div
              key={spec.title}
              className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4"
            >
              <span className="font-display text-h3 text-accent shrink-0">
                💡
              </span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">
                  {spec.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Room-by-Room Guide */}
      <Section
        id="room-guide"
        eyebrow="Room-by-Room Design Guide"
        title="The Right Ceiling for Every Room"
        lede="Each room in your home has a different ceiling requirement."
      >
        <Grid cols={3} gap={6}>
          {roomGuide.map((rg) => (
            <div
              key={rg.room}
              className="lx-liquid-glass rounded-2xl p-5 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-1 rounded bg-accent/20 border border-accent/40 text-accent font-ui text-[10px] font-bold uppercase tracking-wider">
                  {rg.room}
                </span>
                <h3 className="font-display text-h4 font-bold text-on-surface mt-3">
                  {rg.design}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mt-2">
                  {rg.desc}
                </p>
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
        eyebrow="False Ceiling Projects"
        title="5,000+ Ceilings. Every One Guaranteed."
        lede="From compact bedroom ceilings to dramatic villa living rooms. Delivered in 45 days with flat 10-year warranty."
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
        title="Before and After: Living Room False Ceiling"
        lede="Bare concrete slab ceiling transformed into a cove LED false ceiling in Adyar, Chennai."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/apt-before-construction-raw.png',
              alt: 'Bare concrete slab ceiling before false ceiling installation',
            }}
            afterImage={{
              src: '/posters/apt-after-living-luxury.png',
              alt: 'Completed cove LED false ceiling by Luxe Axis in Adyar',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            False Ceiling Transformation — Adyar, Chennai
          </p>
        </div>
      </Section>

      {/* 9. Fixed-Price Packages */}
      <Section
        id="pricing"
        eyebrow="False Ceiling Packages"
        title="Fixed-Price Ceilings. Per Sq Ft. No Surprises."
        lede="Every package includes 3D ceiling design, itemised fixed-price quote, 45-day installation guarantee, and flat 10-year warranty."
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
        title="False Ceiling FAQ"
        lede="Everything you need to know before booking your false ceiling consultation."
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
