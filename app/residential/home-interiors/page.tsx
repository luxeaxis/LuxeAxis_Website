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
import { MaterialPartners } from '@/components/sections/MaterialPartners';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';

const ROUTE = '/residential/home-interiors';

export const metadata: Metadata = {
  title: 'Home Interior Designers in Chennai | Luxe Axis Complete Interiors',
  description:
    "Chennai's top home interior designers. Turnkey 2BHK, 3BHK, 4BHK villa & penthouse interiors. Flat 10-year warranty, 45-day move-in guarantee, post-install care, and fixed transparent pricing.",
  alternates: canonicalFor(ROUTE),
};

export default async function HomeInteriorsPage() {
  const highlights = [
    {
      title: 'Full-Home Scope',
      desc: 'Every Room Covered Under One Unified Design Blueprint',
    },
    {
      title: '10-Year Warranty',
      desc: 'Flat Warranty Across All Materials & Custom Joinery',
    },
    {
      title: '45-Day Move-In',
      desc: 'Contractually Backed Delivery Timeline with Zero Delay',
    },
    {
      title: '3D Spatial OS',
      desc: '4K Raytraced VR Preview of Every Room Before Execution',
    },
    {
      title: 'Fixed Transparent Price',
      desc: 'Locked Itemized BOQ Quote — Zero Hidden Cost Escalation',
    },
  ];

  const roomCategories = [
    {
      title: 'Curated Living Spaces',
      tag: 'Living Room',
      image: '/posters/hero.avif',
      href: '/residential/living-room',
      specs: [
        'Gyproc false ceiling with magnetic LED cove lighting',
        'Cantilevered sintered stone TV feature wall unit',
        'Custom acoustic wall paneling & velvet upholstery',
      ],
    },
    {
      title: 'Restful Master Suites',
      tag: 'Bedroom',
      image: '/posters/portfolio.avif',
      href: '/residential/bedroom',
      specs: [
        'Floor-to-ceiling sliding glass wardrobes with sensor LEDs',
        'Circadian rhythm tray ceiling lighting',
        'Upholstered bed headboard with integrated nightstands',
      ],
    },
    {
      title: 'Precision-Built Kitchens',
      tag: 'Modular Kitchen',
      image: '/posters/pricing-axis.avif',
      href: '/residential/modular-kitchen',
      specs: [
        'BWP boiling-water-proof marine plywood carcass',
        'Blum & Hettich soft-close motorized hardware',
        'Quartz countertops with anti-stain nano seal',
      ],
    },
    {
      title: 'Sacred Spaces, Crafted',
      tag: 'Pooja Room',
      image: '/posters/persona-router.avif',
      href: '/residential/pooja-room',
      specs: [
        'Vastu-Tech aligned brass & backlit onyx mandaps',
        'Stepped CNC teakwood lattice doors',
        'Recessed ambient warm LED niche illumination',
      ],
    },
    {
      title: 'Playful. Safe. Built to Grow.',
      tag: 'Kids Room',
      image: '/posters/portfolio.avif',
      href: '/residential/bedroom',
      specs: [
        'Non-toxic anti-scratch laminate & soft-edge joinery',
        'Ergonomic study station with focused task lighting',
        'Modular storage drawers designed for growing children',
      ],
    },
    {
      title: 'Engineered to Store More',
      tag: 'Wardrobe & Storage',
      image: '/posters/hero.avif',
      href: '/residential/wardrobe',
      specs: [
        'Custom walk-in wardrobe suites & bi-fold glass doors',
        'Internal leather organizers & jewelry pull-outs',
        'Marine ply carcass backed by flat 10-year warranty',
      ],
    },
  ];

  const vrFeatures = [
    'Photorealistic 4K 3D renders of every room before site work',
    'Full-home 360-degree VR walkthrough at our design experience studio',
    'Unlimited material & color revisions at 3D design stage',
    'Zero financial risk — approve every room before material dispatch',
  ];

  const guarantees = [
    {
      num: '10',
      unit: 'Yr',
      title: 'Flat 10-Year Warranty',
      subtitle: 'Every Material. Every Room.',
      desc: 'Our flat 10-year warranty covers every element across every room of your home. No fine print. No exclusions. Written directly into your signed contract.',
    },
    {
      num: '45',
      unit: 'Days',
      title: '45-Day Delivery Guarantee',
      subtitle: 'Keys in 45 Days. Contractually.',
      desc: 'From design approval to full handover, your complete home is ready in 45 days. Modular kitchen, false ceilings, bedrooms, and living room.',
    },
    {
      num: '0',
      unit: 'Cost',
      title: 'Zero Extra Cost After Handover',
      subtitle: 'Dedicated Post-Install Care',
      desc: 'A dedicated post-installation care team handles any maintenance on call after handover with zero appointment fees or hidden charges.',
    },
  ];

  const projects = [
    {
      title: 'Full 3BHK Home Transformation',
      tag: 'Complete 3BHK',
      location: 'Adyar, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'Modern 2BHK Full-Home Interior',
      tag: '2BHK Complete',
      location: 'T. Nagar, Chennai',
      image: '/posters/portfolio.avif',
    },
    {
      title: 'Luxury 4BHK Penthouse Interior',
      tag: '4BHK Luxury',
      location: 'OMR, Chennai',
      image: '/posters/pricing-axis.avif',
    },
    {
      title: 'Sprawling Full Villa Interior',
      tag: 'Villa Project',
      location: 'Velachery, Chennai',
      image: '/posters/persona-router.avif',
    },
  ];

  const pricingTiers = [
    {
      name: 'Essential Luxury',
      tag: 'Compact 2BHK',
      price: 'Rs. 4.5L',
      unit: '/ 2BHK',
      desc: 'High-quality complete home interiors for compact apartments.',
      features: [
        'Ergonomic modular kitchen with marine ply carcass',
        'Master bedroom wardrobe with soft-close hinges',
        'Living room & kitchen Gyproc false ceiling',
        'Asian Paints Royale luxury wall finish',
        'Flat 10-year warranty & post-install care',
      ],
      cta: 'Get 2BHK Quote',
      href: '/book-audit',
      featured: false,
    },
    {
      name: 'Signature Bespoke',
      tag: 'Most Popular',
      price: 'Rs. 12L',
      unit: '/ 3BHK',
      desc: 'Complete turnkey home transformation with Italian laminates & Blum hardware.',
      features: [
        'Premium modular kitchen with quartz countertop',
        'Floor-to-ceiling wardrobes in all bedrooms',
        'Full home false ceiling with magnetic LED coves',
        'Sacred Pooja room mandap design',
        'Blum & Hettich soft-close fittings standard',
        'Flat 10-year warranty & 45-day move-in guarantee',
      ],
      cta: 'Get 3BHK Quote',
      href: '/book-audit',
      featured: true,
    },
    {
      name: 'Ultra-Luxury Villa',
      tag: 'Signature Villa',
      price: 'Rs. 22L',
      unit: '/ 4BHK+',
      desc: 'Uncompromising luxury interiors for villas, duplexes & penthouses.',
      features: [
        'Imported Italian marble cladding & liquid metal accents',
        'Custom walk-in closet suites & island wardrobes',
        'Perimeter magnetic light tracks & smart automation',
        'Vastu-Tech sacred temple architecture',
        'Priority Senior Architect assignment',
        'Flat 10-year warranty & contractually guaranteed timeline',
      ],
      cta: 'Explore Signature',
      href: '/book-audit',
      featured: false,
    },
  ];

  const testimonials = await getTestimonials();

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: 'Home Interior Designers in Chennai',
          description:
            'Turnkey complete home interior design, 3D VR preview, modular kitchens, wardrobes, and 45-day move-in in Chennai.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section with Ken Burns Cinematic Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[80vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        {/* Full-Bleed Background Image with Ken Burns Cinematic Effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/posters/home-interiors-hero.png"
            alt="Luxe Axis Complete Luxury Home Interior Design in Chennai"
            fill
            priority
            className="object-cover animate-ken-burns opacity-40 scale-105"
          />
          {/* Ambient Gradient Overlay for High Contrast Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-deep via-surface-deep/90 to-surface-deep/60" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface-deep via-surface-deep/80 to-transparent" />
        </div>

        <Container className="relative z-10">
          <Breadcrumbs path="/residential/home-interiors" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Chennai&apos;s Complete Home Interior Specialists
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Home Interior Designers <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Every room designed as one unified home. Living room, modular
              kitchens, bedrooms, false ceilings, and bespoke wardrobes. 10,000+
              complete homes delivered across Chennai with 45-day move-in and
              flat 10-year warranty.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                as="a"
                href="/book-audit"
                size="lg"
                className="shadow-2xl"
              >
                Book Free Site Visit
              </Button>
              <Button
                as="a"
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View Home Projects →
              </Button>
            </div>

            {/* Hero Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  10,000+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Homes Delivered
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
                  50+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Master Architects
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

      {/* 3. Intro Section: Every Room. One Studio. */}
      <Section
        id="intro"
        eyebrow="Complete Home Interiors"
        title="Every Room. One Studio."
        lede="Most interior contractors handle one room at a time. Luxe Axis designs your entire home as a single unified project. One master team across every room, one warranty covering every element, one fixed price for everything."
      >
        <Grid cols={2} gap={8} className="items-center">
          <Stack gap={5}>
            <p className="text-body text-on-surface-2">
              No coordination gaps between carpentering contractors, ceiling
              technicians, and electrician teams. From the grand entryway to
              your sacred pooja mandap, our architects handle civil alterations,
              MEP conduit routing, custom millwork, and lighting coves under one
              contract.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-small font-semibold">
                ✓ Flat 10-Year Warranty
              </span>
              <span className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-small font-semibold">
                ✓ 45-Day Delivery Guarantee
              </span>
              <span className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-small font-semibold">
                ✓ Post-Install Maintenance Care
              </span>
            </div>
            <div>
              <Button as="a" href="/process">
                Explore Our 5-Step Process →
              </Button>
            </div>
          </Stack>

          <div className="relative rounded-2xl overflow-hidden border border-accent/30 aspect-[4/3] shadow-2xl group">
            <Image
              src="/posters/hero.avif"
              alt="Complete home interior design by Luxe Axis"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 lx-liquid-glass p-4 rounded-xl border border-accent/30 flex items-center justify-between">
              <div>
                <strong className="block text-h4 text-on-surface font-bold">
                  50+ Master Architects
                </strong>
                <span className="text-small text-on-surface-2">
                  Dedicated turnkey execution teams across Chennai
                </span>
              </div>
            </div>
          </div>
        </Grid>
      </Section>

      {/* 4. Room-by-Room Bento Grid */}
      <Section
        id="rooms"
        eyebrow="Room-by-Room Design"
        title="One Studio for Every Room"
        lede="From the living room feature wall to the pooja mandap, every room is designed, built, and warranted by a single team."
      >
        <Grid cols={3} gap={6}>
          {roomCategories.map((room) => (
            <div
              key={room.title}
              className="lx-liquid-glass rounded-2xl p-5 border border-accent/30 shadow-xl flex flex-col justify-between group hover:border-accent/60 transition-all"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={room.image}
                    alt={room.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {room.tag}
                  </span>
                </div>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-3">
                  {room.title}
                </h3>
                <ul className="space-y-1.5 mb-5 text-small text-on-surface-2">
                  {room.specs.map((spec) => (
                    <li key={spec} className="flex items-start gap-2">
                      <span className="text-accent text-xs">✦</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                as="a"
                href={room.href}
                variant="secondary"
                size="sm"
                className="w-full justify-center"
              >
                Explore {room.tag} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. 3D Spatial OS & VR Experience */}
      <Section
        id="3d-vr"
        eyebrow="3D Design & VR Simulator"
        title="Your Entire Home in 3D. Before We Build It."
        lede="Before touching a single wall, your complete home is built in raytraced 3D. Walk through all rooms at our experience studio and approve every detail before execution begins."
      >
        <Grid cols={2} gap={8} className="items-center">
          <Stack gap={4}>
            <ul className="space-y-3">
              {vrFeatures.map((feat) => (
                <li
                  key={feat}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface-raised/50 border border-border-subtle/50"
                >
                  <span className="text-accent text-body">✦</span>
                  <span className="text-body text-on-surface-2 font-medium">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-2 flex gap-4">
              <Button as="a" href="/residential/3d-design">
                Launch 3D Simulator →
              </Button>
              <Button as="a" href="/book-audit" variant="secondary">
                Book Studio Visit
              </Button>
            </div>
          </Stack>

          <div className="grid grid-cols-2 gap-4 relative">
            {roomCategories.slice(0, 4).map((r) => (
              <div
                key={r.title + '3d'}
                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-accent/30 group"
              >
                <Image
                  src={r.image}
                  alt={r.title + ' 3D preview'}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[11px] font-semibold text-accent uppercase tracking-wider">
                  {r.tag} 3D
                </span>
              </div>
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lx-liquid-glass p-3 rounded-xl border border-accent/50 text-center shadow-2xl">
              <strong className="block font-display text-h3 text-accent font-bold">
                45
              </strong>
              <span className="text-[10px] text-on-surface-2 uppercase tracking-wider">
                Days to Move-In
              </span>
            </div>
          </div>
        </Grid>
      </Section>

      {/* 6. Material Partners */}
      <MaterialPartners />

      {/* 7. Three Ironclad Guarantees */}
      <Section
        id="guarantees"
        eyebrow="Our Promises to You"
        title="Three Guarantees. Zero Exceptions."
        lede="Contractually backed protection written into every project specification."
      >
        <Grid cols={3} gap={6}>
          {guarantees.map((g) => (
            <div
              key={g.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/40 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline gap-1 text-accent mb-2">
                  <span className="font-display text-[48px] font-bold leading-none">
                    {g.num}
                  </span>
                  <span className="font-ui text-h4 font-semibold uppercase">
                    {g.unit}
                  </span>
                </div>
                <span className="text-overline text-accent uppercase font-bold tracking-wider block mb-2">
                  {g.subtitle}
                </span>
                <h3 className="font-display text-h4 font-bold text-on-surface mb-3">
                  {g.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 8. Full-Home Transformations Gallery */}
      <Section
        id="gallery"
        eyebrow="Complete Home Projects"
        title="Full-Home Transformations Across Chennai"
        lede="Every project is a complete turnkey home delivered in 45 days with a flat 10-year warranty."
      >
        <Grid cols={2} gap={6}>
          {projects.map((p) => (
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

      {/* 9. Interactive Before & After Transformation Slider */}
      <Section
        id="before-after"
        eyebrow="Real Transformations"
        title="Before & After: Chennai Home Transformations"
        lede="Drag the handle to reveal the complete interior transformation delivered in 45 days."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare 3BHK apartment before interior design execution',
            }}
            afterImage={{
              src: '/posters/hero.avif',
              alt: 'Complete luxury 3BHK interior transformation after execution',
            }}
          />
          <p className="text-center text-small text-on-surface-muted mt-3">
            Complete 3BHK Home Transformation — Adyar, Chennai
          </p>
        </div>
      </Section>

      {/* 10. Transparent Pricing Packages */}
      <Section
        id="pricing"
        eyebrow="Transparent Investment"
        title="Fixed Price Packages. Zero Hidden Costs."
        lede="Every package includes 3D VR design, locked itemized BOQ, 45-day move-in, and flat 10-year warranty."
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

      {/* 11. 5-Step Process Timeline */}
      <ProcessSteps />

      {/* 12. Homeowner Testimonials */}
      <TestimonialBand testimonials={testimonials} />

      {/* 13. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
