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

const ROUTE = '/residential/renovation';

export const metadata: Metadata = {
  title: 'Home Renovation in Chennai | Luxe Axis Interiors',
  description:
    'Complete home renovation in Chennai. Old home to new in 45 days. Fixed price, live-in structural & interior renovation, flat 10-year warranty. Free site visit.',
  alternates: canonicalFor(ROUTE),
};

export default function RenovationPage() {
  const highlights = [
    { title: 'Old to New Transformation', desc: 'Structural Civil & Interior Renovation Managed Under One Contract' },
    { title: 'Fixed Transparent Price', desc: 'Zero Cost Escalation or Hidden Supplementary Charges After Signing' },
    { title: 'Live-In Renovation', desc: 'Dust-Barrier Isolation & Sequencing — No Need to Move Out' },
    { title: '45-Day Delivery Guarantee', desc: 'Contractually Backed Timeline with Delay Compensation Clause' },
    { title: 'Flat 10-Year Warranty', desc: 'Comprehensive Coverage Across All Renovation Works & Materials' },
  ];

  const transformations = [
    {
      tag: 'Kitchen Renovation',
      title: 'Old Slab Kitchen to Modular',
      desc: 'Existing brick slab counter removed, full modular kitchen installed with soft-close drawers, Hettich hardware, and granite top in 14 days.',
      beforeImg: '/images/hero/hero-slide-4.jpg',
      afterImg: '/images/hero/hero-slide-3.jpg',
    },
    {
      tag: 'Bedroom Renovation',
      title: 'Outdated Bedroom to Master Suite',
      desc: 'New wall panelling, integrated floor-to-ceiling wardrobe, false ceiling with cove lighting, and premium laminate flooring completed without family vacating.',
      beforeImg: '/images/hero/hero-slide-3.jpg',
      afterImg: '/images/hero/hero-slide-2.jpg',
    },
    {
      tag: 'Living Room Renovation',
      title: 'Dated Living Space to Open Plan',
      desc: 'Sintered stone feature wall added, TV console redesigned, new Gyproc false ceiling, ambient cove lighting throughout. Transformed in 18 days.',
      beforeImg: '/images/hero/hero-slide-2.jpg',
      afterImg: '/images/hero/hero-slide-1.jpg',
    },
  ];

  const timelinePhases = [
    { num: '01', title: 'Assessment', desc: 'Site inspection, structural audit & 3D design creation. Damp, wiring, and plumbing issues identified before work begins.' },
    { num: '02', title: 'Protection', desc: 'Furniture shifted and covered. Heavy dust barriers erected between work zones and living zones. Floor protection laid.' },
    { num: '03', title: 'Demolition', desc: 'Controlled demolition of existing fixtures, flooring, and woodwork. Debris cleared daily with minimal noise during rest hours.' },
    { num: '04', title: 'Installation', desc: 'New flooring, false ceiling, modular kitchen, wardrobes, and all woodwork installed room by room in a planned sequence.' },
    { num: '05', title: 'Finishing', desc: 'Painting, ambient lighting coves, hardware, and all finishing touches completed. Thorough site cleanup carried out before inspection.' },
    { num: '06', title: 'Handover', desc: 'Full walkthrough with client. Punch-list items resolved. Warranty documentation issued and after-care coordinator assigned.' },
  ];

  const galleryProjects = [
    {
      title: '3BHK Complete Home Renovation Makeover',
      tag: 'Full Home Renovation',
      location: 'Adyar, Chennai',
      image: '/images/hero/hero-slide-1.jpg',
    },
    {
      title: 'Old Slab Kitchen to Modern Modular',
      tag: 'Kitchen Renovation',
      location: 'T. Nagar, Chennai',
      image: '/images/hero/hero-slide-3.jpg',
    },
    {
      title: 'Master Bedroom False Ceiling & Joinery Upgrade',
      tag: 'Bedroom Renovation',
      location: 'Velachery, Chennai',
      image: '/images/hero/hero-slide-2.jpg',
    },
    {
      title: 'Living Room Feature Wall & Open Plan',
      tag: 'Living Room Renovation',
      location: 'Anna Nagar, Chennai',
      image: '/images/hero/hero-slide-4.jpg',
    },
  ];

  const whyChooseUs = [
    {
      num: '01',
      title: 'Pre-Renovation Structural Assessment Included',
      desc: 'Before touching a wall, we carry out a full structural audit to identify damp, legacy wiring issues, and load-bearing constraints so surprises do not appear mid-work.',
    },
    {
      num: '02',
      title: 'Fixed Price. Zero Cost Escalation.',
      desc: 'Your renovation cost is itemised, quoted, and locked before work begins. We absorb material price changes and unforeseen minor work within the fixed scope.',
    },
    {
      num: '03',
      title: 'Live-In Renovation Without Disruption',
      desc: 'We use dust barriers, work-zone sequencing, and daily cleanup protocols so families can continue living in the home throughout the renovation without renting temporary flats.',
    },
    {
      num: '04',
      title: '45-Day Delivery Guarantee',
      desc: 'Our 45-day delivery commitment is backed by a contractually binding compensation clause. If we are late, you are compensated in writing.',
    },
    {
      num: '05',
      title: 'Flat 10-Year Warranty on All Renovation Work',
      desc: 'Every element of your renovation, from new flooring to the modular kitchen to false ceilings, is covered under our flat 10-year warranty with dedicated after-care on call.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Cosmetic Refresh',
      tag: 'Starter',
      price: 'Rs. 2L',
      unit: '/ home',
      desc: 'Fresh paint, new flooring, upgraded fixtures, and lighting refresh throughout a 2BHK.',
      features: [
        'Full interior Asian Paints Royale painting',
        'New laminate or large-format tile flooring',
        'Fixture, switch plate, and fitting upgrades',
        'Ambient LED lighting replacement',
        'Flat 10-year warranty & post-install care',
      ],
      cta: 'Get Refresh Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Structural + Interior',
      tag: 'Most Popular',
      price: 'Rs. 6L',
      unit: '/ 2BHK',
      desc: 'Full interior renovation with new modular kitchen, wardrobes, false ceiling, flooring, and painting.',
      features: [
        'Modular kitchen installation with BWP marine ply',
        'Custom wardrobes in all bedrooms',
        'Full Gyproc false ceiling throughout',
        'Premium vitrified flooring overhaul',
        'Full interior painting and accent styling',
        'Flat 10-year warranty & 45-day move-in guarantee',
      ],
      cta: 'Get 2BHK Renovation Quote',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Full Home Transformation',
      tag: 'Premium 3BHK',
      price: 'Rs. 12L',
      unit: '/ 3BHK+',
      desc: 'Every room, every surface. Structural civil modifications, electrical/plumbing updates plus full luxury interiors.',
      features: [
        'Structural assessment & wall reconfigurations',
        'Complete electrical rewiring & plumbing updates',
        'Premium kitchen with quartz top & walk-in pantry',
        'Perimeter magnetic lighting & false ceilings',
        'Italian marble or premium vitrified tile flooring',
        'Flat 10-year warranty & contractually locked timeline',
      ],
      cta: 'Explore Full Transformation',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = [
    {
      name: 'Senthil Kumar',
      location: 'Adyar, Chennai',
      quote:
        'Excellent and professional execution. The Luxe Axis architects explained the pros and cons of structural modifications clearly, making every decision easy. Strongly recommend!',
      stars: 5,
    },
    {
      name: 'Muthuraman Sethuramalingam',
      location: 'Adyar, Chennai',
      quote:
        'The Luxe Axis team showed exceptional flexibility when our move-in timelines were tight. They stepped in with additional manpower and delivered our 3BHK makeover on time.',
      stars: 5,
    },
    {
      name: 'Arun Kumar',
      location: 'T. Nagar, Chennai',
      quote:
        'Guided us perfectly through the renovation process. From demolition to final polishing, always responsive and helpful. Zero cost escalation after signing!',
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: 'How much does a home renovation cost in Chennai in 2025?',
      a: 'Cosmetic renovation for a 2BHK starts from Rs. 2,00,000. Full structural and interior renovation ranges from Rs. 6,00,000 to Rs. 12,00,000 for a 2BHK. All quotes are fixed once signed with itemised pricing and zero cost escalation.',
    },
    {
      q: 'How long does a full home renovation take?',
      a: 'Cosmetic renovation takes 15 to 20 days. Full home renovation including structural civil work, flooring, modular kitchen, and interiors takes 35 to 45 days for a 2BHK under our 45-day delivery guarantee.',
    },
    {
      q: 'Can we live in the home during renovation?',
      a: 'Yes. We use heavy dust-barrier isolation, room-by-room work sequencing, and daily cleanup so families can continue living in the home during renovation without renting alternate flats.',
    },
    {
      q: 'Does the flat 10-year warranty cover renovation work?',
      a: 'Yes. Our flat 10-year warranty covers every element of the renovation including new flooring, false ceiling, modular kitchen, wardrobes, painting, and finishes with no fine print.',
    },
    {
      q: 'Can I see the renovated home in 3D before work starts?',
      a: 'Yes. Every renovation project includes a full 3D VR walkthrough before any work begins. You adjust layouts, materials, and colors freely, and execution starts only after your explicit approval.',
    },
    {
      q: 'What does Luxe Axis include in a home renovation?',
      a: 'We handle everything from pre-work structural assessment, damp-proofing, electrical rewiring, plumbing updates, new flooring, modular kitchens, wardrobes, false ceilings, painting, and lighting.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Home Renovation in Chennai',
          description:
            'Complete home renovation in Chennai. Structural & interior remodeling, 45-day move-in guarantee, and flat 10-year warranty.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-small text-on-surface-3">
              <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
              <span>/</span>
              <li><a href="/residential" className="hover:text-accent transition-colors">Residential</a></li>
              <span>/</span>
              <li aria-current="page" className="text-accent font-semibold">Home Renovation</li>
            </ol>
          </nav>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Old Home to New. Without the Wait.
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Home Renovation <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Transform your existing home without moving out. Fixed price, zero disruption, 45-day delivery guarantee, and a flat 10-year warranty on every element of the renovation.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free Site Visit
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                View Renovations →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10,000+</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Homes Renewed</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">45 Days</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Max Timeline</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">10 Yr</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Flat Warranty</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">4.9 ★</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Google Rating</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">3</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Chennai Studios</span>
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

      {/* 3. Real Transformations Cards */}
      <Section
        id="transformations"
        eyebrow="Real Transformations"
        title="What We Renovate"
        lede="We handle every room in your home. From kitchens needing a complete structural overhaul to living rooms deserving an open-plan identity."
      >
        <Grid cols={3} gap={6}>
          {transformations.map((item) => (
            <div
              key={item.title}
              className="lx-liquid-glass rounded-2xl p-5 border border-accent/30 shadow-xl flex flex-col justify-between group hover:border-accent/60 transition-all"
            >
              <div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="relative rounded-lg overflow-hidden aspect-square border border-border-subtle/60">
                    <Image src={item.beforeImg} alt="Before renovation" fill sizes="200px" className="object-cover" />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-surface-deep/90 text-on-surface text-[9px] font-bold uppercase">Before</span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden aspect-square border border-accent/40">
                    <Image src={item.afterImg} alt="After renovation" fill sizes="200px" className="object-cover" />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-accent text-surface-deep text-[9px] font-bold uppercase">After</span>
                  </div>
                </div>
                <span className="text-overline text-accent uppercase font-bold tracking-wider">{item.tag}</span>
                <h3 className="font-display text-h4 font-bold text-on-surface my-1.5">{item.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. 6-Phase Renovation Timeline */}
      <Section
        id="timeline"
        eyebrow="Our Process"
        title="How We Renovate Without Disrupting Your Life"
        lede="Six clearly defined phases. Your home is protected at every step, and you are updated daily by a dedicated site coordinator."
      >
        <Grid cols={3} gap={6}>
          {timelinePhases.map((phase) => (
            <div key={phase.num} className="lx-liquid-glass rounded-2xl p-5 border border-accent/30 relative">
              <span className="font-display text-[32px] font-bold text-accent block mb-2">{phase.num}</span>
              <h3 className="font-display text-h4 font-bold text-on-surface mb-2">{phase.title}</h3>
              <p className="text-small text-on-surface-2 leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Renovation Projects Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="Renovation Projects"
        title="10,000+ Homes Renewed Across Chennai"
        lede="From single-room refreshes to complete structural home transformations."
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

      {/* 6. Why Choose Us for Renovation */}
      <Section
        id="why-us"
        eyebrow="Why Luxe Axis"
        title="Why Homeowners Choose Luxe Axis for Renovation"
        lede="Renovation is different from new build. It requires managing the unknown, protecting existing structures, and delivering new interiors without disrupting family life."
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
        title="Before & After: The Renovation Story"
        lede="A dated 15-year-old Chennai home stripped down, structurally renewed, and rebuilt in 45 days."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/images/hero/hero-slide-4.jpg',
              alt: 'Dated 15-year-old Chennai home before renovation',
            }}
            afterImage={{
              src: '/images/hero/hero-slide-1.jpg',
              alt: 'Completely renovated modern luxury home by Luxe Axis',
            }}
          />
          <p className="text-center text-small text-on-surface-3 mt-3">
            Complete Renovation — Mylapore, Chennai
          </p>
        </div>
      </Section>

      {/* 8. Transparent Pricing Packages */}
      <Section
        id="pricing"
        eyebrow="Renovation Packages"
        title="Fixed Price. No Surprises."
        lede="Every package includes pre-work structural assessment, 3D VR design, locked itemized quote, 45-day delivery, and flat 10-year warranty."
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
                  <span className="text-small text-on-surface-3">{tier.unit}</span>
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
        title="What Chennai Families Say About Our Renovations"
        lede="Verified client reviews from renovated homes across Chennai."
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
        title="Home Renovation FAQ"
        lede="Everything you need to know about renovating your home in Chennai."
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
