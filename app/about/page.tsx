import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { canonicalFor } from '@/lib/seo/hreflang';
import { STUDIO, addressOneLine } from '@/lib/content/studio';

const ROUTE = '/about';

export const metadata: Metadata = {
  title: 'About Luxe Axis | Chennai’s Intelligent Interior Design Company',
  description:
    'Luxe Axis is a technology-native interior design company in Chennai. The philosophy, values and positioning behind spaces that combine AI precision with human craft.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/about` (Spec §2.2), rebuilt from the studio's own content pack
 * (`docs/Pages/LuxeAxis_Web_02_About_and_Process.md`).
 *
 * This was the thinnest page on the site, and honestly so: an About page is
 * made of company facts, and none had been supplied. The studio has since
 * provided its story, mission, vision, purpose and values — all of which are
 * *positions* rather than records, so they can be published as written.
 *
 * That distinction still governs the bottom of the page. A position ("we
 * believe AI should assist") is the studio's to assert. A record — founding
 * year, team size, credentials — is a fact a journalist, a procurement form or
 * a client's lawyer could rely on, and those remain named as outstanding
 * rather than written.
 *
 * Two of them stopped being outstanding when the studio supplied its address
 * and statutory identifiers, and were still rendering as "to be published"
 * here while the footer printed them on the same screen. Both now read from
 * `lib/content/studio.ts`, so there is one source and it cannot drift again.
 */

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

/**
 * Mission, vision and purpose are statements of intent. The promise is the one
 * a client can actually hold the studio to, and its terms are published in full
 * on /pricing rather than left as a slogan here.
 */
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

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            About Luxe Axis
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            We believe the spaces you inhabit shape who you become.
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            So we design them with intelligence, honesty and care — spaces that make life measurably
            better, delivered the way modern life demands.
          </p>
        </Stack>
      </Container>

      <Section id="story" eyebrow="Our story" title="A design company built for how India lives now">
        <Stack gap={4} className="max-w-measure text-on-surface-2">
          <p>
            Interior design in India has long been split between two worlds. On one side, talented
            boutique studios — deeply personal, but often slow, opaque about cost, and hard to
            scale. On the other, large platforms — fast and predictable, but templated, impersonal,
            and quick to cut corners.
          </p>
          <p>
            Luxe Axis was founded on a simple conviction: you shouldn’t have to choose. Technology,
            used with restraint and taste, can give you the best of both — the soul of a boutique
            studio with the transparency, speed and reliability of a company engineered for 2026.
          </p>
          <p>
            We are Chennai-born and Chennai-proud. We design for how South India actually lives —
            for joint families and festivals, for Chennai’s heat and humidity, for Vastu that
            deserves to be respected rather than dismissed. And we back every project with something
            the industry rarely offers: a written promise.
          </p>
        </Stack>
      </Section>

      <Section id="intent" eyebrow="Why we exist" title="Mission, vision and purpose">
        <dl className="grid max-w-measure gap-5">
          {INTENT.map((item) => (
            <div key={item.label} className="border-l-regular border-accent pl-5">
              <dt className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
                {item.label}
              </dt>
              <dd className="mt-2 text-on-surface-2">{item.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="values"
        eyebrow="What we stand for"
        title="The five principles behind every decision"
      >
        <Grid cols={3} gap={5}>
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-border-subtle bg-surface-raised p-6"
            >
              <Stack gap={3}>
                <h3 className="font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
                  {value.title}
                </h3>
                <p className="text-small text-on-surface-2">{value.body}</p>
              </Stack>
            </div>
          ))}
        </Grid>
      </Section>

      <Section
        id="positioning"
        eyebrow="Our positioning"
        title="Intelligent Premium — a category of one"
        lede="More technologically advanced than boutique studios, and far more personalised than aggregator platforms."
      >
        <p className="max-w-measure text-on-surface-2">
          That means mid-premium to premium pricing that stays accessible — not luxury-only. An
          AI-first workflow that accelerates without cheapening. Bespoke personalisation on every
          project, never a template. Technology-accelerated timelines. And sustainable material
          options built in from the start.
        </p>
      </Section>

      <Section
        id="studio"
        eyebrow="The studio"
        title="Who we are"
        lede="The part of an About page that has to be true rather than well written."
      >
        <Stack gap={3} className="max-w-measure">
          {/* Read from the same place the footer reads them, so a statutory
              identifier cannot say one thing here and another there. */}
          {STUDIO.address && (
            <p className="text-small text-on-surface-2">
              <span className="text-on-surface-muted">Studio: </span>
              {addressOneLine(STUDIO.address)}
            </p>
          )}
          {STUDIO.cin && (
            <p className="text-small text-on-surface-2">
              <span className="text-on-surface-muted">CIN: </span>
              <span className="font-mono">{STUDIO.cin}</span>
            </p>
          )}
          {STUDIO.gst && (
            <p className="text-small text-on-surface-2">
              <span className="text-on-surface-muted">GSTIN: </span>
              <span className="font-mono">{STUDIO.gst}</span>
            </p>
          )}

          {/* Still records nobody has supplied. An invented founding year or
              team size is a fabricated company fact, not a placeholder — and
              the studio's own content pack marks the team section POPULATE for
              the same reason. */}
          {['Founded', 'The team', 'Credentials and memberships'].map((fact) => (
            <p key={fact} className="text-small">
              <ToBePublished label={fact} />
            </p>
          ))}

          <div className="pt-2">
            <Button as="a" href="/book-audit" variant="secondary">
              Talk to a designer
            </Button>
          </div>
        </Stack>
      </Section>

      <CTASection />
    </main>
  );
}
