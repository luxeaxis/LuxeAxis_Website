/**
 * Footer — full sitemap, trust row, Design Club / WhatsApp / address slots,
 * logo-primary (design system §3.3; 3D spec §2.3, §3.6 "Placement").
 *
 * A Server Component: nothing here reads state, listens for an event, or
 * needs a handler — the whole surface is static markup, so (per the brief)
 * it stays out of the client bundle entirely, unlike Header/MobileSheet.
 *
 * The studio's address, phone and WhatsApp now render from
 * `lib/content/studio.ts`; CIN, GST and the Design Club opt-in are still
 * outstanding and stay explicit "to be published" lines rather than being
 * invented. Brand policy forbids fabricated company facts, and a fake CIN or
 * GST number would be worse than an honest gap — those two are quoted on
 * invoices and checked against a government register.
 */

import { Link } from './Link';
import { Container, Grid, Stack } from './layout';
import { STUDIO, telHref, whatsappHref } from '@/lib/content/studio';

type FooterLink = { label: string; href: string };
type FooterGroup = { heading: string; links: readonly FooterLink[] };

// Verbatim from the sitemap (docs/specs/LuxeAxis_3D_Website_Spec.md §2.2) —
// no invented copy. Grouped for readability; the grouping itself isn't from
// the spec, the routes and labels are.
const SITEMAP: readonly FooterGroup[] = [
  {
    heading: 'Residential',
    links: [
      { label: 'Overview', href: '/residential' },
      { label: 'Essential', href: '/residential/essential' },
      { label: 'Signature', href: '/residential/signature' },
      { label: 'Elite', href: '/residential/elite' },
    ],
  },
  {
    heading: 'Commercial',
    links: [
      { label: 'Overview', href: '/commercial' },
      { label: 'Workplace', href: '/commercial/workplace' },
      { label: 'Retail & Hospitality', href: '/commercial/retail-hospitality' },
      { label: 'Healthcare', href: '/commercial/healthcare' },
    ],
  },
  {
    heading: 'Digital & Intelligence',
    links: [
      { label: 'Remote design', href: '/digital' },
      { label: 'Intelligence overview', href: '/intelligence' },
      { label: 'Space OS', href: '/intelligence/space-os' },
      { label: 'Vastu-Tech', href: '/intelligence/vastu-tech' },
      { label: 'Space Score', href: '/intelligence/space-score' },
      { label: 'Virtual Staging', href: '/intelligence/virtual-staging' },
    ],
  },
  {
    heading: 'Studio',
    links: [
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Process', href: '/process' },
      { label: 'About', href: '/about' },
      { label: 'Journal', href: '/journal' },
    ],
  },
  {
    heading: 'NRI & Contact',
    links: [
      { label: 'NRI hub', href: '/nri' },
      { label: 'Contact', href: '/contact' },
      { label: 'Book a design audit', href: '/book-audit' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
];

// One heading treatment for both the sitemap group headings and the
// standalone slot headings (Design Club / WhatsApp / address) — same
// "eyebrow" role, no reason for two components.  `--font-tracking-wider`
// (0.18em) is the token whose own description names this exact use
// ("Wordmark / eyebrow style" — styles/tokens.css), matching the Eyebrow
// treatment on /style.
function Heading({ children }: { children: string }) {
  return (
    <h2 className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
      {children}
    </h2>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-hairline border-border-subtle bg-surface-deep">
      <Container className="py-section-y">
        <Stack gap={9}>
          {/* Logo-primary slot (spec §3.6 Placement: "Footer: logo-primary
              with tagline"). Text stand-in — see Header.tsx's logo comment;
              same blocker (vectorising the supplied raster). */}
          <Stack gap={2}>
            <span className="font-display text-[length:var(--typography-h2-font-size)] tracking-[var(--font-tracking-wider)]">
              <span className="text-accent">LUXE</span> <span className="text-on-surface">AXIS</span>
            </span>
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted">
              Designing Dreams
            </p>
          </Stack>

          <nav aria-label="Site map">
            <Grid cols={4} gap={6}>
              {SITEMAP.map((group) => (
                <Stack key={group.heading} gap={3} as="div">
                  <Heading>{group.heading}</Heading>
                  <Stack as="ul" gap={2} className="list-none">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} variant="standalone" className="text-small">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Grid>
          </nav>

          <Grid cols={3} gap={6}>
            {/* Design Club opt-in slot — no working form yet (that's a Field/
                Button + lead-capture pattern for a later phase), so this is
                an honest "coming soon", not a form that submits nowhere. */}
            <Stack gap={2}>
              <Heading>Design Club</Heading>
              <p className="text-small text-on-surface-2">Newsletter and Design Club opt-in — coming soon.</p>
            </Stack>

            <Stack gap={2}>
              <Heading>Talk to us</Heading>
              {STUDIO.telephone && (
                // `tel:` and a wa.me link rather than plain text. On the mobile
                // devices most of this audience uses, a tappable number is the
                // difference between an enquiry and a copy-paste nobody
                // finishes.
                <p className="text-small text-on-surface-2">
                  <Link href={telHref(STUDIO.telephone)} variant="inline" className="text-small">
                    {STUDIO.telephone.display}
                  </Link>
                </p>
              )}
              {STUDIO.whatsapp && (
                <p className="text-small text-on-surface-2">
                  <Link
                    href={whatsappHref(STUDIO.whatsapp)}
                    variant="inline"
                    className="text-small"
                  >
                    WhatsApp
                  </Link>
                </p>
              )}
            </Stack>

            <Stack gap={2}>
              <Heading>Chennai studio</Heading>
              {STUDIO.address ? (
                // A real `<address>` element: it is the semantic home for the
                // contact details of the document it sits in, which is exactly
                // what a footer studio address is. Rendered from the supplied
                // lines verbatim rather than reflowed — tidying an address is
                // how a floor number quietly goes missing.
                <address className="text-small not-italic text-on-surface-2">
                  {STUDIO.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              ) : (
                <p className="text-small text-on-surface-2">Address to be published.</p>
              )}
            </Stack>
          </Grid>

          {/* Trust row — CIN/GST/DPDPA (spec §3.3, §9.2). Each entry is either
              the real registered value or an explicit "to be published"; never
              a fabricated one. CIN and GST are quoted on invoices and checked
              against a government register, so a plausible-looking placeholder
              would be a false company record rather than a visible gap.
              `font-mono` on the values: both are transcribed by people into
              forms, and a proportional font makes 0/O and 1/l ambiguous. */}
          <Stack gap={3} className="border-t-hairline border-border-subtle pt-6">
            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-small text-on-surface-muted">
              <div className="flex gap-1">
                <dt>CIN</dt>
                <dd className="font-mono">{STUDIO.cin ?? 'to be published'}</dd>
              </div>
              <div className="flex gap-1">
                <dt>GST</dt>
                <dd className="font-mono">{STUDIO.gst ?? 'to be published'}</dd>
              </div>
              <div className="flex gap-1">
                <dt>DPDPA</dt>
                {/* Still outstanding: /privacy describes what the site
                    collects, but the formal statement is not written. */}
                <dd>privacy statement to be published</dd>
              </div>
            </dl>
            <p className="text-small text-on-surface-muted">
              © {year} Luxe Axis Private Limited, Chennai, Tamil Nadu.
            </p>
          </Stack>
        </Stack>
      </Container>
    </footer>
  );
}
