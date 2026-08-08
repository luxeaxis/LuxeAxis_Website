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

const ROUTE = '/commercial';

export const metadata: Metadata = {
  title: 'Office Interior Designers in Chennai | Luxe Axis Commercial',
  description:
    'Office interior designers in Chennai. IT parks, corporate HQs, startups, and professional clinics. Written delivery commitment, flat 10-year warranty, fixed price per sqft.',
  alternates: canonicalFor(ROUTE),
};

export default async function CommercialPage() {
  const highlights = [
    { title: 'Brand-Driven', desc: 'Workplace Strategy & Culture Alignment' },
    {
      title: 'IT-Ready Infrastructure',
      desc: 'Structured Cabling & Server Room Coordination',
    },
    {
      title: 'Written Delivery Commitment',
      desc: 'Contractually locked move-in milestones',
    },
    {
      title: 'Flat 10-Year Warranty',
      desc: 'Zero Fine Print Commercial Warranty',
    },
    {
      title: 'Fixed Price Per SqFt',
      desc: 'Zero Scope Creep or Mid-Project Escalations',
    },
  ];

  const brandFeatures = [
    'Workplace strategy session before any design work begins',
    'Brand identity woven into materials, colors, and spatial layout',
    'Electrical, data, and IT infrastructure coordinated from day one',
    'HVAC, fire compliance, and accessibility planned in advance',
    'Post-handover service team on call for every warranty issue',
  ];

  const officeZones = [
    {
      name: 'Reception Lobby',
      desc: 'First impressions lobby with branded backdrop & marble counter',
    },
    {
      name: 'Open Plan Workspace',
      desc: 'Ergonomic workstation pods with acoustic sound masking',
    },
    {
      name: 'Executive Cabins',
      desc: 'Glass-partitioned cabins with acoustic privacy and custom joinery',
    },
    {
      name: 'Boardrooms & Conference',
      desc: 'Smart AV integration, dimmable scenes & acoustic wall panels',
    },
    {
      name: 'Breakout & Pantry',
      desc: 'Collaborative lounge, pantry counter & high-top seating',
    },
  ];

  const officeTypes = [
    {
      sector: 'IT / Technology',
      title: 'Offices That Attract Talent',
      desc: 'Activity-based workstations, collaborative hubs, quiet zones, and tech-forward aesthetics built for OMR & Sholinganallur IT corridors.',
      specs: [
        'Open plan with acoustic zoning',
        'Structured cabling from day one',
        'Standing desks & ergonomic layouts',
      ],
      image: '/posters/pricing-axis.avif',
    },
    {
      sector: 'Corporate / MNC',
      title: 'Spaces That Command Authority',
      desc: 'Executive floors, boardrooms, reception lobbies, and client-facing zones designed to reflect the scale and ambition of your organization.',
      specs: [
        'Boardroom AV and lighting integration',
        'Executive cabin with acoustic privacy',
        'Brand identity in every surface',
      ],
      image: '/posters/hero.avif',
    },
    {
      sector: 'SME / Startup',
      title: 'Big Ideas. Efficient Spaces.',
      desc: 'Fast-growing companies need offices that scale with them. Budget-conscious fit-outs that look premium, on an agreed timeline.',
      specs: [
        'Flexible modular workstation systems',
        'Meeting pod and phone booth zones',
        'Fixed price from Rs.900 per sqft',
      ],
      image: '/posters/persona-router.avif',
    },
    {
      sector: 'Professionals & Clinics',
      title: 'Trust Built Into the Design',
      desc: 'Clinics, law firms, CA offices, and consultancies need interiors that inspire immediate confidence. Calm, precise, and professional.',
      specs: [
        'Waiting area with premium seating',
        'Acoustic private consultation rooms',
        'Compliance-aware healthcare design',
      ],
      image: '/posters/portfolio.avif',
    },
  ];

  const galleryProjects = [
    {
      title: 'Open Collaborative IT Campus',
      tag: 'IT Office',
      location: 'Sholinganallur, Chennai',
      image: '/posters/pricing-axis.avif',
    },
    {
      title: 'Executive Conference Suite & Boardroom',
      tag: 'Boardroom',
      location: 'Nungambakkam, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'First Impressions Reception Lobby',
      tag: 'Reception Lobby',
      location: 'Guindy, Chennai',
      image: '/posters/persona-router.avif',
    },
    {
      title: 'Growth-Ready Startup HQ',
      tag: 'SME Office',
      location: 'OMR, Chennai',
      image: '/posters/portfolio.avif',
    },
  ];

  const whyChooseCommercial = [
    {
      num: '01',
      title: 'Workplace Strategy Before Design',
      desc: 'We study how your team actually works, movement patterns, collaboration frequency, and heads-down focus before drawing a single line.',
    },
    {
      num: '02',
      title: 'Brand Identity Embedded in Space',
      desc: 'Your brand colors, values, and culture are expressed as structural decisions across materials, lighting tone, and spatial hierarchy.',
    },
    {
      num: '03',
      title: 'IT and Data Infrastructure First',
      desc: 'Cabling, data points, server room placement, and AV integration are planned in week one, not after the ceiling goes up.',
    },
    {
      num: '04',
      title: 'Contractual Delivery Commitment',
      desc: 'Your business cannot wait. Handover milestones are written into your project contract, with delay compensation when we miss dates we control.',
    },
    {
      num: '05',
      title: 'Post-Handover Service Built In',
      desc: 'Every office project includes dedicated post-installation support covered under our flat 10-year warranty at no extra charge.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Essential Fit-Out',
      tag: 'Essential',
      price: 'Rs. 900',
      unit: '/ sqft',
      desc: 'Functional, clean, professional. Ideal for SME offices, clinics, and growing startups.',
      features: [
        'Workstation layout and partition framing',
        'Suspended gypsum ceiling with LED lighting',
        'Reception counter and waiting area',
        'One dedicated glass meeting room',
        'Flat 10-year warranty & post-install service',
      ],
      cta: 'Get Essential Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Premium Corporate',
      tag: 'Most Popular',
      price: 'Rs. 1,500',
      unit: '/ sqft',
      desc: 'Fully branded corporate interior with executive zones, glass cabins, and premium finishes.',
      features: [
        'Branded reception lobby with stone counter',
        'Open plan workspace with acoustic zoning',
        'Executive cabins with glass partitions',
        'Two conference rooms with AV integration',
        'Breakout lounge and pantry zone',
        'Flat 10-year warranty & written delivery commitment',
      ],
      cta: 'Get Premium Quote',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Signature Executive',
      tag: 'Signature',
      price: 'Rs. 2,500',
      unit: '/ sqft',
      desc: 'Flagship headquarters with bespoke finishes, imported materials, and architectural statement elements.',
      features: [
        'Architectural lobby with custom metal joinery',
        'Full-floor brand experience design',
        'Boardroom with premium AV & acoustic walls',
        'C-suite executive lounge & private suite',
        'Imported stone, veneer, and smart glass',
        'Flat 10-year warranty & dedicated account director',
      ],
      cta: 'Explore Signature Fit-Out',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is the cost of office interior design in Chennai in 2025?',
      a: 'Office interior design costs in Chennai range from Rs. 900 per sqft for a functional fit-out to Rs. 2,500 per sqft for a fully branded corporate interior. All quotes are fixed price with zero cost escalation.',
    },
    {
      q: 'How long does a complete office interior fit-out take?',
      a: 'Timelines depend on scope, approvals, and site readiness. Luxe Axis agrees milestone dates in your contract before work begins, with written delay compensation when we miss dates we control.',
    },
    {
      q: 'Does Luxe Axis’s flat 10-year warranty cover commercial office interiors?',
      a: 'Yes. Our flat 10-year warranty covers every element of your office fit-out: workstation systems, suspended ceilings, glass partitions, reception counters, and flooring.',
    },
    {
      q: 'What types of offices does Luxe Axis design in Chennai?',
      a: 'We design all categories of commercial interiors: IT parks on OMR, corporate HQs in Guindy & Nungambakkam, SME/startup offices, and professional spaces for clinics & law firms.',
    },
    {
      q: 'Can I see my office in 3D before execution begins?',
      a: 'Yes. Every commercial project includes a complete 3D walkthrough covering reception, workstations, conference rooms, cabins, and breakout zones.',
    },
    {
      q: 'How does Luxe Axis handle electrical and IT cabling?',
      a: 'Electrical load planning, data point placement, structured cabling, and HVAC integration are planned in week one before ceiling installation to avoid rework.',
    },
    {
      q: 'Which areas in Chennai does Luxe Axis serve for office interiors?',
      a: 'We serve all major commercial hubs across Chennai: OMR, Sholinganallur, Perungudi, Guindy, Nungambakkam, Anna Nagar, Adyar, T. Nagar, and Tambaram.',
    },
    {
      q: 'What is the minimum office size Luxe Axis takes up?',
      a: 'We accept commercial office projects from 500 sqft onwards, covering boutique offices, clinics, and startups up to large corporate campuses.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Office Interior Designers in Chennai',
          description:
            'Office interior designers in Chennai. IT parks, corporate HQs, startups, and professional clinics. Written delivery commitment, flat 10-year warranty.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs
            path="/commercial"
            labels={{ commercial: 'Office Interiors' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Chennai&apos;s Commercial Interior Specialists
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Office Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Your office is the first thing clients read. IT firms, corporate
              HQs, clinics, and startups. Design every sq ft to reflect who you
              are. Agreed delivery milestones, flat 10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free Office Consultation
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                View Office Projects →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="p-4 rounded-xl lx-liquid-glass-card border border-accent/20"
                >
                  <strong className="block font-display text-h3 text-accent font-bold">
                    {h.title}
                  </strong>
                  <span className="text-overline text-on-surface-muted uppercase tracking-wider font-semibold">
                    {h.desc}
                  </span>
                </div>
              ))}
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

      {/* 3. Brand-Driven Strategy */}
      <Section
        id="brand-strategy"
        eyebrow="Office Interior Strategy"
        title="Your Office IS Your Brand."
        lede="Clients read your space before you speak. A lobby that signals authority, a boardroom that commands respect, an open floor that attracts talent."
      >
        <Grid cols={2} gap={6}>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-h3 font-bold text-on-surface mb-3">
                Workplace Strategy Principles
              </h3>
              <ul className="space-y-2.5 text-small text-on-surface-2 mb-4">
                {brandFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30">
            <h3 className="font-display text-h3 font-bold text-on-surface mb-3">
              5 Integrated Office Zones
            </h3>
            <div className="space-y-3">
              {officeZones.map((z) => (
                <div
                  key={z.name}
                  className="p-3 rounded-lg bg-surface-deep/60 border border-border-subtle/40"
                >
                  <strong className="block font-display text-small text-accent">
                    {z.name}
                  </strong>
                  <span className="text-[12px] text-on-surface-muted">
                    {z.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Section>

      {/* 4. Four Specializations */}
      <Section
        id="office-types"
        eyebrow="Office Specialisation"
        title="Every Office Type. One Design Partner."
        lede="From a 500 sqft clinic to a 50,000 sqft corporate campus."
      >
        <Grid cols={2} gap={6}>
          {officeTypes.map((type) => (
            <div
              key={type.sector}
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
                    {type.sector}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-1">
                  {type.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {type.desc}
                </p>
                <ul className="space-y-1.5 text-small text-on-surface-2 border-t border-border-subtle/40 pt-3">
                  {type.specs.map((s) => (
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
        eyebrow="Office Projects"
        title="500+ Offices. Every One Delivered."
        lede="From compact clinics to 20,000 sqft IT parks. Handed over on agreed milestones with flat 10-year warranty."
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
        id="why-choose-commercial"
        eyebrow="Why Luxe Axis for Commercial"
        title="Five Reasons Businesses Choose Us"
        lede="Most contractors deliver a room. We deliver a workplace that performs."
      >
        <Grid cols={2} gap={6}>
          {whyChooseCommercial.map((item) => (
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

      {/* 7. Interactive Before & After Slider */}
      <Section
        id="before-after"
        eyebrow="Real Transformations"
        title="Before and After: Commercial Office Fit-Out"
        lede="Bare shell space transformed into a branded IT office in OMR, Chennai."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare shell office space before commercial fit-out',
            }}
            afterImage={{
              src: '/posters/pricing-axis.avif',
              alt: 'Completed premium IT office interior by Luxe Axis in OMR',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Office Transformation — OMR, Chennai
          </p>
        </div>
      </Section>

      {/* 8. Fixed-Price Packages */}
      <Section
        id="pricing"
        eyebrow="Office Fit-Out Packages"
        title="Fixed-Price Offices. Per Sq Ft. No Surprises."
        lede="Every package includes workplace strategy, 3D office design, agreed delivery milestones, and flat 10-year warranty."
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
        eyebrow="Office Questions Answered"
        title="Office Interior FAQ"
        lede="Everything you need to know before booking your commercial consultation."
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
