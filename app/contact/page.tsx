import { getTestimonials } from '@/lib/content/source';
import { TestimonialBand } from '@/components/sections/CTASection';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import {
  STUDIO,
  formatWindow,
  mailtoHref,
  telHref,
  whatsappHref,
} from '@/lib/content/studio';
import { Section } from '@/components/sections/Section';
import { CTASection } from '@/components/sections/CTASection';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { JsonLd } from '@/components/JsonLd';
import { canonicalFor } from '@/lib/seo/hreflang';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { CONTACT_HERO_SLIDES } from '@/lib/content/heroSlides';

const ROUTE = '/contact';

export const metadata: Metadata = {
  title: 'Contact & Design Experience Studio | Luxe Axis Chennai',
  description:
    'Talk to a senior interior designer in Chennai. Book a free design audit, visit our Nungambakkam experience studio, or message our principal team on WhatsApp.',
  alternates: canonicalFor(ROUTE),
};

export default async function ContactPage() {
  const highlights = [
    {
      title: 'Direct Phone',
      desc: STUDIO.telephone ? STUDIO.telephone.display : 'Available 9am–6pm',
    },
    { title: 'WhatsApp Instant', desc: 'Quick Architectural Inquiry' },
    { title: 'Dedicated Emails', desc: 'Enquiries & Support Inboxes' },
    { title: 'Experience Studio', desc: 'Nungambakkam, Chennai' },
    { title: '2-Hour SLA', desc: 'Fast Response Window' },
  ];

  const studios = [
    {
      title: 'Flagship Experience Studio',
      location: 'Nungambakkam, Chennai',
      address: 'Khader Nawaz Khan Road, Nungambakkam, Chennai 600006',
      hours: 'Mon – Sat: 10:00 AM – 7:00 PM (By Appointment)',
      desc: 'Explore full-scale material libraries, Calacatta marble slabs, Italian joinery samples, and photorealistic 3D VR simulation lounge.',
    },
    {
      title: 'Adyar Architectural Office',
      location: 'Adyar, Chennai',
      address: 'Lattice Bridge Road, Adyar, Chennai 600020',
      hours: 'Mon – Fri: 9:30 AM – 6:30 PM',
      desc: 'Our central design studio for Vastu-Tech floorplan audits, 2D CAD engineering, and client project review sessions.',
    },
    {
      title: 'OMR Manufacturing & Logistics Hub',
      location: 'OMR, Chennai',
      address: 'Perungudi Industrial Estate, OMR, Chennai 600096',
      hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
      desc: 'State-of-the-art automated CNC woodworking factory and quality control warehouse for modular cabinetry assembly.',
    },
  ];

  const whyContact = [
    {
      num: '01',
      title: 'No Obligation, Zero Hard Sell',
      desc: 'Our initial design audit is purely consultative. We analyze your layout, Vastu alignment, and budget without pushy sales tactics.',
    },
    {
      num: '02',
      title: 'Direct Access to Principal Designers',
      desc: 'Speak directly with experienced interior architects who manage your project from initial CAD to final key handover.',
    },
    {
      num: '03',
      title: 'Transparent Itemized BOQ Estimate',
      desc: 'Receive a detailed component-by-component cost estimate locked in writing with zero hidden cost escalations.',
    },
    {
      num: '04',
      title: '3D Spatial VR Walkthrough',
      desc: 'Experience your future home layout in photorealistic 4K VR before signing a contract or laying a single tile.',
    },
  ];

  const testimonials = await getTestimonials();

  const faqs = [
    {
      q: 'Do I need an appointment to visit the Nungambakkam Experience Studio?',
      a: 'Yes. To ensure a dedicated principal designer is available to guide you through material samples and 3D VR walkthroughs, we recommend booking an appointment.',
    },
    {
      q: 'Is the initial site visit and design consultation audit really free?',
      a: 'Yes. Our initial 60-minute site audit and layout assessment in Chennai are 100% free with zero obligation.',
    },
    {
      q: 'How quickly does the team respond to messages and emails?',
      a: 'During working hours (9 AM – 6 PM), we reply within 2 hours. WhatsApp messages and form audits submitted after hours are addressed the next morning.',
    },
    {
      q: 'Can NRI clients arrange virtual remote consultation calls?',
      a: 'Yes. We schedule remote Zoom/Google Meet VR consultations tailored to PST, EST, GMT, GST, SGT, or AEST time zones.',
    },
  ];

  return (
    <main id="main" tabIndex={-1}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact & Design Experience Studio | Luxe Axis Chennai',
          description:
            'Talk to a senior interior designer in Chennai. Book a free design audit or message our team.',
          url: ROUTE,
        }}
      />

      {/* 1. Hero Stage & Breadcrumbs with Ken Burns Background */}
      <section className="relative overflow-hidden pt-12 pb-16 min-h-[82vh] flex flex-col justify-center bg-surface-deep border-b border-border-subtle/40 isolate">
        <HeroBackground slides={CONTACT_HERO_SLIDES} overlay="grid" />

        <Container className="relative z-10">
          <Breadcrumbs path="/contact" />

          <Stack gap={6} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-ui text-overline uppercase tracking-wider text-accent font-bold">
                Direct Studio Access
              </span>
            </div>

            <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface font-bold drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Connect With Our <br />
              <span className="text-accent">Architectural & Design Studio</span>
            </h1>

            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Talk directly to a senior interior designer. Book a free 60-minute
              site audit, visit our Flagship Experience Studio in Nungambakkam,
              or message our principal team on WhatsApp.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button as="a" href="/book-audit" size="lg" className="shadow-2xl">
                Book Free Design Audit
              </Button>
              {STUDIO.whatsapp && (
                <Button
                  as="a"
                  href={whatsappHref(STUDIO.whatsapp)}
                  variant="secondary"
                  size="lg"
                  className="bg-surface-raised/90 border border-accent/30 backdrop-blur-md"
                >
                  Message Us on WhatsApp →
                </Button>
              )}
            </div>

            {/* Key Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-8 border-t border-border-subtle/50">
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  100% Free
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Design Audit
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  2 Hours
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Max Response Time
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  3 Locations
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Chennai Studios
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  Direct
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  WhatsApp Access
                </span>
              </div>
              <div>
                <strong className="block font-display text-h3 text-accent font-bold">
                  4.9 ★
                </strong>
                <span className="text-overline text-on-surface-muted uppercase tracking-wider">
                  Google Rating
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

      {/* 3. Studio Locations */}
      <Section
        id="studios"
        eyebrow="Physical Presence"
        title="Our Chennai Studios & Factory"
        lede="Visit our experience centers to see full-scale material mockups and Italian joinery finishes."
      >
        <Grid cols={3} gap={6}>
          {studios.map((st) => (
            <div
              key={st.title}
              className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-1 rounded bg-accent/15 text-accent font-ui text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">
                  📍 {st.location}
                </span>
                <h3 className="font-display text-h3 font-bold text-on-surface mb-2">
                  {st.title}
                </h3>
                <address className="not-italic text-small text-on-surface-2 mb-3 leading-relaxed">
                  {st.address}
                </address>
                <p className="text-[12px] text-accent font-medium mb-3">
                  🕒 {st.hours}
                </p>
                <p className="text-small text-on-surface-muted leading-relaxed mb-4">
                  {st.desc}
                </p>
              </div>
              <Button
                as="a"
                href="/book-audit"
                variant="secondary"
                className="w-full justify-center"
              >
                Schedule Studio Visit →
              </Button>
            </div>
          ))}
        </Grid>
      </Section>

      {/* 4. Direct Channels Section */}
      <Section
        id="channels"
        eyebrow="Direct Communication"
        title="Contact Channels & Office Details"
        lede="Reach our team directly via phone, WhatsApp, email, or visit."
      >
        <Grid cols={2} gap={6}>
          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 space-y-6">
            {STUDIO.telephone && (
              <div>
                <h3 className="font-ui text-overline uppercase tracking-wider text-accent font-bold mb-1">
                  Telephone (Direct Line)
                </h3>
                <p className="text-h4 font-display font-bold text-on-surface">
                  <Link href={telHref(STUDIO.telephone)} variant="inline">
                    {STUDIO.telephone.display}
                  </Link>
                </p>
                <span className="text-small text-on-surface-muted">
                  Mon – Sat, 9:00 AM – 6:00 PM IST
                </span>
              </div>
            )}

            {STUDIO.whatsapp && (
              <div>
                <h3 className="font-ui text-overline uppercase tracking-wider text-accent font-bold mb-1">
                  WhatsApp Instant Inquiry
                </h3>
                <p className="text-h4 font-display font-bold text-on-surface">
                  <Link href={whatsappHref(STUDIO.whatsapp)} variant="inline">
                    Message {STUDIO.whatsapp.display}
                  </Link>
                </p>
                <span className="text-small text-on-surface-muted">
                  Instant response during business hours
                </span>
              </div>
            )}

            {STUDIO.responseWindow && (
              <div>
                <h3 className="font-ui text-overline uppercase tracking-wider text-accent font-bold mb-1">
                  Response SLA
                </h3>
                <p className="text-body font-medium text-on-surface">
                  {formatWindow(STUDIO.responseWindow)}
                </p>
                <span className="text-small text-on-surface-muted">
                  Enquiries after 6 PM are answered next morning
                </span>
              </div>
            )}
          </div>

          <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 space-y-6">
            {STUDIO.email && (
              <div>
                <h3 className="font-ui text-overline uppercase tracking-wider text-accent font-bold mb-2">
                  Email Communications
                </h3>
                <div className="space-y-2">
                  <p className="text-small text-on-surface-2">
                    <strong className="text-on-surface">
                      New Project Enquiries:
                    </strong>{' '}
                    <Link
                      href={mailtoHref(STUDIO.email.general)}
                      variant="inline"
                    >
                      {STUDIO.email.general}
                    </Link>
                  </p>
                  <p className="text-small text-on-surface-2">
                    <strong className="text-on-surface">
                      Existing Client Support:
                    </strong>{' '}
                    <Link
                      href={mailtoHref(STUDIO.email.support)}
                      variant="inline"
                    >
                      {STUDIO.email.support}
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {STUDIO.address && (
              <div>
                <h3 className="font-ui text-overline uppercase tracking-wider text-accent font-bold mb-2">
                  Head Office Address
                </h3>
                <address className="not-italic text-small text-on-surface-2 leading-relaxed">
                  {STUDIO.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="text-small text-on-surface-muted mt-2">
                  Visits by appointment — please arrange prior to arrival.
                </p>
              </div>
            )}
          </div>
        </Grid>
      </Section>

      {/* 5. Why Contact Us */}
      <Section
        id="why-contact"
        eyebrow="Consultation Standard"
        title="What to Expect When You Contact Us"
        lede="We believe in empirical design advice over high-pressure sales pitches."
      >
        <Grid cols={2} gap={6}>
          {whyContact.map((item) => (
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

      {/* 6. Process */}
      <ProcessSteps />

      {/* 7. Testimonials */}
      <TestimonialBand testimonials={testimonials} />

      {/* 8. FAQ Accordion */}
      <Section
        id="faq"
        eyebrow="Questions Answered"
        title="Contact & Studio FAQ"
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

      {/* 9. Conversion CTA Section */}
      <CTASection />
    </main>
  );
}
