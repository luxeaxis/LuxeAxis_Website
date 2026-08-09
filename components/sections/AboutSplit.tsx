import Image from 'next/image';
import { Container, Grid, Stack } from '@/components/layout';
import { Button } from '@/components/Button';
import { Icon, type IconName } from '@/components/Icon';
import { Reveal, Stagger } from '@/components/Reveal';

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
    <section
      className="bg-surface py-section-y border-b border-border-subtle overflow-hidden"
      aria-labelledby="about-heading"
    >
      <Container>
        <Grid cols={2} gap={8} className="items-center">
          <Stack gap={6}>
            <Reveal>
              <Stack gap={3}>
                <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-semibold">
                  Chennai’s Tech-Enabled Interior Studio
                </p>
                <h2
                  id="about-heading"
                  className="font-display text-[length:var(--typography-h2-font-size)] leading-tight text-on-surface"
                >
                  Where Space Meets Intelligence. On Time. Every Time.
                </h2>
                <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
                  Luxe Axis bridges high-end Chennai architectural craft with
                  software precision. We publish our pricing, guarantee handover
                  dates, and provide live client transparency throughout the
                  design journey.
                </p>
              </Stack>
            </Reveal>

            <Stagger
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              items={pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="lx-liquid-glass-card rounded-xl p-4 transition-all duration-300 hover:border-accent/60 hover:-translate-y-1 hover:shadow-xl h-full"
                >
                  <Stack gap={2}>
                    <div className="flex items-center gap-2 text-accent">
                      <Icon
                        name={pillar.icon}
                        size="sm"
                        decorative
                        className="text-accent"
                      />
                      <h3 className="font-ui text-small font-bold text-on-surface">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="font-ui text-small text-on-surface-2">
                      {pillar.desc}
                    </p>
                  </Stack>
                </div>
              ))}
            />

            <Reveal>
              <div className="flex items-center gap-4">
                <Button as="a" href="/about" variant="primary">
                  Learn Our Process
                </Button>
                <Button as="a" href="/book-audit" variant="secondary">
                  Book Free Audit
                </Button>
              </div>
            </Reveal>
          </Stack>

          {/* Studio Image Showcase with Ken Burns Effect */}
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-2xl border border-accent/40 aspect-[4/3] shadow-2xl group">
              <Image
                src="/posters/tech-enabled-studio.png"
                alt="High-end interior design studio workspace in Chennai with designers reviewing 3D spatial floor plans and material swatches."
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover animate-ken-burns-zoom-in scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/90 via-surface-deep/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 lx-liquid-glass-card rounded-xl p-4 shadow-2xl backdrop-blur-md border border-accent/40 flex items-center justify-between">
                <div>
                  <p className="font-display text-h3 text-accent font-bold">
                    200+ Homes
                  </p>
                  <p className="font-ui text-small text-on-surface font-medium">
                    Tech-Enabled Interior Fit-Outs Across Chennai
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-ui text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Space OS Sync
                </div>
              </div>
            </div>
          </Reveal>
        </Grid>
      </Container>
    </section>
  );
}
