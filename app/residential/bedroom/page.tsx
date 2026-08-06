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

const ROUTE = '/residential/bedroom';

export const metadata: Metadata = {
  title: 'Bedroom Interior Designers in Chennai | Luxe Axis',
  description:
    'Premium bedroom interior design in Chennai. Master suites, walk-in wardrobes, Gyproc false ceilings, ambient lighting. 45-day delivery, flat 10-year warranty.',
  alternates: canonicalFor(ROUTE),
};

export default function BedroomPage() {
  const highlights = [
    { title: '500+ Bedrooms', desc: 'Master Suites, Kids Rooms & Guest Sanctuaries Delivered' },
    { title: 'Modular Wardrobes', desc: 'Factory-Cut BWR Marine Ply Carcass, Humidity & Termite Resistant' },
    { title: 'Circadian Layered Lighting', desc: 'Ambient Coves, Bedside Task Pendants & Internal Profile Lights' },
    { title: 'Flat 10-Year Warranty', desc: 'Comprehensive Coverage Across Every Material, Hinge & Finish' },
    { title: '45-Day Move-In Guarantee', desc: 'Contractually Locked Timeline with Written Delay Compensation' },
  ];

  const designStyles = [
    {
      tag: 'Contemporary',
      title: 'Clean Lines, Warm Palette',
      desc: 'A contemporary bedroom balances sleek geometry with tactile warmth. Neutral tones, integrated wardrobe storage, and deliberate material contrast define the look.',
      specs: [
        'Laminate or acrylic wardrobe shutters',
        'Fabric or leatherette headboard paneling',
        'Recessed LED cove false ceiling',
        'Concealed floating bedside storage units',
        'Flat 10-year warranty included',
      ],
      image: '/images/hero/hero-slide-3.jpg',
    },
    {
      tag: 'Minimalist',
      title: 'Nothing Unnecessary',
      desc: 'Every element earns its place. Flush-door wardrobes, a low-profile platform bed, and recessed indirect lighting make the room feel larger and calmer.',
      specs: [
        'Flush-door, handle-free wardrobe systems',
        'Low-profile platform bed frame',
        'Recessed ceiling with indirect glow',
        'Muted, serene monochromatic palette',
        'Flat 10-year warranty included',
      ],
      image: '/images/hero/hero-slide-2.jpg',
    },
    {
      tag: 'Traditional',
      title: 'Timeless Craft, Chennai Roots',
      desc: 'Rooted in South Indian craft, traditional bedrooms combine rich teak wood tones, intricate carving detail, and heavy fabric drapes built to age beautifully.',
      specs: [
        'Solid teak or rosewood furniture joinery',
        'Carved door shutters and headboard panel',
        'Heavy drape upholstery & fabric accents',
        'Warm-toned ambient lighting channels',
        'Flat 10-year warranty included',
      ],
      image: '/images/hero/hero-slide-4.jpg',
    },
    {
      tag: 'Luxe Suite',
      title: 'Statement Bed, Bespoke Dressing',
      desc: 'A luxury master suite built around a commanding statement. Backlit wall panels, a walk-in dressing island, and marble/veneer finishes set it apart.',
      specs: [
        'Upholstered or fluted headboard accent wall',
        'Walk-in wardrobe suite with dressing island',
        'Backlit niche display & chandelier point',
        'Italian marble or veneer accent surfaces',
        'Flat 10-year warranty included',
      ],
      image: '/images/hero/hero-slide-1.jpg',
    },
  ];

  const essentials = [
    {
      num: '01',
      title: 'Wardrobe Suite Design',
      desc: 'Not just storage, but architectural joinery. Every wardrobe is planned for your clothing volume, access patterns, and humidity resistance.',
      specs: [
        'Sliding, hinged, or walk-in configurations',
        'BWR marine ply carcass with 40+ finishes',
        'Internal drawers, tie pull-outs, shoe racks',
        'Sensor-activated internal LED profile bars',
      ],
      link: '/residential/wardrobe',
    },
    {
      num: '02',
      title: 'False Ceiling Architecture',
      desc: 'The ceiling defines zones, conceals conduit, and anchors the room’s ambient lighting plan from above.',
      specs: [
        'Gyproc gypsum, POP, or timber batten ceiling',
        'Cove lighting channels for indirect glow',
        'Concealed split or ductable AC integration',
        'Moisture-resistant materials engineered for Chennai',
      ],
      link: '/residential/false-ceiling',
    },
    {
      num: '03',
      title: 'Circadian Ambient Lighting',
      desc: 'A single overhead fixture is not a lighting plan. We design ambient, task, and accent zones for different times of day.',
      specs: [
        'Cove LED channels for soft ambient fill',
        'Bedside reading pendants or wall sconces',
        'Wardrobe glass & drawer interior lights',
        'Smart dimmable switch zoning',
      ],
      link: '/residential/home-interiors',
    },
  ];

  const galleryProjects = [
    {
      title: 'Contemporary Master Suite with Walk-In Wardrobe',
      tag: 'Master Bedroom',
      location: 'Adyar, Chennai',
      image: '/images/hero/hero-slide-1.jpg',
    },
    {
      title: 'Serene Minimalist Platform Bedroom',
      tag: 'Minimalist',
      location: 'T. Nagar, Chennai',
      image: '/images/hero/hero-slide-2.jpg',
    },
    {
      title: 'Kids Bedroom with Loft & Study Zone',
      tag: 'Kids Bedroom',
      location: 'OMR, Chennai',
      image: '/images/hero/hero-slide-3.jpg',
    },
    {
      title: 'Warm Caramel Neutral Guest Retreat',
      tag: 'Guest Bedroom',
      location: 'Anna Nagar, Chennai',
      image: '/images/hero/hero-slide-4.jpg',
    },
  ];

  const whyChooseUs = [
    {
      num: '01',
      title: 'Sanctuary-First Design',
      desc: 'Bedroom design starts with how you rest and live in the space. Lighting zones, wardrobe placement, and acoustic dampening all work together toward one goal: deep restorative rest.',
    },
    {
      num: '02',
      title: 'Wardrobe as Architecture',
      desc: 'Wardrobes are never planned after the room is finished. Luxe Axis integrates storage, dressing mirrors, and sliding units into the room’s geometry from day one.',
    },
    {
      num: '03',
      title: 'Ceiling & Lighting as a System',
      desc: 'Every bedroom gets a layered lighting plan. Ambient cove, bedside task light, and accent zones are designed alongside the ceiling structure, not added after.',
    },
    {
      num: '04',
      title: 'Flat 10-Year Warranty',
      desc: 'Covers every wardrobe carcass, hinge, drawer slider, finish, and fixture in your bedroom. No exclusions, no deductibles, documented in writing.',
    },
    {
      num: '05',
      title: '45-Day Move-In Guarantee',
      desc: 'Your bedroom is ready in 45 days. The handover date is contractually locked. If we miss it, written compensation kicks in automatically.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Guest Bedroom',
      tag: 'Starter',
      price: 'Rs. 60K',
      unit: '/ room',
      desc: 'A well-designed guest bedroom that impresses visitors without extravagance.',
      features: [
        '2-door wardrobe with mirror & locks',
        'Gyproc false ceiling with LED cove lighting',
        'Upholstered or wooden headboard panel',
        'Matching floating bedside units',
        'Flat 10-year warranty & post-install care',
      ],
      cta: 'Get Guest Room Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Master Bedroom',
      tag: 'Most Popular',
      price: 'Rs. 1.2L',
      unit: '/ room',
      desc: 'A complete master bedroom with wardrobe, false ceiling, lighting, and dressing area.',
      features: [
        '3-door hinged or 2-panel sliding wardrobe',
        'Cove ceiling with multi-zone dimmable lighting',
        'Accent headboard wall & TV paneling',
        'Dressing table unit with vanity LED mirror',
        '3D VR design preview prior to execution',
        'Flat 10-year warranty & 45-day move-in guarantee',
      ],
      cta: 'Book Master Bedroom Audit',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Master Suite',
      tag: 'Luxury Grand',
      price: 'Rs. 2.5L',
      unit: '/ room',
      desc: 'A luxury master suite with walk-in wardrobe, statement ceiling, and bespoke finishes.',
      features: [
        'Walk-in wardrobe suite with dressing island',
        'Feature false ceiling with chandelier anchor',
        'Full-height upholstered or fluted headboard wall',
        'Sintered stone or veneer accent surfaces',
        'Full 3D VR spatial simulation',
        'Flat 10-year warranty & contractually locked timeline',
      ],
      cta: 'Explore Master Suite Design',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = [
    {
      name: 'Arun Kumar',
      location: 'T. Nagar, Chennai',
      quote:
        'Guided us perfectly at the showroom. From wardrobe billing to final delivery, always responsive and helpful. Exceptional joinery quality and prompt delivery!',
      stars: 5,
    },
    {
      name: 'Manoj Kumar',
      location: 'T. Nagar, Chennai',
      quote:
        'Great experience and prompt delivery from Luxe Axis. The design team helped with every bedroom customization with utmost patience. Highly recommended!',
      stars: 5,
    },
    {
      name: 'Sashwath Kumar',
      location: 'T. Nagar, Chennai',
      quote:
        'Very good product finish and neat installation. The craftsmen were sincere and thorough in completing every part of our master bedroom. Excellent service!',
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: 'What does bedroom interior design cost in Chennai in 2025?',
      a: 'Bedroom interior design in Chennai starts from Rs. 60,000 for a guest bedroom, Rs. 1,20,000 for a master bedroom, and Rs. 2,50,000 for a luxury master suite with a walk-in wardrobe. All quotes are fixed once signed with zero cost escalation.',
    },
    {
      q: 'How long does a bedroom interior project take with Luxe Axis?',
      a: 'Luxe Axis guarantees move-in within 45 days of project start. This is a contractual commitment backed by automatic delay compensation clauses.',
    },
    {
      q: 'Does Luxe Axis’s flat 10-year warranty cover bedroom wardrobes?',
      a: 'Yes. Our flat 10-year warranty covers every element of your bedroom, including wardrobes, false ceilings, lighting fixtures, hardware, and finishes with no fine print.',
    },
    {
      q: 'Which wardrobe material works best for Chennai’s humid climate?',
      a: 'For Chennai’s humid coastal climate, BWR (Boiling Water Resistant) marine ply carcasses with acrylic or high-pressure laminate shutters perform best. Solid wood carcasses absorb moisture and warp over time.',
    },
    {
      q: 'Can I see my bedroom design in 3D before work begins?',
      a: 'Yes. Every project includes a full 3D VR design walkthrough before execution starts. You approve every detail, from wardrobe layout to ceiling light zones, before work begins.',
    },
    {
      q: 'Does Luxe Axis design kids bedrooms as well?',
      a: 'Yes. We design master bedrooms, kids bedrooms, and guest bedrooms. Kids bedroom projects feature space-saving bunk/loft beds, integrated study units, and child-safe hardware.',
    },
    {
      q: 'Which areas in Chennai does Luxe Axis serve for bedroom interiors?',
      a: 'We serve all major Chennai neighborhoods including Adyar, T. Nagar, Tambaram, OMR, Anna Nagar, Velachery, Porur, Nungambakkam, and 17+ other locations.',
    },
    {
      q: 'What is the difference between modular and carpenter-built wardrobes?',
      a: 'Factory-made modular wardrobes use precision machine edge-banding and pre-treated BWR marine ply, ensuring zero warpage and 10x faster installation compared to dusty, noisy carpenter work on-site.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Bedroom Interior Designers in Chennai',
          description:
            'Premium bedroom interior design in Chennai. Master suites, walk-in wardrobes, Gyproc false ceilings, and ambient lighting with 45-day delivery guarantee.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/residential/bedroom" labels={{ 'bedroom': "Bedroom Interiors" }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Designed for Rest. Designed for You.
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Bedroom Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              The bedroom is your sanctuary. Luxe Axis designs it with wardrobe integration, Gyproc false ceilings, and layered circadian lighting, all delivered in 45 days with a flat 10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free Consultation
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                View Bedroom Projects →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">500+</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Bedrooms</span>
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
                <strong className="block font-display text-h3 text-accent font-bold">3</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Bedroom Types</span>
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

      {/* 3. 4 Design Style Directions */}
      <Section
        id="bedroom-styles"
        eyebrow="Bedroom Styles"
        title="Your Style, Your Bedroom"
        lede="Four design directions, each executed with precision. Every style includes full wardrobe integration, false ceiling, and ambient lighting."
      >
        <Grid cols={2} gap={6}>
          {designStyles.map((style) => (
            <div key={style.tag} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image src={style.image} alt={style.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {style.tag}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">{style.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">{style.desc}</p>
                <ul className="space-y-1.5 text-small text-on-surface-2 mb-4 border-t border-border-subtle/40 pt-3">
                  {style.specs.map((spec) => (
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

      {/* 4. 3 Bedroom Essentials */}
      <Section
        id="essentials"
        eyebrow="Bedroom Essentials"
        title="What Makes a Bedroom Complete"
        lede="Three elements that transform a room into a private retreat. Luxe Axis plans all three together, never as separate afterthoughts."
      >
        <Grid cols={3} gap={6}>
          {essentials.map((item) => (
            <div key={item.num} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <div>
                <span className="font-display text-[32px] font-bold text-accent block mb-2">{item.num}</span>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-2">{item.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">{item.desc}</p>
                <ul className="space-y-1.5 text-small text-on-surface-2 border-t border-border-subtle/40 pt-3 mb-6">
                  {item.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2">
                      <span className="text-accent">✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button as="a" href={item.link} variant="secondary" className="w-full justify-center">
                Explore {item.title} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Bedroom Projects Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="Bedroom Projects"
        title="500+ Bedrooms. Every One Guaranteed."
        lede="A selection from Luxe Axis’s bedroom portfolio delivered across Chennai."
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

      {/* 6. Five Reasons to Trust Your Bedroom to Us */}
      <Section
        id="why-us"
        eyebrow="Why Luxe Axis"
        title="Five Reasons to Trust Your Bedroom to Us"
        lede="From 3D VR design to delivery to decade-long after-care, Luxe Axis takes complete ownership of your bedroom project."
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
        title="Before & After: Master Bedroom Transformation"
        lede="Dated bare bedroom transformed into a modern luxury suite with sliding wardrobes and cove ceiling lighting in 45 days."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/images/hero/hero-slide-3.jpg',
              alt: 'Plain master bedroom before Luxe Axis transformation',
            }}
            afterImage={{
              src: '/images/hero/hero-slide-1.jpg',
              alt: 'Luxury master suite with wardrobe after Luxe Axis transformation',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Master Bedroom Makeover — Adyar, Chennai
          </p>
        </div>
      </Section>

      {/* 8. Fixed-Price Packages */}
      <Section
        id="pricing"
        eyebrow="Bedroom Packages"
        title="Fixed Price. No Surprises."
        lede="Every package includes 3D VR design, wardrobe integration, false ceiling, lighting, and flat 10-year warranty."
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
        title="What Bedroom Clients Say About Luxe Axis"
        lede="Verified client reviews from bedroom transformations across Chennai."
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
        title="Bedroom Design FAQ"
        lede="Everything you need to know about designing your bedroom in Chennai."
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
