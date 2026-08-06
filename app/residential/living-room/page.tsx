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

const ROUTE = '/residential/living-room';

export const metadata: Metadata = {
  title: 'Living Room Interior Designers in Chennai | Luxe Axis',
  description:
    'Expert living room interior designers in Chennai. Feature walls, false ceilings, TV units, ambient magnetic lighting. 45-day delivery, flat 10-year warranty.',
  alternates: canonicalFor(ROUTE),
};

export default function LivingRoomPage() {
  const highlights = [
    { title: '600+ Living Rooms', desc: 'Designed & Delivered Across All Major Chennai Neighborhoods' },
    { title: 'Statement Feature Walls', desc: 'Sintered Stone Slabs, Fluted Louvers & Venetian Plaster Panels' },
    { title: 'TV Unit + Ceiling System', desc: 'Integrated Entertainment Wall & Gyproc False Ceiling Architecture' },
    { title: 'Flat 10-Year Warranty', desc: 'Comprehensive Coverage Across Every Material, Hardware & Finish' },
    { title: '45-Day Move-In Guarantee', desc: 'Contractually Locked Timeline with Written Delay Compensation' },
  ];

  const focalElements = [
    {
      num: '01',
      title: 'Architectural Feature Wall',
      desc: 'The visual anchor of the room. Italian sintered stone slabs, textured louvers, or fluted timber systems — precision-engineered, not pasted-on.',
    },
    {
      num: '02',
      title: 'Integrated Ceiling Architecture',
      desc: 'Gyproc false ceiling zones, magnetic track lighting channels, and concealed AC ducting all engineered prior to execution.',
    },
    {
      num: '03',
      title: 'Layered Ambient Lighting',
      desc: 'Multi-layered illumination: warm perimeter coves, architectural trimless spotlights, and accent points designed into the ceiling structure.',
    },
    {
      num: '04',
      title: 'Concealed Smart Storage',
      desc: 'Seamless handleless cabinetry, display niches with warm LED backlighting, and floating under-unit storage integrated into walls.',
    },
    {
      num: '05',
      title: 'Entertainment Wall & TV Unit',
      desc: 'Not just a shelf for a screen — a commanding entertainment wall with concealed wire channels and material continuity with the feature wall.',
    },
  ];

  const spatialZones = [
    {
      num: '01',
      name: 'Entry & Foyer Zone',
      desc: 'The transitional threshold from entrance to living hall. Defines first impressions with custom console joinery, wall accents, and warm welcome lighting.',
    },
    {
      num: '02',
      name: 'Primary Seating Zone',
      desc: 'The conversation and relaxation heart of the home. Centered around sofa layout, designer rug, and recessed ceiling cove above.',
    },
    {
      num: '03',
      name: 'Entertainment Wall',
      desc: 'TV console, media storage, and ambient backlit stone paneling — engineered as permanent architecture rather than standalone furniture.',
    },
    {
      num: '04',
      name: 'Conversation Nook',
      desc: 'Secondary seating area, reading armchair, or bay window seating that gives the living room spatial depth beyond the main sofa arrangement.',
    },
  ];

  const galleryProjects = [
    {
      title: 'Contemporary Sintered Stone Feature Wall',
      tag: 'Full Living Room',
      location: 'Adyar, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'Open Plan Living and Dining Zone',
      tag: 'Open Plan',
      location: 'Anna Nagar, Chennai',
      image: '/posters/portfolio.avif',
    },
    {
      title: 'Minimalist Clean-Line Living Space',
      tag: 'Minimalist',
      location: 'T. Nagar, Chennai',
      image: '/posters/pricing-axis.avif',
    },
    {
      title: 'Integrated Entertainment Wall & Magnetic Lighting',
      tag: 'TV + Ceiling',
      location: 'Velachery, Chennai',
      image: '/posters/persona-router.avif',
    },
  ];

  const whyChooseUs = [
    {
      num: '01',
      title: 'The First Impression Room',
      desc: 'Every visitor forms an instant impression of your home in the living room. Luxe Axis designs it to make that impression unforgettable with bespoke materials and Vastu balance.',
    },
    {
      num: '02',
      title: 'Feature Wall Craftsmanship',
      desc: 'Italian marble, sintered stone slabs, textured panels, and wood slat louvers. Our feature walls are permanent architectural installations that age gracefully.',
    },
    {
      num: '03',
      title: 'Ceiling & Lighting as One System',
      desc: 'False ceiling coves, magnetic tracks, pendant anchors, and smart switch zoning designed together upfront — never pieced together mid-work.',
    },
    {
      num: '04',
      title: 'TV Unit as Architectural Anchor',
      desc: 'Your entertainment wall is the focal centerpiece. We build it with concealed wire management, integrated warm LED coves, and matching paneling.',
    },
    {
      num: '05',
      title: 'Flat 10-Year Warranty & 45-Day Delivery Guarantee',
      desc: 'Both promises are contractually locked. Your living room is ready in 45 days, and every panel, hinge, LED driver, and finish is covered under our flat 10-year warranty.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Feature Wall + TV Unit',
      tag: 'Starter',
      price: 'Rs. 1.5L',
      unit: '/ project',
      desc: 'A focused transformation centered on the entertainment wall and feature accent.',
      features: [
        'Sintered stone or fluted wood feature wall',
        'Floating TV console with soft-close drawers',
        'Concealed cable ducting & wire management',
        'Warm LED backlight cove illumination',
        'Flat 10-year warranty & post-install care',
      ],
      cta: 'Get TV Unit Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Full Living Room Makeover',
      tag: 'Most Popular',
      price: 'Rs. 2.8L',
      unit: '/ room',
      desc: 'A complete living room redesign, from Gyproc ceiling to flooring to feature wall.',
      features: [
        'Gyproc false ceiling with magnetic track channels',
        'Full-height feature wall with premium cladding',
        'Integrated TV entertainment console',
        'Asian Paints Royale finish & wall treatment',
        '3D VR design preview prior to execution',
        'Flat 10-year warranty & 45-day move-in guarantee',
      ],
      cta: 'Book Living Room Audit',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Open Plan Living + Dining',
      tag: 'Premium Grand',
      price: 'Rs. 4.5L',
      unit: '/ project',
      desc: 'A unified open plan design where living and dining flow seamlessly together.',
      features: [
        'Continuous false ceiling architecture across living & dining',
        'Sintered stone feature wall + TV unit console',
        'Dining zone ceiling drop & chandelier pendant anchor',
        'Unified vitrified or Italian marble flooring palette',
        'Full 3D VR spatial simulation',
        'Flat 10-year warranty & contractually locked timeline',
      ],
      cta: 'Explore Open Plan Design',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = [
    {
      name: 'Aadhithya B. Kailash',
      location: 'Adyar, Chennai',
      quote:
        'My living room and 3BHK interiors were completed even before the promised handover date. Luxe Axis managed every detail professionally. Outstanding execution!',
      stars: 5,
    },
    {
      name: 'Senthil Kumar',
      location: 'Adyar, Chennai',
      quote:
        'Excellent feature wall and ceiling lighting execution. The architects explained the pros and cons of stone vs veneer clearly, making decisions effortless.',
      stars: 5,
    },
    {
      name: 'Venkat Ramanan',
      location: 'T. Nagar, Chennai',
      quote:
        'Superior customization options and top-tier joinery quality. The team gave detailed walkthroughs on every material. Delivered ahead of expected schedule!',
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: 'What does living room interior design cost in Chennai in 2025?',
      a: 'Living room interior design in Chennai starts from Rs. 1,50,000 for a feature wall and TV unit, and Rs. 2,80,000 for a full living room redesign. Open plan living and dining projects start from Rs. 4,50,000 with zero cost escalation once signed.',
    },
    {
      q: 'How long does a living room interior project take?',
      a: 'Luxe Axis guarantees completion within 45 days of project start. This is contractually backed with automatic compensation clauses if we miss your deadline.',
    },
    {
      q: 'What is a feature wall and does Luxe Axis design them?',
      a: 'A feature wall is a single design-focused accent wall that anchors the living room’s visual identity. We design feature walls using Italian sintered stone slabs, fluted louvers, veneer paneling, and warm backlit niches.',
    },
    {
      q: 'Does Luxe Axis’s flat 10-year warranty cover living room interiors?',
      a: 'Yes. Our flat 10-year warranty covers every element of your living room, including feature wall cladding, false ceiling framing, TV unit joinery, lighting channels, and hardware with no fine print.',
    },
    {
      q: 'Can I see my living room in 3D before work starts?',
      a: 'Yes. Every project includes a complete 3D VR spatial walkthrough before any work begins. You adjust layouts, materials, and colors freely, and execution starts only after your explicit approval.',
    },
    {
      q: 'What is the best false ceiling style for a Chennai living room?',
      a: 'Gyproc false ceilings with recessed cove lighting and perimeter magnetic tracks are the most popular. They provide a sleek modern finish, conceal AC ducting, and allow multi-zone lighting controls.',
    },
    {
      q: 'Which areas of Chennai does Luxe Axis cover for living room design?',
      a: 'We serve all major Chennai neighborhoods including Adyar, T. Nagar, Tambaram, OMR, Anna Nagar, Velachery, Nungambakkam, Mylapore, Porur, and 17+ other locations.',
    },
    {
      q: 'Can Luxe Axis design an open plan living and dining space?',
      a: 'Yes. We specialize in open plan living and dining layouts. We design a unified material palette, ceiling zones, and lighting plan that connects both spaces seamlessly starting from Rs. 4,50,000.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Living Room Interior Designers in Chennai',
          description:
            'Statement living room interiors, feature walls, false ceilings, TV units, and ambient magnetic lighting in Chennai with 45-day delivery guarantee.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/residential/living-room" labels={{ 'living-room': "Living Room Interiors" }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Where First Impressions Are Made
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Living Room Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Your living room is the first thing every guest sees. Luxe Axis designs it with feature walls, false ceilings, and layered magnetic lighting, delivered in 45 days with a flat 10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free Consultation
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                View Living Room Projects →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">600+</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Living Rooms</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">45 Days</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Move-In Guarantee</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10 Yr</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Flat Warranty</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">50+</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Architects</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">4.9 ★</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Google Rating</span>
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
                <span className="text-[12px] text-on-surface-muted mt-0.5 block">{item.desc}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. The Living Room Statement & 5 Focal Elements */}
      <Section
        id="focal-elements"
        eyebrow="The Living Room"
        title="Your Living Room Speaks Before You Do"
        lede="Every visitor forms an opinion of your home the moment they step into the living room. Luxe Axis designs it to make that opinion unforgettable with 5 architectural focal elements."
      >
        <Grid cols={3} gap={6}>
          {focalElements.map((elem) => (
            <div key={elem.num} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 relative flex flex-col justify-between">
              <div>
                <span className="font-display text-[32px] font-bold text-accent block mb-2">{elem.num}</span>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-2">{elem.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{elem.desc}</p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. 4-Zone Living Room Spatial Planning */}
      <Section
        id="zone-planning"
        eyebrow="Zone Planning"
        title="Every Square Foot Has a Purpose"
        lede="A living room is not one single hall — it is four functional zones working in spatial harmony."
      >
        <Grid cols={2} gap={6}>
          {spatialZones.map((zone) => (
            <div key={zone.num} className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4">
              <span className="font-display text-h2 font-bold text-accent shrink-0">{zone.num}</span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">{zone.name}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{zone.desc}</p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Living Room Project Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="Living Room Projects"
        title="600+ Living Rooms. Every One Guaranteed."
        lede="A selection from Luxe Axis’s living room portfolio delivered across Chennai."
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
                <h3 className="font-display text-h3 font-bold text-on-surface mt-2">{p.title}</h3>
                <p className="text-small text-accent font-medium mt-1">📍 {p.location}</p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 6. Five Reasons Chennai Trusts Luxe Axis */}
      <Section
        id="why-us"
        eyebrow="Why Luxe Axis"
        title="Five Reasons Chennai Trusts Luxe Axis Living Rooms"
        lede="Your living room is the most visible room in your home. Get it right with architects who build it to last."
      >
        <div className="space-y-4 max-w-4xl mx-auto">
          {whyChooseUs.map((w) => (
            <div key={w.num} className="lx-liquid-glass rounded-xl p-5 border border-accent/30 flex items-start gap-4">
              <span className="font-display text-h2 font-bold text-accent shrink-0">{w.num}</span>
              <div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-1">{w.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. Interactive Before & After Slider */}
      <Section
        id="before-after"
        eyebrow="Real Transformation"
        title="Before & After: Living Room Transformation"
        lede="Plain bare hall converted into a luxury living space with sintered stone feature wall and Gyproc false ceiling in 45 days."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Plain living room before Luxe Axis transformation',
            }}
            afterImage={{
              src: '/posters/portfolio.avif',
              alt: 'Luxury living room with feature wall after Luxe Axis transformation',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Living Room Makeover — T. Nagar, Chennai
          </p>
        </div>
      </Section>

      {/* 8. Fixed-Price Packages */}
      <Section
        id="pricing"
        eyebrow="Living Room Packages"
        title="Fixed Price. No Surprises."
        lede="Every package includes 3D VR design, false ceiling, feature wall, TV entertainment unit, and flat 10-year warranty."
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
                <span className="text-overline text-accent uppercase font-bold tracking-wider">{tier.tag}</span>
                <h3 className="font-display text-h3 font-bold text-on-surface mt-1">{tier.name}</h3>
                <div className="my-4 flex items-baseline gap-1">
                  <span className="font-display text-[36px] font-bold text-accent">{tier.price}</span>
                  <span className="text-small text-on-surface-muted">{tier.unit}</span>
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
              <Button as="a" href={tier.href} variant={tier.featured ? 'primary' : 'secondary'} className="w-full justify-center">
                {tier.cta} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 9. 5-Step Process */}
      <ProcessSteps />

      {/* 10. Client Stories */}
      <Section
        id="testimonials"
        eyebrow="Client Stories"
        title="What Living Room Clients Say About Luxe Axis"
        lede="Verified client reviews from living room transformations across Chennai."
      >
        <Grid cols={3} gap={6}>
          {testimonials.map((t) => (
            <div key={t.name} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="flex text-accent text-small mb-3">
                  {'★'.repeat(t.stars)}
                </div>
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

      {/* 11. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Living Room Design FAQ"
        lede="Everything you need to know about designing your living room in Chennai."
      >
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

      {/* 12. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
