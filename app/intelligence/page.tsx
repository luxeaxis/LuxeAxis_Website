import { getTestimonials } from '@/lib/content/source';
import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { canonicalFor } from '@/lib/seo/hreflang';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { INTELLIGENCE_HERO_SLIDES } from '@/lib/content/heroSlides';

const ROUTE = '/intelligence';

export const metadata: Metadata = {
  title: 'Applied Spatial Intelligence, Space OS & Vastu-Tech™ | Luxe Axis Chennai',
  description:
    'Vastu-Tech™ computational alignment, Space Score™, Space OS live site tracking, and 3D Virtual Staging: proprietary technologies that eliminate interior design guesswork in Chennai.',
  keywords: [
    'vastu-tech spatial architecture',
    'space os interior portal',
    'ai interior spatial design',
    'vastu compass solar alignment chennai',
    'virtual 3d staging chennai',
  ],
  alternates: canonicalFor(ROUTE),
  openGraph: {
    title: 'Applied Spatial Intelligence & Vastu-Tech™ | Luxe Axis',
    description:
      'Proprietary technologies merging Vedic solar energy grids with modern CAD spatial precision and Space OS live site tracking.',
    url: canonicalFor(ROUTE).canonical,
    images: [
      {
        url: '/posters/intel-hero-main.png',
        width: 1200,
        height: 630,
        alt: 'Luxe Axis Applied Spatial Intelligence and Vastu-Tech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spatial Intelligence & Vastu-Tech | Luxe Axis',
    description:
      'Vastu-Tech computational alignment and Space OS live site tracking.',
    images: ['/posters/intel-hero-main.png'],
  },
};

export default async function IntelligencePage() {
  const highlights = [
    {
      title: 'Vastu-Tech AI Grid',
      desc: 'Solar Orientation & Magnetic Compass Alignment',
    },
    {
      title: 'Space Score™ Index',
      desc: '4-Pillar Wellness, Function & Eco Rating',
    },
    {
      title: 'Space OS Portal',
      desc: 'Real-time Budget, BOQ & 3D Progress Tracker',
    },
    {
      title: 'Virtual Staging',
      desc: 'Photorealistic Real-Estate B2B 8K Renders',
    },
    {
      title: 'Human Architect Verified',
      desc: 'Every AI Output Reviewed by Licensed Designers',
    },
  ];

  const capabilities = [
    {
      id: 'vastu-tech',
      name: 'Vastu-Tech AI Engine',
      tag: 'Patent-Pending',
      claim:
        'We check your plan against Vastu in seconds — then a human designer confirms it.',
      desc: 'A Vastu grid and compass are laid over your CAD floor plan. Favourable zones are marked in gold, review zones in teal, each with plain-language guidance.',
      features: [
        'India’s 1st AI Vastu compatibility checker',
        'Instant solar orientation & magnetic declination scan',
        '100% human architect verification before client delivery',
        'Non-structural micro-corrections (color, brass & spatial placement)',
      ],
      href: '/intelligence/vastu-tech',
      image: '/posters/service-vastu-tech.png',
    },
    {
      id: 'space-score',
      name: 'Space Score™ Index',
      tag: 'Proprietary Metric',
      claim:
        'A rating for any space across wellness, function, aesthetics, and sustainability.',
      desc: 'Four measures scored independently and read together, so "is this a good room?" becomes a quantifiable answer you can compare, test, and optimize.',
      features: [
        'Evaluates Wellness, Function, Aesthetics & Sustainability',
        'Acoustic sound-masking & daylight Lux-level simulation',
        'Identifies the weakest arc to focus design effort where it matters',
        'Post-occupancy verification audit included',
      ],
      href: '/intelligence/space-score',
      image: '/posters/residential-living-room-hero.png',
    },
    {
      id: 'space-os',
      name: 'Space OS Client Portal',
      tag: 'Live Dashboard',
      claim:
        'Your project live in one place — moodboard, build progress, and budget visible.',
      desc: 'The client operating system. Everything the studio knows about your project in the same view you have — including live BOQ budget tracking.',
      features: [
        'Real-time BOQ cost calculator & budget dashboard',
        'Daily 3D site progress tracking & photo logs',
        'Interactive moodboards & 4K virtual reality walkthroughs',
        'AR mobile preview for furniture & finishes',
      ],
      href: '/intelligence/space-os',
      image: '/posters/residential-3d-design-hero.png',
    },
    {
      id: 'virtual-staging',
      name: 'Virtual Real-Estate Staging',
      tag: 'Real-Estate B2B',
      claim:
        'See a room furnished and finished before anything is bought or built.',
      desc: 'B2B spatial staging for property developers and homeowners — transform empty or bare shell rooms into photorealistic 8K virtual residences.',
      features: [
        'Photorealistic 8K V-Ray rendering quality',
        '48-hour rapid render delivery',
        'Unlimited furniture, veneer & tile finish swaps',
        '360° virtual reality walkthroughs for prospective buyers',
      ],
      href: '/intelligence/virtual-staging',
      image: '/posters/apt-after-living-luxury.png',
    },
  ];

  const whyIntelligence = [
    {
      num: '01',
      title: 'Data Over Guesswork',
      desc: 'Traditional interior design relies on subjective opinions. Our algorithms simulate daylight, acoustics, and Vastu alignment using objective spatial data.',
    },
    {
      num: '02',
      title: 'Human-in-the-Loop Verification',
      desc: 'AI narrows the questions and generates options in seconds; licensed senior architects and designers refine, check, and approve every output.',
    },
    {
      num: '03',
      title: 'Radical Financial Transparency',
      desc: 'Space OS exposes your itemized BOQ budget in real-time. You see material costs, labor fees, and margins with zero hidden markups.',
    },
    {
      num: '04',
      title: 'See Before You Spend',
      desc: 'Raytraced 4K 3D models and VR walkthroughs let you experience every room before procurement or demolition starts.',
    },
  ];

  const comparison = [
    {
      traditional: 'Manual Vastu compass guesswork',
      luxe: 'AI Vastu-Tech solar orientation grid scan',
    },
    {
      traditional: 'Subjective opinion on lighting & acoustics',
      luxe: 'Space Score™ 4-pillar quantified index',
    },
    {
      traditional: 'Surprise bills & hidden cost escalations',
      luxe: 'Space OS real-time BOQ budget dashboard',
    },
    {
      traditional: 'Static 2D paper floor plans',
      luxe: 'Interactive 4K VR simulation & AR mobile preview',
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'What is Luxe Axis Applied Spatial Intelligence?',
      a: 'Applied Spatial Intelligence is our suite of four proprietary technologies — Vastu-Tech, Space Score™, Space OS, and Virtual Staging — designed to optimize space performance, predict costs, and provide total transparency.',
    },
    {
      q: 'Is there an extra charge for using Vastu-Tech or Space OS?',
      a: 'No. All four intelligence capabilities are included free for every client booking a Luxe Axis design audit or turnkey interior project.',
    },
    {
      q: 'How accurate is the AI Vastu-Tech scanner?',
      a: 'The Vastu-Tech AI aligns your CAD floor plan against precise solar orientation and magnetic declination vectors. Every AI reading is verified by a licensed senior architect before client presentation.',
    },
    {
      q: 'How does Space Score™ evaluate a room?',
      a: 'Space Score™ evaluates four independent pillars: Wellness (light & air), Function (circulation & ergonomics), Aesthetics (proportions & harmony), and Sustainability (materials & efficiency).',
    },
    {
      q: 'What can I track on Space OS?',
      a: 'Space OS provides 24/7 access to your project moodboards, daily 3D site progress photo logs, itemized BOQ budget tracking, and AR mobile finish previews.',
    },
    {
      q: 'Can real estate developers use Virtual Staging?',
      a: 'Yes. Our Virtual Staging suite is designed for developers, landlords, and sellers wanting photorealistic 8K virtual walkthroughs delivered in 48 hours.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Applied Spatial Intelligence — Luxe Axis',
          description:
            'Vastu-Tech, Space Score™, Space OS and Virtual Staging. Four proprietary technologies that predict space performance.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Section with Ken Burns & Grid Overlay */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={INTELLIGENCE_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs path="/intelligence" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Proprietary Spatial Technologies
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              The Intelligence <br />
              <span className="text-accent">Behind The Space</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Vastu-Tech, Space Score™, Space OS, and Virtual Staging. Four
              proprietary capabilities that eliminate spatial guesswork, predict
              room performance, and track your project budget in real-time.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg" className="shadow-2xl">
                Book Free Intelligence Audit
              </Button>
              <Button
                as="a"
                href="/pricing"
                variant="secondary"
                size="lg"
                className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
              >
                View BOQ Cost Engine →
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

      {/* 3. Four Core Capabilities Deep-Dive Grid */}
      <Section
        id="capabilities"
        eyebrow="Proprietary Technology Stack"
        title="Four Capabilities That Work For You"
        lede="Each capability solves a specific failure point in traditional interior design."
      >
        <Grid cols={2} gap={6}>
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] mb-4 border border-border-subtle/60">
                  <Image
                    src={cap.image}
                    alt={cap.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-accent text-surface-deep font-ui text-[10px] font-bold uppercase tracking-wider">
                    {cap.tag}
                  </span>
                </div>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-1">
                  {cap.name}
                </h3>
                <p className="text-small text-accent font-semibold mb-2">
                  &ldquo;{cap.claim}&rdquo;
                </p>
                <p className="text-small text-on-surface-2 leading-relaxed mb-4">
                  {cap.desc}
                </p>
                <ul className="space-y-1.5 text-small text-on-surface-2 border-t border-border-subtle/40 pt-3 mb-6">
                  {cap.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-accent text-[12px]">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                as="a"
                href={cap.href}
                variant="secondary"
                className="w-full justify-center"
              >
                Explore {cap.name} →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Why Applied Intelligence Matters */}
      <Section
        id="why-intelligence"
        eyebrow="Why Technology Matters"
        title="Software Narrows The Question; Designers Answer It"
        lede="Why Luxe Axis spatial intelligence transforms your project experience."
      >
        <Grid cols={2} gap={6}>
          {whyIntelligence.map((item) => (
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

      {/* 5. Before & After Slider */}
      <Section
        id="before-after"
        eyebrow="Simulated Precision"
        title="Un-Optimized Layout vs Intelligence-Engineered Space"
        lede="See how Raytraced simulation resolves spatial flaws before construction starts."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/apt-before-construction-raw.png',
              alt: 'Bare shell floor plan before spatial intelligence scan',
            }}
            afterImage={{
              src: '/posters/service-vastu-tech.png',
              alt: 'Completed intelligence-optimized interior by Luxe Axis',
            }}
          />
        </div>
      </Section>

      {/* 6. Comparison Matrix */}
      <Section
        id="comparison"
        eyebrow="Methodology Comparison"
        title="Traditional Design vs Luxe Axis Applied Intelligence"
        lede="Data-driven spatial engineering eliminates subjectivity and hidden costs."
      >
        <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 max-w-4xl mx-auto">
          <div className="space-y-4">
            {comparison.map((item) => (
              <div
                key={item.traditional}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border-subtle/40 last:border-0 last:pb-0"
              >
                <div className="p-3 rounded-lg bg-surface-deep/50 border border-border-subtle/50">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-muted font-bold block mb-1">
                    Traditional Method
                  </span>
                  <p className="text-small text-on-surface-2">
                    {item.traditional}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <span className="text-[10px] uppercase tracking-wider text-accent font-bold block mb-1">
                    Luxe Axis Intelligence
                  </span>
                  <p className="text-small text-on-surface font-medium">
                    {item.luxe}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 7. 5-Step Process */}
      <ProcessSteps />

      {/* 8. Verified Client Reviews */}
      <TestimonialBand testimonials={testimonials} />

      {/* 9. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Intelligence Technology FAQ"
        lede="Everything you need to know about our proprietary technology suite."
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
