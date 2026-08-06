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

const ROUTE = '/residential/apartments';

export const metadata: Metadata = {
  title: 'Interior Design for Apartments in Chennai | Luxe Axis',
  description:
    'Expert apartment interior design in Chennai. 2BHK to 4BHK flat interiors, space-optimised layouts, fixed transparent pricing, 45-day move-in guarantee, and flat 10-year warranty.',
  alternates: canonicalFor(ROUTE),
};

export default function ApartmentsPage() {
  const highlights = [
    { title: 'All Apartment Types', desc: 'Customized Solutions for 2BHK, 3BHK, and 4BHK Flats' },
    { title: 'Space Optimised', desc: 'Every Square Foot Engineered for Ergonomic Function' },
    { title: 'Fixed Transparent Price', desc: 'Zero Cost Escalation or Hidden Charges After Signing' },
    { title: '45-Day Delivery', desc: 'Contractually Guaranteed Move-In Timeline' },
    { title: 'Flat 10-Year Warranty', desc: 'Complete Coverage Across All Cabinets & Finishes' },
  ];

  const apartmentSizes = [
    {
      size: '650 to 900 sqft',
      title: '2BHK Apartment',
      price: 'Starting from Rs. 4,50,000',
      desc: 'Smart layouts that maximize storage, natural light, and fluid movement. Living, kitchen, two bedrooms, and bathrooms designed as a connected whole.',
      features: [
        'Modular kitchen with BWP marine ply & soft-close fittings',
        'Floor-to-ceiling wardrobes in both bedrooms',
        'Living room false ceiling with LED cove lighting & TV unit',
        'Complete Asian Paints Royale painting & ambient fixtures',
      ],
      href: '/book-audit',
      cta: 'Get 2BHK Quote',
      featured: false,
    },
    {
      size: '1000 to 1400 sqft',
      title: '3BHK Apartment',
      price: 'Starting from Rs. 8,00,000',
      desc: 'Room-by-room interior design with distinct identities for each space. Living, dining, three bedrooms, kitchen, and utility each crafted with individual character.',
      features: [
        'Large modular kitchen with quartz countertop & island option',
        'Custom wardrobes in all three bedrooms',
        'Zoned false ceiling with magnetic light tracks',
        'Dedicated dining area design & accent wall panelling',
      ],
      href: '/book-audit',
      cta: 'Get 3BHK Quote',
      featured: true,
    },
    {
      size: '1600 to 2400 sqft',
      title: '4BHK Apartment',
      price: 'Starting from Rs. 12,00,000',
      desc: 'Premium apartment design with the scope to create truly distinctive spaces. Foyer, study, guest bedroom, and master suite each treated with bespoke architectural care.',
      features: [
        'Premium kitchen with walk-in pantry & Blum motorized hardware',
        'Full wardrobe suites plus integrated study furniture',
        'Grand foyer entrance design & marble accent cladding',
        'Premium perimeter false ceilings & imported veneer finishes',
      ],
      href: '/book-audit',
      cta: 'Get 4BHK Quote',
      featured: false,
    },
  ];

  const constraints = [
    {
      title: 'Society Restrictions & Clearances',
      desc: 'We handle work permits, timing clearances, and elevator access with your apartment society association. Over 200 society-governed projects delivered without conflict.',
    },
    {
      title: 'Shared Walls & Fixed Structure',
      desc: 'We design within the fixed structural grid of your apartment without altering load-bearing walls. Smart space planning delivers openness without risky demolition.',
    },
    {
      title: 'Limited Natural Light & North Aspect',
      desc: 'Chennai apartments often face north or have windows partially blocked by adjacent towers. We use tint-calibrated mirrors, light-toned reflective veneers, and layered artificial lighting.',
    },
    {
      title: 'Compact 60–100 sqft Kitchens',
      desc: 'Apartment kitchens in Chennai are typically compact. We specialize in maximizing vertical storage, counter space, and workflow using precision-cut modular cabinetry.',
    },
  ];

  const galleryProjects = [
    {
      title: 'Premium 3BHK Apartment Interior',
      tag: '3BHK Full Interior',
      location: 'Adyar, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'Contemporary 2BHK Space-Optimized Flat',
      tag: '2BHK Living Room',
      location: 'T. Nagar, Chennai',
      image: '/posters/portfolio.avif',
    },
    {
      title: 'Ergonomic Modular Kitchen in 2BHK',
      tag: 'Apartment Kitchen',
      location: 'Velachery, Chennai',
      image: '/posters/pricing-axis.avif',
    },
    {
      title: 'Luxury 4BHK Master Bedroom Suite',
      tag: '4BHK Master Suite',
      location: 'Anna Nagar, Chennai',
      image: '/posters/persona-router.avif',
    },
  ];

  const pricingTiers = [
    {
      name: 'HomeOne Compact',
      tag: 'Compact 2BHK',
      price: 'Rs. 4.5L',
      unit: '/ 2BHK',
      desc: 'Quality interiors for compact apartments. Fixed price, zero surprises.',
      features: [
        'Modular kitchen with BWP marine ply carcass',
        'Master bedroom wardrobe with soft-close hinges',
        'False ceiling, living and kitchen coves',
        'Wall paint and texture finish',
        'Flat 10-year warranty & post-install care',
      ],
      cta: 'Get 2BHK Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'HomeOne Premium',
      tag: 'Most Popular',
      price: 'Rs. 12L',
      unit: '/ 3BHK',
      desc: 'Complete apartment transformation with premium finishes & Hafele hardware.',
      features: [
        'Premium modular kitchen with quartz countertop',
        'Custom wardrobes in all bedrooms',
        'Full false ceiling with cove lighting',
        'Sacred Pooja room mandap design',
        'Hafele & Blum hardware standard',
        'Flat 10-year warranty & 45-day move-in guarantee',
      ],
      cta: 'Get 3BHK Quote',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'HomeOne Luxury',
      tag: 'Signature 4BHK',
      price: 'Rs. 22L',
      unit: '/ 4BHK+',
      desc: 'Bespoke luxury interiors for high-rise penthouses & spacious 4BHK apartments.',
      features: [
        'Luxury modular kitchen with walk-in pantry',
        'Custom walk-in wardrobe suites throughout',
        'Premium false ceilings in all rooms',
        'Italian laminates & imported stone options',
        'Priority Senior Architect assignment',
        'Flat 10-year warranty & guaranteed handover',
      ],
      cta: 'Explore Signature',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = [
    {
      name: 'Arun Kumar',
      location: 'T. Nagar, Chennai',
      quote:
        'Luxe Axis guided us perfectly. From billing to delivery, always responsive and helpful. Good collection of finishes and prompt 45-day delivery for our 2BHK flat.',
      stars: 5,
    },
    {
      name: 'Aadhithya B. Kailash',
      location: 'Adyar, Chennai',
      quote:
        'My 3BHK apartment interiors were completed even before the promised handover date. Mr. SriBalaji managed every detail professionally. Excellent execution!',
      stars: 5,
    },
    {
      name: 'Venkat Ramanan',
      location: 'Velachery, Chennai',
      quote:
        'Good custom options and excellent quality. They gave detailed explanations on every product and delivered ahead of the expected date with zero cost escalation.',
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: 'How much does apartment interior design cost in Chennai in 2025?',
      a: 'A complete 2BHK apartment interior starts from Rs. 4,50,000. A 3BHK starts from Rs. 8,00,000 and a 4BHK from Rs. 12,00,000. These include modular kitchen, wardrobes, false ceiling, flooring, and complete woodwork.',
    },
    {
      q: 'How long does a complete apartment interior take?',
      a: 'A 2BHK takes 25 to 35 days. A 3BHK takes 35 to 45 days. All are covered under Luxe Axis\'s 45-day delivery guarantee. If we are late, compensation is contractually paid.',
    },
    {
      q: 'Does Luxe Axis handle apartment society permissions for renovation work?',
      a: 'Yes. Our site team handles all society coordination including work permits, timing restrictions, elevator bookings, and noise guidelines across 200+ gated societies in Chennai.',
    },
    {
      q: 'Does the flat 10-year warranty cover apartment interiors?',
      a: 'Yes. Every element of your apartment interior is covered under our flat 10-year warranty, including modular kitchen, wardrobes, false ceiling, and finishes with no fine print.',
    },
    {
      q: 'Can I see my apartment interior in 3D before work begins?',
      a: 'Yes. Every project includes a full 3D VR walkthrough before any work begins. You approve every room, material, and fitting before execution starts.',
    },
    {
      q: 'Can Luxe Axis make a small apartment feel bigger?',
      a: 'Yes. Space optimization is a core skill. We use concealed storage, mirror placement, light color palettes, multi-functional furniture, and strategic lighting to make compact apartments feel significantly larger.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Interior Design for Apartments in Chennai',
          description:
            'Space-optimised 2BHK to 4BHK apartment interior design in Chennai with fixed pricing and 45-day move-in.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/residential/apartments" labels={{ 'apartments': "Apartment Interiors" }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Every Square Foot Counted
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Interior Design for Apartments <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Space-optimised apartment interiors from 2BHK to 4BHK. Fixed price, 45-day move-in guarantee, and a flat 10-year warranty on every cabinet, ceiling, and finish.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Get Free Consultation
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                See Apartment Projects →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">5,000+</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Flats Designed</span>
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
                <strong className="block font-display text-h3 text-accent font-bold">4.9 ★</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Google Rating</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">200+</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Society Permits</span>
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

      {/* 3. Apartment Packages by Size */}
      <Section
        id="packages"
        eyebrow="Apartment Packages"
        title="Choose Your Apartment Size"
        lede="Every apartment size has a different design brief. We have dedicated packages for each, with room-specific solutions for how urban families actually live."
      >
        <Grid cols={3} gap={6}>
          {apartmentSizes.map((pkg) => (
            <div
              key={pkg.title}
              className={`lx-liquid-glass rounded-2xl p-6 border flex flex-col justify-between shadow-2xl relative ${
                pkg.featured ? 'border-accent bg-accent/5' : 'border-accent/30'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Most Popular
                </span>
              )}
              <div>
                <span className="text-overline text-accent uppercase font-bold tracking-wider">{pkg.size}</span>
                <h3 className="font-display text-h3 font-bold text-on-surface mt-1">{pkg.title}</h3>
                <p className="text-small text-accent font-semibold my-2">{pkg.price}</p>
                <p className="text-small text-on-surface-2 mb-4 pb-4 border-b border-border-subtle/50">
                  {pkg.desc}
                </p>
                <ul className="space-y-2 mb-6 text-small text-on-surface-2">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-accent">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button as="a" href={pkg.href} variant={pkg.featured ? 'primary' : 'secondary'} className="w-full justify-center">
                {pkg.cta} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Apartment-Specific Expertise & Constraints */}
      <Section
        id="expertise"
        eyebrow="Apartment-Specific Expertise"
        title="Designing for Chennai Apartments"
        lede="Chennai apartments come with real constraints. Having designed over 5,000 flats across the city, we have engineered proven solutions for every challenge."
      >
        <Grid cols={2} gap={8} className="items-center">
          <div className="space-y-4">
            {constraints.map((c) => (
              <div key={c.title} className="p-4 rounded-xl lx-liquid-glass border border-accent/25">
                <h3 className="font-display text-h4 font-bold text-accent mb-1">{c.title}</h3>
                <p className="text-small text-on-surface-2 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-accent/30 aspect-[4/5] shadow-2xl group">
            <Image
              src="/posters/portfolio.avif"
              alt="Apartment space optimization design by Luxe Axis"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 lx-liquid-glass p-4 rounded-xl border border-accent/30">
              <strong className="block text-h4 text-on-surface font-bold">200+ Society Approvals</strong>
              <span className="text-small text-on-surface-2">Zero friction work permits across Chennai gated communities</span>
            </div>
          </div>
        </Grid>
      </Section>

      {/* 5. Apartment Project Gallery */}
      <Section
        id="gallery"
        eyebrow="Apartment Projects"
        title="5,000+ Apartments. Every One Guaranteed."
        lede="From compact 2BHKs in Tambaram to expansive 4BHK penthouses in OMR."
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

      {/* 6. Interactive Before & After Slider */}
      <Section
        id="before-after"
        eyebrow="Real Project"
        title="Before & After: Apartment Transformation"
        lede="A bare delivery-state apartment transformed into a complete premium home in 45 days."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/pricing-axis.avif',
              alt: 'Bare Chennai apartment before interior design execution',
            }}
            afterImage={{
              src: '/posters/portfolio.avif',
              alt: 'Complete apartment interior design by Luxe Axis',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            2BHK Complete Interior Transformation — Tambaram, Chennai
          </p>
        </div>
      </Section>

      {/* 7. Transparent Pricing Packages */}
      <Section
        id="pricing"
        eyebrow="Transparent Pricing"
        title="Fixed Price Packages. Zero Hidden Costs."
        lede="Every package includes 3D VR design, locked itemized BOQ, 45-day delivery, and flat 10-year warranty."
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

      {/* 8. 5-Step Process */}
      <ProcessSteps />

      {/* 9. Client Stories */}
      <Section
        id="testimonials"
        eyebrow="Client Stories"
        title="What Chennai Flat Owners Say"
        lede="Verified feedback from apartment owners across Chennai."
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

      {/* 10. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Apartment Interior FAQ"
        lede="Everything you need to know about designing your Chennai apartment."
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

      {/* 11. CTA Conversion Section */}
      <CTASection />
    </main>
  );
}
