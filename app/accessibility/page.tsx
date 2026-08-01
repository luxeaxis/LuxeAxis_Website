import type { Metadata } from 'next';
import { Container, Stack } from '@/components/layout';
import { Icon } from '@/components/Icon';
import { Link } from '@/components/Link';
import { ToBePublished } from '@/components/ToBePublished';
import { Section } from '@/components/sections/Section';
import { canonicalFor } from '@/lib/seo/hreflang';

const ROUTE = '/accessibility';

export const metadata: Metadata = {
  title: 'Accessibility — Luxe Axis',
  description:
    'What this site commits to on accessibility, what is tested automatically, and what is still outstanding.',
  alternates: canonicalFor(ROUTE),
};

/**
 * `/accessibility` (Spec §2.2).
 *
 * Unusually for the pages shipped in this pass, most of this one is verifiably
 * TRUE rather than pending — because the claims are about the codebase, and the
 * codebase is right here.
 *
 * Every commitment below is enforced by something in the repo: the WCAG 2.2 AA
 * target is the spec's own gate, the automated axe run covers the listed
 * routes on every CI run, and the keyboard and reduced-motion behaviour each
 * have their own e2e specs. Writing an accessibility statement that claims more
 * than the tests check would be the same class of error as inventing a
 * statistic, so this one deliberately claims exactly what is measured — and
 * says plainly what is not.
 *
 * The honest gaps are named too: automated testing catches a minority of WCAG
 * failures, and no assistive-technology user has tested this site.
 */

const TESTED = [
  'Every page is reachable and operable by keyboard alone, including the audit form.',
  'A skip link is the first focusable element on every page, and every page has a #main target.',
  'Colour is never the only way information is conveyed.',
  'Text contrast is checked against WCAG AA in both themes, including over translucent surfaces.',
  'Everything that moves is switched off under prefers-reduced-motion.',
  'Automated axe checks run against the home page, pricing, residential, book-audit, the intelligence pages, process, NRI, commercial, about, journal, the style reference and the 404 — on every change.',
] as const;

const OUTSTANDING = [
  'Testing with real screen-reader users',
  'A published conformance report',
  'A contact route for reporting an accessibility problem',
] as const;

export default function AccessibilityPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-section-y">
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Accessibility
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            What this site commits to
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            We build to WCAG 2.2 Level AA. Accessibility is a blocking check here rather than a
            review note: a change that introduces a serious or critical violation does not ship.
          </p>
        </Stack>
      </Container>

      <Section
        id="tested"
        eyebrow="Checked automatically"
        title="What is enforced on every change"
        lede="Each of these is a test that has to pass, not an intention."
      >
        <ul className="flex max-w-measure flex-col gap-3">
          {TESTED.map((item) => (
            <li key={item} className="flex items-start gap-3 text-on-surface-2">
              <Icon name="check" size="sm" decorative className="mt-1 shrink-0 text-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="limits"
        eyebrow="Being straight about it"
        title="What automated testing does not catch"
        lede="Automated checks find a minority of accessibility problems. They cannot tell whether a heading is meaningful, whether alt text says the right thing, or whether a flow makes sense to somebody using a screen reader for the first time."
      >
        <Stack gap={3} className="max-w-measure">
          {OUTSTANDING.map((item) => (
            <p key={item} className="text-small">
              <ToBePublished label={item} />
            </p>
          ))}
          <p className="text-on-surface-2">
            If something on this site does not work for you, we would rather hear about it than
            not. Until a dedicated route is published, please use the{' '}
            <Link href="/book-audit" variant="inline">
              enquiry form
            </Link>{' '}
            and say so in the notes.
          </p>
        </Stack>
      </Section>
    </main>
  );
}
