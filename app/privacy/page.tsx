import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { JsonLd } from '@/components/JsonLd';
import { LegalDocument } from '@/components/LegalDocument';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { Faq } from '@/components/Faq';
import { canonicalFor } from '@/lib/seo/hreflang';
import { loadLegalDocument } from '@/lib/legal/document';
import { getFaqs } from '@/lib/content/source';

const ROUTE = '/privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy — Luxe Axis',
  description:
    'How Luxe Axis collects, uses, shares and protects your personal data under the Digital Personal Data Protection Act, 2023.',
  alternates: canonicalFor(ROUTE),
};

export default async function PrivacyPage() {
  const document = loadLegalDocument('LuxeAxis_PrivacyPolicy.md');
  const faqs = await getFaqs();
  const privacyFaqs = [...faqs].filter((f) => f.id === 'contractors' || f.id === 'materials' || f.id === 'abroad');

  const highlights = [
    { title: 'DPDP 2023', desc: 'Digital Data Act Compliant' },
    { title: '256-Bit SSL', desc: 'Encrypted Data Storage' },
    { title: 'Zero Selling', desc: 'No Third-Party Data Sales' },
    { title: 'Space OS Secure', desc: 'Protected Client Feeds' },
    { title: 'Data Rights', desc: 'Right to Access & Erase' },
  ];

  const dataPillars = [
    {
      title: 'Zero Third-Party Data Sales',
      desc: 'We never sell, rent, or monetize your contact details, floorplans, or spatial preferences to external advertisers.',
    },
    {
      title: '256-Bit Encrypted Storage',
      desc: 'All project CAD files, BOQ estimates, and client communications are encrypted in transit and at rest.',
    },
    {
      title: 'Explicit Consent Protocol',
      desc: 'We collect data strictly necessary to schedule audits, manufacture joinery, and deliver turnkey projects.',
    },
    {
      title: 'Data Principal Rights',
      desc: 'Under DPDP Act 2023, you retain full rights to request data access, correction, or permanent erasure.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy — Luxe Axis',
          description: 'How Luxe Axis collects, uses, shares and protects your personal data.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-surface-deep border-b border-border-subtle/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent pointer-events-none" />

        <Container>
          <Breadcrumbs path="/privacy" labels={{ 'privacy': "Privacy Policy" }} />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                DPDP Act 2023 Compliant
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.1] tracking-[var(--font-tracking-tight)] text-on-surface font-bold">
              Data Privacy & <br />
              <span className="text-accent">Protection Policy</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium leading-relaxed max-w-3xl">
              How Luxe Axis collects, uses, stores, and protects your personal and spatial data under the Digital Personal Data Protection Act, 2023. Transparent, secure, and respectful by default.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="#document" size="lg">
                Read Full Clauses ↓
              </Button>
              <Button as="a" href="/book-audit" variant="secondary" size="lg">
                Book Free Design Audit →
              </Button>
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">DPDP 2023</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Act Compliant</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">256-Bit</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">SSL Encryption</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">0%</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Data Sales</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">Space OS</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Secure Portal</span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">100%</strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">Transparent</span>
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

      {/* 3. Data Protection Pillars */}
      <Section
        id="pillars"
        eyebrow="Privacy Guarantees"
        title="Four Pillars of Data Protection"
        lede="How we safeguard your personal details and architectural floorplans."
      >
        <Grid cols={2} gap={6}>
          {dataPillars.map((pillar) => (
            <div key={pillar.title} className="lx-liquid-glass rounded-2xl p-6 border border-accent/30">
              <h3 className="font-display text-h4 font-bold text-on-surface mb-2">{pillar.title}</h3>
              <p className="text-small text-on-surface-2 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Official Legal Document Section */}
      <Section
        id="document"
        eyebrow="Statutory Document"
        title="Full Privacy Policy Clauses"
        lede="The authoritative text drafted in accordance with DPDP Act 2023."
      >
        <div className="lx-liquid-glass rounded-2xl p-8 border border-accent/30 max-w-4xl mx-auto">
          <LegalDocument document={document} />
        </div>
      </Section>

      {/* 5. FAQ Accordion */}
      <Section id="faq" eyebrow="Questions Answered" title="Privacy & Security FAQ">
        <Faq items={privacyFaqs} />
      </Section>

      {/* 6. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
