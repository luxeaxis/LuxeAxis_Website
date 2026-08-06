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

const ROUTE = '/residential/3d-design';

export const metadata: Metadata = {
  title: '3D Interior Design in Chennai | Luxe Axis',
  description:
    '3D interior design in Chennai. Walk through your new home in photorealistic 3D before any work begins. Free with every project, 45-day delivery, flat 10-year warranty.',
  alternates: canonicalFor(ROUTE),
};

export default async function ThreeDDesignPage() {
  const highlights = [
    {
      title: 'Photorealistic Renders',
      desc: 'V-Ray Ray-Traced Renders Indistinguishable from Real Photos',
    },
    {
      title: 'VR Walkthrough',
      desc: 'Immersive Oculus VR Session at Our Flagship Studio',
    },
    {
      title: 'Completely Free',
      desc: '100% Complimentary Step Included in Every Project',
    },
    {
      title: 'Unlimited Revisions',
      desc: 'Modify Layouts, Colors & Finishes Until Fully Satisfied',
    },
    {
      title: 'Approval First Guarantee',
      desc: 'Zero On-Site Work Starts Without Your Written Sign-Off',
    },
  ];

  const processSteps3D = [
    {
      num: '01',
      title: 'Site Measurement & Survey',
      desc: 'Our design team visits your home and records laser-guided measurements, existing fixtures, and structural constraints alongside room photography.',
      image: '/posters/persona-router.avif',
    },
    {
      num: '02',
      title: 'CAD Floor Plan & Layout',
      desc: 'Technical architects draft precise CAD drawings. Furniture layouts, traffic flow, and structural constraints are resolved before any 3D work begins.',
      image: '/posters/pricing-axis.avif',
    },
    {
      num: '03',
      title: 'Photorealistic 3D Renders',
      desc: 'Photorealistic 3D renders are produced for every room showing exact materials, LED lighting, furniture, and custom fittings as they will appear in real life.',
      image: '/posters/hero.avif',
    },
    {
      num: '04',
      title: 'Your Sign-Off & Execution',
      desc: 'Review renders at our studio or VR session. Request any changes. Execution begins immediately after your formal approval.',
      image: '/posters/portfolio.avif',
    },
  ];

  const freeVsCostly = {
    free3D: [
      'Kitchen layout configuration & module swaps',
      'Wardrobe shutter finish, color & handles',
      'False ceiling cove pattern & LED positions',
      'Flooring material & tile size selection',
      'Wall paint shade, texture & wallpaper',
      'Furniture placement & accent decor',
    ],
    costlyExecution: [
      'Dismantling installed modular cabinets',
      'Relaying floor tiles & breaking screed',
      'Repainting walls after carpentry work',
      'Rewiring electrical conduits for light positions',
      'Relocating plumbing outlets & drain pipes',
      'Re-ordering custom imported materials',
    ],
  };

  const galleryProjects = [
    {
      title: '3BHK Living Room Photorealistic 3D Render',
      tag: 'Living Room 3D',
      location: 'Adyar, Chennai',
      image: '/posters/hero.avif',
    },
    {
      title: 'U-Kitchen 3D Spatial Visualisation',
      tag: 'Kitchen 3D',
      location: 'T. Nagar, Chennai',
      image: '/posters/pricing-axis.avif',
    },
    {
      title: 'Master Bedroom Suite 3D Design',
      tag: 'Bedroom 3D',
      location: 'Velachery, Chennai',
      image: '/posters/portfolio.avif',
    },
    {
      title: 'Home Office & Executive Desk 3D Plan',
      tag: 'Office 3D',
      location: 'Anna Nagar, Chennai',
      image: '/posters/persona-router.avif',
    },
  ];

  const whyChoose3D = [
    {
      num: '01',
      title: 'Photorealistic, Not Cartoon Renders',
      desc: 'Our renders use V-Ray software with real-world lighting physics, material shaders, and shadow depth. Finished rooms routinely match the 3D renders side by side.',
    },
    {
      num: '02',
      title: 'Unlimited Revisions Until You Approve',
      desc: 'We revise the 3D design as many times as needed. Swap the floor tile, move the TV wall, or change the kitchen color at zero additional fee.',
    },
    {
      num: '03',
      title: 'VR Walkthrough at Our Flagship Studio',
      desc: 'Visit our flagship studio for an immersive VR walkthrough of your home before it is built. Experience scale, ceiling height, and lighting in 360 degrees.',
    },
    {
      num: '04',
      title: 'Execution Starts Only After Your Sign-Off',
      desc: 'No material is ordered, no work begins, and no crew is deployed until you give formal written approval on the final 3D design renders.',
    },
    {
      num: '05',
      title: 'Included Free in Every Project',
      desc: 'Luxe Axis does not charge extra for 3D visualization. It is an integral, non-negotiable step included complimentary with every interior project.',
    },
    {
      num: '06',
      title: 'Post-Installation Care & 10-Year Warranty',
      desc: 'Our commitment extends past handover. Every project receives dedicated post-installation snagging and support backed by our flat 10-year warranty.',
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

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs
            path="/residential/3d-design"
            labels={{ '3d-design': '3D Interior Design' }}
          />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                See It Before You Build It
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              3D Interior Design <br />
              <span className="text-accent">in Chennai</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Walk through your new home in photorealistic 3D before any work
              begins. Approve every room, material, and fitting. Free with every
              Luxe Axis project. 45-day delivery guarantee.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free 3D Session
              </Button>
              <Button as="a" href="/portfolio" variant="secondary" size="lg">
                Visit VR Studio →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  10K+
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  3D Designs Delivered
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  Free
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Included in Every Project
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  5 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  First Renders
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  45 Days
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Delivery Guarantee
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
