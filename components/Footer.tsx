import { Link } from './Link';
import { Logo } from './Logo';
import { Container, Grid, Stack } from './layout';
import { STUDIO, telHref, whatsappHref } from '@/lib/content/studio';

type FooterLink = { label: string; href: string };
type FooterGroup = { heading: string; links: readonly FooterLink[] };

const SITEMAP: readonly FooterGroup[] = [
  {
    heading: 'Residential',
    links: [
      { label: 'Overview', href: '/residential' },
      { label: 'Essential', href: '/residential/essential' },
      { label: 'Signature', href: '/residential/signature' },
      { label: 'Elite', href: '/residential/elite' },
      { label: 'Home Interiors', href: '/residential/home-interiors' },
      { label: 'Modular Kitchens', href: '/residential/modular-kitchen' },
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

function Heading({ children }: { children: string }) {
  return (
    <h2 className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-bold mb-1">
      {children}
    </h2>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-surface-deep/98 text-on-surface border-t border-accent/30 shadow-[0_-15px_50px_rgba(0,0,0,0.5)]">
      {/* Top glowing ambient gradient divider line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent pointer-events-none" />

      <Container className="py-16">
        <Stack gap={9}>
          {/* Top Brand Showcase Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-border-subtle/50">
            <Stack gap={2}>
              <span className="flex items-center gap-4">
                <Logo className="h-12 w-auto text-accent" />
                <span className="font-display text-h2 tracking-[var(--font-tracking-wider)] font-bold">
                  <span className="text-accent">LUXE</span>{' '}
                  <span className="text-accent">AXIS</span>
                </span>
              </span>
              <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted font-semibold">
                Designing Dreams • Architectural Luxury & Vastu-Tech Studio
              </p>
            </Stack>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-overline uppercase tracking-wider bg-accent/10 border border-accent/30 text-accent font-bold">
                100% Price-Lock SLA
              </span>
              <span className="px-3 py-1 rounded-full text-overline uppercase tracking-wider bg-surface-raised border border-border-subtle text-on-surface-2 font-bold">
                ISO 9001:2015 Studio
              </span>
            </div>
          </div>

          {/* Main Sitemap Grid */}
          <nav aria-label="Site map">
            <Grid cols={4} gap={6} className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {SITEMAP.map((group) => (
                <Stack key={group.heading} gap={3} as="div">
                  <Heading>{group.heading}</Heading>
                  <Stack as="ul" gap={2} className="list-none">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} variant="standalone" className="text-small text-on-surface-2 hover:text-accent transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Grid>
          </nav>

          {/* Modern Action Cards Row (Design Club, Talk to Us, Studio Address) */}
          <Grid cols={3} gap={6} className="grid-cols-1 md:grid-cols-3">
            {/* Card 1: Design Club & Digital Packages */}
            <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <Stack gap={2}>
                <Heading>Design Club</Heading>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  Private trade network & remote architectural packages — coming soon for newsletter opt-in.
                </p>
                <Stack as="ul" gap={2} className="list-none pt-2">
                  <li>
                    <Link href="/digital" variant="standalone" className="text-small text-accent hover:underline">
                      Digital Hub & VIP Club →
                    </Link>
                  </li>
                  <li>
                    <Link href="/digital/starter" variant="standalone" className="text-small text-on-surface-2 hover:text-accent">
                      Starter Package (₹25k)
                    </Link>
                  </li>
                  <li>
                    <Link href="/digital/pro" variant="standalone" className="text-small text-on-surface-2 hover:text-accent">
                      Pro Package (₹45k)
                    </Link>
                  </li>
                  <li>
                    <Link href="/digital/premium" variant="standalone" className="text-small text-on-surface-2 hover:text-accent">
                      Premium VIP (₹75k)
                    </Link>
                  </li>
                </Stack>
              </Stack>
            </div>

            {/* Card 2: Contact & Immediate Consultation */}
            <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <Stack gap={3}>
                <Heading>Talk to us</Heading>
                <p className="text-small text-on-surface-2 leading-relaxed">
                  Connect directly with our senior architectural team for immediate project enquiries and studio bookings.
                </p>
                {STUDIO.telephone && (
                  <p className="text-small text-on-surface-2">
                    <Link href={telHref(STUDIO.telephone)} variant="inline" className="text-small text-accent font-semibold">
                      {STUDIO.telephone.display}
                    </Link>
                  </p>
                )}
                {STUDIO.whatsapp && (
                  <p className="text-small text-on-surface-2">
                    <Link
                      href={whatsappHref(STUDIO.whatsapp)}
                      variant="inline"
                      className="text-small font-semibold inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      WhatsApp
                    </Link>
                  </p>
                )}
              </Stack>
            </div>

            {/* Card 3: Physical Studio Location */}
            <div className="lx-liquid-glass rounded-2xl p-6 border border-accent/30 flex flex-col justify-between">
              <Stack gap={3}>
                <Heading>Chennai studio</Heading>
                {STUDIO.address ? (
                  <address className="text-small not-italic text-on-surface-2 leading-relaxed">
                    {STUDIO.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                ) : (
                  <p className="text-small text-on-surface-2">Address to be published.</p>
                )}
                <div className="pt-2">
                  <span className="text-overline text-accent font-bold uppercase tracking-wider">
                    Studio Hours: Mon–Sat 9:30 AM–7:30 PM
                  </span>
                </div>
              </Stack>
            </div>
          </Grid>

          {/* Compliance, Tax Identifiers & Copyright Bar */}
          <div className="border-t border-border-subtle/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-on-surface-muted">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-raised/80 border border-border-subtle">
                <dt className="text-overline font-bold uppercase text-accent">CIN</dt>
                <dd className="font-mono text-on-surface font-semibold">{STUDIO.cin ?? 'to be published'}</dd>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-raised/80 border border-border-subtle">
                <dt className="text-overline font-bold uppercase text-accent">GST</dt>
                <dd className="font-mono text-on-surface font-semibold">{STUDIO.gst ?? 'to be published'}</dd>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-raised/80 border border-border-subtle">
                <dt className="text-overline font-bold uppercase text-accent">DPDPA</dt>
                <dd className="text-on-surface-muted">privacy statement to be published</dd>
              </div>
            </dl>

            <p className="text-small text-on-surface-muted font-medium">
              © {year} Luxe Axis Private Limited, Chennai, Tamil Nadu. All rights reserved.
            </p>
          </div>
        </Stack>
      </Container>
    </footer>
  );
}
