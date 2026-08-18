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
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { canonicalFor } from '@/lib/seo/hreflang';
import { serviceJsonLd } from '@/lib/seo/jsonLd';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { THREE_D_HERO_SLIDES } from '@/lib/content/heroSlides';

const ROUTE = '/residential/3d-design';

export const metadata: Metadata = {
  title: '3D Interior Design & 4K VR Walkthroughs in Chennai | Luxe Axis',
  description:
    'Photorealistic 3D interior design and immersive 4K VR walkthroughs in Chennai. Preview lighting, textures, materials, and spatial scale with 100% CAD precision before building.',
  keywords: [
    '3d interior design in chennai',
    '3d interior rendering services chennai',
    'photorealistic vr walkthrough home interiors',
    '3d architectural visualization chennai',
    'virtual reality interior preview',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: '3D Interior Design & 4K VR Walkthroughs in Chennai | Luxe Axis',
    description:
      'Immersive 4K VR walkthroughs and photorealistic 3D simulations before construction begins.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/residential-3d-design-hero.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis 3D VR Interior Design Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Interior Design & VR Walkthroughs in Chennai | Luxe Axis',
    description:
      'Photorealistic 3D rendering and 4K virtual reality walkthroughs for Chennai homes.',
    images: ['/posters/residential-3d-design-hero.png'],
  },
};

export default async function ThreeDDesignPage() {
  const highlights = [
    {
      title: 'V-Ray Ray-Tracing',
      desc: 'Photorealistic Renders with Accurate Material Lighting Physics',
    },
    {
      title: '360° VR Walkthrough',
      desc: 'Immersive Oculus VR Session at Our Flagship Studio',
    },
    {
      title: '100% Free Included',
      desc: 'Complimentary Spatial Design Step in Every Project Tier',
    },
    {
      title: 'Unlimited Revisions',
      desc: 'Modify Layouts, Material Finishes & Lighting Until Satisfied',
    },
    {
      title: 'Written Sign-Off',
      desc: 'Zero On-Site Work Begins Without Your Prior Formal Approval',
    },
  ];

  const processSteps3D = [
    {
      num: '01',
      title: 'Laser Site Survey & CAD Floor Plan',
      desc: 'Our interior architects record laser-guided measurements, existing fixtures, and structural constraints to draft millimeter-precise AutoCAD floor plans.',
      image: '/posters/service-vastu-tech.png',
    },
    {
      num: '02',
      title: '3D Spatial Modeling & Joinery',
      desc: '3D spatial geometry is built in 3ds Max. Custom kitchen modules, wardrobe shutters, false ceiling coves, and furniture layouts are aligned to Vastu grids.',
      image: '/posters/residential-3d-design-hero.png',
    },
    {
      num: '03',
      title: 'V-Ray Photorealistic Rendering',
      desc: 'V-Ray ray-tracing renders every room with exact material shaders, Italian marble reflections, veneer textures, and ambient LED cove lighting physics.',
      image: '/posters/kitchen-hero-bg.png',
    },
    {
      num: '04',
      title: 'VR Walkthrough & Formal Sign-Off',
      desc: 'Experience your future home in 360° VR at our flagship studio. Make instant material or layout swaps. Execution begins after your written sign-off.',
      image: '/posters/tech-enabled-studio.png',
    },
  ];

  const freeVsCostly = {
    free3D: [
      'Kitchen modular layout configuration & cabinet swaps',
      'Wardrobe shutter finish, veneer texture & handle selection',
      'False ceiling cove pattern & LED cove positions',
      'Italian marble vs wooden flooring material choices',
      'Wall paint shade, textured stucco & wallpaper accents',
      'Furniture placement & custom lighting fixture positions',
    ],
    costlyExecution: [
      'Dismantling installed factory modular cabinets',
      'Relaying floor tiles & re-screeding concrete',
      'Repainting walls after custom carpentry work',
      'Rewiring electrical conduits for light positions',
      'Relocating plumbing outlets & drain pipes',
      'Re-ordering custom imported Italian marble or veneer',
    ],
  };

  const galleryProjects = [
    {
      title: '3BHK Villa Living Room Photorealistic 3D Render',
      tag: 'Living Room 3D',
      location: 'Adyar, Chennai',
      image: '/posters/residential-living-room-hero.png',
    },
    {
      title: 'Modular U-Kitchen 3D Spatial Visualisation',
      tag: 'Kitchen 3D',
      location: 'T. Nagar, Chennai',
      image: '/posters/kitchen-layout-ushape.png',
    },
    {
      title: 'Luxury Master Bedroom Suite 3D Fit-Out Plan',
      tag: 'Bedroom 3D',
      location: 'Velachery, Chennai',
      image: '/posters/residential-bedroom-hero.png',
    },
    {
      title: 'Bespoke Home Office & Teak Joinery 3D Plan',
      tag: 'Office 3D',
      location: 'Anna Nagar, Chennai',
      image: '/posters/home-interiors-hero.png',
    },
  ];

  const whyChoose3D = [
    {
      num: '01',
      title: 'Photorealistic V-Ray Shader Depth',
      desc: 'Our renders use V-Ray rendering software with real-world lighting physics, material shaders, and shadow depth. Finished rooms match the 3D renders side by side.',
    },
    {
      num: '02',
      title: 'Unlimited Free Design Revisions',
      desc: 'We revise the 3D design as many times as needed. Swap floor tiles, adjust TV wall paneling, or change kitchen colors at zero extra fee.',
    },
    {
      num: '03',
      title: 'Oculus VR 360° Walkthrough Session',
      desc: 'Visit our flagship studio for an immersive VR walkthrough of your home before it is built. Experience spatial volume, ceiling height, and lighting in 360 degrees.',
    },
    {
      num: '04',
      title: 'Zero On-Site Work Without Sign-Off',
      desc: 'No material is ordered, no work begins, and no crew is deployed until you give formal written approval on the final 3D design renders.',
    },
    {
      num: '05',
      title: 'Included Free in Every Interior Tier',
      desc: 'Luxe Axis does not charge extra for 3D visualization. It is an integral, non-negotiable step included complimentary with every residential interior project.',
    },
    {
      num: '06',
      title: 'Millimeter-Accurate Working Drawings',
      desc: 'Approved 3D renders translate directly into 2D CAD working drawings, ensuring factory joinery and site teams build to exact millimeter specs.',
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'Is 3D interior design free with Luxe Axis projects?',
      a: 'Yes. 3D visualization is included at no additional cost with every Luxe Axis interior design project. Photorealistic renders are produced for every room with zero separate visualization fees.',
    },
    {
      q: 'How many revision rounds are included in the 3D stage?',
      a: 'Unlimited revisions are included at the 3D stage. We revise materials, layouts, colors, and fittings as many times as needed until you are completely satisfied.',
    },
    {
      q: 'How long does the 3D design process take?',
      a: 'First renders are delivered 5 to 10 days after site measurement. Each revision round takes 2 to 3 days. Most clients finalize design approval within 15 days.',
    },
    {
      q: 'Can I change the design after seeing the 3D renders?',
      a: 'Yes. You can change any aspect including layout, materials, colors, furniture placement, and fittings at the 3D stage at no cost before execution begins.',
    },
    {
      q: 'Does Luxe Axis offer a VR walkthrough session?',
      a: 'Yes. Immersive VR walkthrough sessions are available at our flagship studio where you can walk through every room of your future home in virtual reality.',
    },
    {
      q: 'How realistic are Luxe Axis’s 3D interior renders?',
      a: 'Our renders are photorealistic, produced using V-Ray rendering software with real-world material shaders, accurate lighting physics, and shadow detail.',
    },
    {
      q: 'Which software stack does Luxe Axis use for 3D design?',
      a: 'We use AutoCAD for technical floor plans, SketchUp and 3ds Max for 3D modeling, and V-Ray for photorealistic rendering and VR scene creation.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={serviceJsonLd({
          name: '3D Interior Design in Chennai',
          description:
            '3D interior design in Chennai. Walk through your new home in photorealistic 3D before any work begins. Free with every project.',
          url: ROUTE,
        })}
      />

      {/* 1. Hero Section with Ken Burns Cinematic Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        {/* Full-Bleed Background with Ken Burns Animated 3D Interior Renders */}
        <HeroBackground slides={THREE_D_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs
            path="/residential/3d-design"
            labels={{ '3d-design': '3D Interior Design' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Photorealistic VR Interior Visualisation
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              3D Interior Design & VR <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Walk through your new home in photorealistic V-Ray 3D before any
              work begins. Approve every material, lighting cove, and custom
              joinery detail. Free with every Luxe Axis project tier with a
              45-day delivery guarantee.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                as="a"
                href="/book-audit"
                size="lg"
                className="shadow-2xl"
              >
                Book Free 3D Session
              </Button>
              <Button
                as="a"
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                Visit VR Studio →
              </Button>
            </div>

            {/* Hero Key Stats Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-accent/20">
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  10K+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  3D Designs Delivered
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  Free
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Included in Every Project
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  5 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  First Renders
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center">
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Delivery Guarantee
                </span>
              </div>
              <div className="lx-liquid-glass-card p-4 rounded-xl text-center col-span-2 sm:col-span-1">
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

      {/* 3. The 4-Step 3D Process */}
      <Section
        id="3d-process"
        eyebrow="How It Works"
        title="The 3D Design Process"
        lede="From your first consultation to design sign-off. Four steps that give you complete confidence before work begins."
      >
        <Grid cols={2} gap={6}>
          {processSteps3D.map((step) => (
            <div
              key={step.num}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-4 border border-border-subtle/60">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-display text-h4 font-bold">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {step.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Why 3D Before You Build Comparison */}
      <Section
        id="why-3d-first"
        eyebrow="Why 3D First"
        title="Why 3D Before You Build"
        lede="At the 3D stage, everything is free to change. Once execution begins, changes cost time and money."
      >
        <Grid cols={2} gap={6}>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/40 bg-accent/5">
            <h3 className="font-display text-h3 font-bold text-accent mb-4">
              ✓ Free to Change at 3D Stage
            </h3>
            <ul className="space-y-2.5 text-small text-on-surface">
              {freeVsCostly.free3D.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-accent font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lx-liquid-glass rounded-2xl p-6 border border-red-500/30 bg-red-500/5">
            <h3 className="font-display text-h3 font-bold text-red-400 mb-4">
              ✕ Costly to Change After Execution
            </h3>
            <ul className="space-y-2.5 text-small text-on-surface-2">
              {freeVsCostly.costlyExecution.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Section>

      {/* 5. 3D to Reality Showcase Gallery */}
      <Section
        id="gallery"
        eyebrow="3D to Reality"
        title="From Render to Real Room"
        lede="Every project shown started as a 3D render in this exact style before a single material was ordered."
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

      {/* 6. 6 Reasons Why Choose Luxe Axis 3D */}
      <Section
        id="why-luxe-axis-3d"
        eyebrow="Why Luxe Axis 3D"
        title="What Our 3D Design Gives You"
        lede="A 3D render is not decoration. It is a decision-making tool that protects you from expensive post-execution changes."
      >
        <Grid cols={2} gap={6}>
          {whyChoose3D.map((item) => (
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

      {/* 7. 5-Step Process */}
      <ProcessSteps />

      {/* 8. Client Stories */}
      <TestimonialBand testimonials={testimonials} />

      {/* 9. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="3D Interior Design FAQ"
        lede="Everything you need to know about our 3D visualization and VR walkthrough process."
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

      {/* 10. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
