import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ToBePublished } from '@/components/ToBePublished';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Faq } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { STUDIO, addressOneLine } from '@/lib/content/studio';
import { getFaqs, getTestimonials } from '@/lib/content/source';

const ROUTE = '/about';

export const metadata: Metadata = {
  title: 'About Luxe Axis | Chennai’s Intelligent Interior Design Studio',
  description:
    'Luxe Axis is a technology-native interior design studio in Chennai. Combining AI spatial precision with boutique craftsmanship and radical BOQ transparency.',
  alternates: canonicalFor(ROUTE),
};

const VALUES = [
  {
    title: 'Spacefulness',
    body: 'Every design decision respects and maximises the human experience of space. Not just how a room looks — how it feels to live in, move through, and come home to.',
  },
  {
    title: 'Intelligent Elegance',
    body: 'Beauty is our baseline, but never guesswork. Our aesthetics are backed by data, ergonomics and environmental science — so a space is as comfortable and functional as it is beautiful.',
  },
  {
    title: 'Radical Transparency',
    body: 'No hidden costs. Clear timelines. An open process you can follow in real time. Trust isn’t something we ask for; it’s something we design in.',
  },
  {
    title: 'Sustainable by Default',
    body: 'Every project starts from eco-conscious material choices. Sustainability is our default setting, not a premium add-on.',
  },
  {
    title: 'Technology Humility',
    body: 'AI assists; humans decide and create. Our technology exists to free our designers to do their most human, most valuable work — understanding you.',
  },
] as const;

const INTENT = [
  {
    label: 'Mission',
    body: 'To transform every space — residential or commercial — into a living expression of its inhabitant’s identity, powered by intelligent design and executed with uncompromising craft.',
  },
  {
    label: 'Vision',
    body: 'To be South India’s most trusted and innovative space intelligence company by 2030, setting the benchmark for how AI, design and human experience converge.',
  },
  {
    label: 'Purpose',
    body: 'We believe that the spaces people inhabit shape who they become. We design spaces that make people’s lives measurably better.',
  },
  {
    label: 'Promise',
    body: 'Delivered on time, transparent in cost, extraordinary in quality — or we make it right.',
  },
] as const;

export default async function AboutPage() {
  const faqs = await getFaqs();
  const aboutFaqs = [...faqs].filter(
    (f) => f.id === 'contractors' || f.id === 'materials' || f.id === 'abroad',
  );

  const highlights = [
    { title: 'Chennai Born', desc: 'Designed for South Indian Living' },
    { title: 'Radical Honesty', desc: 'Itemized BOQ Price Guarantee' },
    { title: 'Vastu-Tech Native', desc: 'Solar Compass Spatial Alignment' },
    { title: 'Space OS Portal', desc: '4K CCTV Daily Progress Updates' },
    { title: 'Flat 10-Yr Warranty', desc: 'Written Structural Guarantee' },
  ];

  const testimonials = await getTestimonials();

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Luxe Axis | Chennai’s Intelligent Interior Design Studio',
          description:
            'Luxe Axis is a technology-native interior design studio in Chennai.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/about" labels={{ about: 'About Us' }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                South India’s Space Intelligence Studio
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              We Believe the Spaces You Inhabit <br />
              <span className="text-accent">Shape Who You Become</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              Designing spaces with spatial intelligence, radical honesty, and
              South Indian cultural care. Powered by AI precision and executed
              with boutique craftsmanship in Chennai.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg">
                Book Free Design Audit
              </Button>
              <Button as="a" href="/contact" variant="secondary" size="lg">
                Visit Experience Studio →
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

      {/* 3. Our Story */}
      <Section
        id="story"
        eyebrow="Our Origins"
        title="A Design Company Built for How India Lives Now"
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 max-w-4xl">
          <Stack
            gap={4}
            className="text-on-surface-2 leading-relaxed text-body"
          >
            <p>
              Interior design in India has long been split between two extremes.
              On one side, boutique design studios — deeply personal, but often
              slow, opaque about pricing, and hard to scale. On the other, large
              platform aggregators — fast and predictable, but templated,
              impersonal, and quick to cut material corners.
            </p>
            <p>
              Luxe Axis was founded on a simple conviction: you shouldn’t have
              to compromise. Technology, used with restraint and taste, can give
              you the best of both — the soul of a boutique studio with the
              transparency, speed, and reliability of a modern space
              intelligence company.
            </p>
            <p>
              We are Chennai-born and Chennai-proud. We design for how South
              India actually lives — for multi-generational families, coastal
              climate heat and humidity, and Vastu principles that deserve to be
              respected rather than dismissed. And we back every project with
              something rare in our industry: a written, contractual promise.
            </p>
          </Stack>
        </div>
      </Section>

      {/* 4. Intent: Mission, Vision, Purpose */}
      <Section
        id="intent"
        eyebrow="Why We Exist"
        title="Mission, Vision, Purpose & Promise"
      >
        <Grid cols={2} gap={6}>
          {INTENT.map((item) => (
            <div
              key={item.label}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <Stack gap={3}>
                <div className="flex items-center justify-between">
                  <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                    {item.label}
                  </span>
                  <Badge tone="accent" icon="check">
                    Core Mandate
                  </Badge>
                </div>
                <p className="text-body text-on-surface-2 leading-relaxed">
                  {item.body}
                </p>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 5. Values & Principles */}
      <Section
        id="values"
        eyebrow="What We Stand For"
        title="The Five Principles Behind Every Decision"
        lede="Our core values guide every spatial layout, material selection, and site interaction."
      >
        <Grid cols={3} gap={6}>
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <Stack gap={3}>
                <h3 className="font-display text-h3 font-bold text-on-surface">
                  {value.title}
                </h3>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  {value.body}
                </p>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 6. Intelligent Premium Positioning */}
      <Section
        id="positioning"
        eyebrow="Market Positioning"
        title="Intelligent Premium — A Category of One"
        lede="More technologically advanced than boutique studios, and far more personalized than generic platforms."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30">
          <p className="max-w-3xl text-body text-on-surface-2 leading-relaxed mb-6">
            Intelligent Premium means transparent pricing that stays accessible.
            An AI-assisted workflow that accelerates layout optimization without
            cheapening aesthetics. Bespoke joinery on every project — never
            cookie-cutter templates. And eco-conscious materials integrated by
            default.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-subtle/40">
            <div>
              <strong className="block font-display text-h4 text-accent font-bold mb-1">
                AI-Precision
              </strong>
              <span className="text-small text-on-surface-muted">
                Vastu-Tech CAD spatial optimization
              </span>
            </div>
            <div>
              <strong className="block font-display text-h4 text-accent font-bold mb-1">
                Boutique Taste
              </strong>
              <span className="text-small text-on-surface-muted">
                Senior architect design oversight
              </span>
            </div>
            <div>
              <strong className="block font-display text-h4 text-accent font-bold mb-1">
                Factory Reliability
              </strong>
              <span className="text-small text-on-surface-muted">
                German precision joinery manufacturing
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Studio Record & Physical Locations */}
      <Section
        id="studio"
        eyebrow="Studio Governance"
        title="Our Chennai Experience Studios"
        lede="Visit our experience studios in Nungambakkam and Adyar to inspect live material mockups."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 max-w-4xl">
          <Stack gap={4}>
            {STUDIO.address && (
              <p className="text-body text-on-surface-2">
                <strong className="text-accent font-bold">
                  Flagship Studio:{' '}
                </strong>
                {addressOneLine(STUDIO.address)}
              </p>
            )}
            {STUDIO.cin && (
              <p className="text-small text-on-surface-2">
                <span className="text-on-surface-muted">
                  Corporate Identity Number (CIN):{' '}
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {STUDIO.cin}
                </span>
              </p>
            )}
            {STUDIO.gst && (
              <p className="text-small text-on-surface-2">
                <span className="text-on-surface-muted">
                  GSTIN Registration:{' '}
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {STUDIO.gst}
                </span>
              </p>
            )}

            {[
              'Founded & Legacy',
              'Senior Architectural Team',
              'Industry Memberships & Certifications',
            ].map((fact) => (
              <p key={fact} className="text-small">
                <ToBePublished label={fact} />
              </p>
            ))}

            <div className="pt-4 border-t border-border-subtle/40 flex flex-wrap gap-4">
              <Button as="a" href="/contact">
                Visit Experience Studio
              </Button>
              <Button as="a" href="/book-audit" variant="secondary">
                Book Free Design Audit →
              </Button>
            </div>
          </Stack>
        </div>
      </Section>

      {/* 8. Interactive Before & After Transformation Slider */}
      <Section
        id="transformation"
        eyebrow="Studio Portfolio"
        title="From Concept to Completed Residence"
        lede="Real 3BHK flat in Nungambakkam transformed by Luxe Axis."
      >
        <div className="max-w-4xl mx-auto">
          <BeforeAfterSlider
            beforeImage={{
              src: '/posters/persona-router.avif',
              alt: 'Bare shell residence before interior fit-out',
            }}
            afterImage={{
              src: '/posters/hero.avif',
              alt: 'Completed luxury residential interior in Chennai',
            }}
          />
        </div>
      </Section>

      {/* 9. Testimonials */}
      <TestimonialBand testimonials={testimonials} />

      {/* 10. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="About Studio FAQ">
        <Faq items={aboutFaqs} />
      </Section>

      {/* 11. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
