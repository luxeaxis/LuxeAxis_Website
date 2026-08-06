import Image from 'next/image';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';

/**
 * AboutSplit — About & Brand Story section with 4 pillars (Build Backlog HomeOne Layout Alignment).
 */
export function AboutSplit() {
  const pillars: Array<{ icon: IconName; title: string; desc: string }> = [
    {
      icon: 'info',
      title: 'Fixed Price Guarantee',
      desc: 'Your quote is locked before work starts. Itemised pricing with zero hidden escalations.',
    },
    {
      icon: 'check',
      title: '60-Day Guaranteed Handover',
      desc: 'Contractually committed handover timeline for Signature projects with daily Space OS tracking.',
    },
    {
      icon: 'gauge',
      title: 'Post-Handover Warranty',
      desc: 'Written warranty covering workmanship and materials with defined SLA response times.',
    },
    {
      icon: 'layers',
      title: 'Vastu-Tech & Space OS',
      desc: 'Automated spatial compliance verification paired with transparent digital portal updates.',
    },
  ];

  return (
    <section className="bg-surface py-section-y border-b border-border-subtle" aria-labelledby="about-heading">
      <Container>
        <Grid cols={2} gap={8} className="items-center">
          <Stack gap={6}>
            <Stack gap={3}>
              <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-semibold">
                Chennai’s Tech-Enabled Interior Studio
              </p>
              <h2 id="about-heading" className="font-display text-[length:var(--typography-h2-font-size)] leading-tight text-on-surface">
                Where Space Meets Intelligence. On Time. Every Time.
              </h2>
              <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
                Luxe Axis bridges high-end Chennai architectural craft with software precision. We publish our pricing,
                guarantee handover dates, and provide live client transparency throughout the design journey.
              </p>
            </Stack>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-xl border border-accent/20 bg-surface-raised/90 p-4 transition-all duration-ui hover:border-accent hover:shadow-lg hover:shadow-accent/10">
                  <Stack gap={2}>
                    <div className="flex items-center gap-2 text-accent">
                      <Icon name={pillar.icon} size="sm" decorative />
                      <h3 className="font-ui text-small font-bold text-on-surface">{pillar.title}</h3>
                    </div>
                    <p className="font-ui text-small text-on-surface-2">{pillar.desc}</p>
                  </Stack>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button as="a" href="/about" variant="primary">
                Learn Our Process
              </Button>
              <Button as="a" href="/book-audit" variant="secondary">
                Book Free Audit
              </Button>
            </div>
          </Stack>

          {/* Studio Image Showcase */}
          <div className="relative isolate overflow-hidden rounded-xl border border-border-subtle aspect-[4/3] shadow-xl">
            <Image
              src="/posters/hero.avif"
              alt="Luxe Axis Chennai Interior Studio & Materials Workspace"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-xl border border-accent/40 bg-surface-raised/95 p-4 shadow-xl backdrop-blur-md">
              <p className="font-display text-h3 text-accent font-bold">200+ Homes</p>
              <p className="font-ui text-small text-on-surface-2">Designed Across Chennai & OMR</p>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
