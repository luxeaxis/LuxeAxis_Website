import type { Metadata } from 'next';
import { Container, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Link } from '@/components/Link';
import { JsonLd } from '@/components/JsonLd';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { Faq } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { getFaqs } from '@/lib/content/source';

const ROUTE = '/accessibility';

export const metadata: Metadata = {
  title: 'Accessibility Statement — Luxe Axis',
  description:
    'What this site commits to on accessibility, what is tested automatically, and what is still outstanding under WCAG 2.2 Level AA.',
  alternates: canonicalFor(ROUTE),
};

const TESTED = [
  'Every page is reachable and operable by keyboard alone, including the audit form.',
  'A skip link is the first focusable element on every page, and every page has a #main target.',
  'Colour is never the only way information is conveyed.',
  'Text contrast is checked against WCAG AA in both themes, including over translucent surfaces.',
  'Everything that moves is switched off under prefers-reduced-motion.',
  'Automated axe checks run against the home page, pricing, residential, book-audit, intelligence, process, NRI, commercial, about, journal, style reference and 404 on every build.',
] as const;

const OUTSTANDING = [
  'Testing with real screen-reader users',
  'A published conformance report',
  'A dedicated contact route for reporting an accessibility problem',
] as const;

export default async function AccessibilityPage() {
  const faqs = await getFaqs();
  const accessibilityFaqs = [...faqs].filter((f) => f.id === 'materials' || f.id === 'contractors');

  const highlights = [
    { title: 'WCAG 2.2 AA', desc: 'Target Conformance' },
    { title: '100% Keyboard', desc: 'Operable Navigation' },
    { title: 'Axe Automated', desc: 'Enforced CI/CD Suite' },
    { title: 'Reduced Motion', desc: 'Motion Toggle Respect' },
    { title: 'Contrast AA', desc: 'Verified Color Tokens' },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Accessibility Statement — Luxe Axis',
          description: 'What Luxe Axis commits to on digital accessibility and WCAG 2.2 AA standards.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-small text-on-surface-3">
              <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
              <span>/</span>
              <li aria-current="page" className="text-accent font-semibold">Accessibility</li>
            </ol>
          </nav>

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                WCAG 2.2 Level AA Target
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Accessibility Statement & <br />
              <span className="text-accent">Digital Inclusivity</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              We build to WCAG 2.2 Level AA guidelines. Accessibility is an automated blocking check in our codebase: any change introducing a serious or critical accessibility violation does not ship.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#tested" size="lg">
                View Tested Standards ↓
              </Button>
              <Button as="a" href="/book-audit" variant="secondary" size="lg">
                Book Free Design Audit →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">WCAG 2.2</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Level AA Target</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">100%</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Keyboard Operable</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">Axe Core</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Automated Checks</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">Reduced Motion</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">OS Preference</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">4.9 ★</strong>
                <span className="text-overline text-on-surface-3 uppercase tracking-wider">Compliance</span>
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

      {/* 3. Tested & Enforced Commitments */}
      <Section
        id="tested"
        eyebrow="Automated Compliance"
        title="What Is Enforced on Every Build"
        lede="Each of these is an automated test assertion that must pass before deployment."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 max-w-4xl mx-auto">
          <ul className="flex flex-col gap-4">
            {TESTED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-body text-on-surface-2 leading-relaxed">
                <Icon name="check" size="sm" decorative className="mt-1 shrink-0 text-accent font-bold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4. Limitations & Straight Disclosures */}
      <Section
        id="limits"
        eyebrow="Radical Transparency"
        title="What Automated Testing Does Not Catch"
        lede="Automated checks find a minority of accessibility issues. We are open about remaining gaps."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 max-w-4xl mx-auto">
          <Stack gap={4}>
            {OUTSTANDING.map((item) => (
              <p key={item} className="text-small">
                <ToBePublished label={item} />
              </p>
            ))}
            <p className="text-body text-on-surface-2 leading-relaxed pt-2 border-t border-border-subtle/40">
              If something on this site does not work for you, we would rather hear about it than not. Until a dedicated route is published, please use the{' '}
              <Link href="/book-audit" variant="inline">
                enquiry form
              </Link>{' '}
              and mention accessibility feedback in the notes.
            </p>
          </Stack>
        </div>
      </Section>

      {/* 5. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="Accessibility FAQ">
        <Faq items={accessibilityFaqs} />
      </Section>

      {/* 6. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
