import type { Metadata } from 'next';
import { Container, Stack } from '@/components/layout';
import { InlineAlert } from '@/components/InlineAlert';
import { Icon } from '@/components/Icon';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/privacy';

export const metadata: Metadata = {
  title: 'Privacy — Luxe Axis',
  description:
    'What the Luxe Axis website collects, and where it goes. The full privacy statement is being prepared.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/privacy` (Spec §2.2, and the target of the Book-Audit consent checkbox).
 *
 * ## What this page does NOT do
 *
 * It does not contain a privacy policy. A privacy statement under the DPDP Act
 * is a legal instrument — it declares lawful bases, retention periods, transfer
 * arrangements, a grievance officer and data-principal rights, and a regulator
 * and a data principal are both entitled to rely on every word. Drafting one
 * from a template would not be a placeholder in the sense the rest of this site
 * uses the word; it would be the studio making binding representations that
 * nobody at the studio has approved, about processes nobody has decided.
 *
 * That is a materially different act from leaving a statistic unpublished, and
 * it is the one place on this site where writing something plausible would be
 * worse than writing nothing.
 *
 * ## What it does do
 *
 * It states, factually, what the website collects today — which is knowable,
 * because it is defined in `lib/lead/schema.ts` and `app/api/lead/route.ts`,
 * and I built both. A visitor deciding whether to tick the consent box can at
 * least see the actual fields and the actual destination. The formal statement
 * is marked as outstanding.
 *
 * The Book-Audit form should not collect personal data in production until the
 * real statement replaces this page.
 */

const COLLECTED = [
  'Your name, email address and phone number',
  'What you tell us about the space: type, approximate area, tier and location',
  'Your preferred contact method and time',
  'Anything you write in the notes field',
  'Which campaign or link brought you to the form, if any',
] as const;

export default function PrivacyPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={5} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Privacy
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            What we collect, and where it goes
          </h1>
          <InlineAlert tone="info" title="The full privacy statement is being prepared">
            This page is not yet our formal privacy statement under the Digital Personal Data
            Protection Act. What is written below is an accurate description of what this website
            does today.
          </InlineAlert>
        </Stack>
      </Container>

      <Section
        id="collected"
        eyebrow="The audit form"
        title="What the form asks for"
        lede="This is the only place on the site that collects personal data. There is no analytics, no advertising pixel and no third-party script anywhere on it."
      >
        <ul className="flex max-w-measure flex-col gap-3">
          {COLLECTED.map((item) => (
            <li key={item} className="flex items-start gap-3 text-on-surface-2">
              <Icon name="check" size="sm" decorative className="mt-1 shrink-0 text-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="where"
        eyebrow="Where it goes"
        title="What happens to it"
        lede="Submitted details are passed to the studio's own enquiry queue so a designer can reply. The site does not log the contents of the form, and does not share it with an advertising or analytics provider."
      >
        <Stack gap={3} className="max-w-measure">
          {[
            'The legal basis we rely on',
            'How long we keep enquiries',
            'Who else processes them, if anyone',
            'How to ask for your data, or its deletion',
            'Our grievance officer and how to reach them',
          ].map((item) => (
            <p key={item} className="text-small">
              <ToBePublished label={item} />
            </p>
          ))}
        </Stack>
      </Section>
    </main>
  );
}
