import { Container, Stack } from '@/components/layout';
import { Button } from '@/components/Button';

/**
 * ProcessSteps — 5-step workflow overview (Build Backlog HomeOne Layout Alignment).
 */
export function ProcessSteps() {
  const steps = [
    {
      num: '01',
      title: 'Free Space Audit',
      desc: 'In-person or video site walkthrough with a Senior Designer. Zero cost, zero commitment.',
    },
    {
      num: '02',
      title: 'Vastu-Tech 3D Design',
      desc: 'Photorealistic 3D renders with automated Vastu orientation verification built-in.',
    },
    {
      num: '03',
      title: 'Fixed Itemised Quote',
      desc: 'Complete cost breakdown locked before work begins. No cost escalation guaranteed.',
    },
    {
      num: '04',
      title: 'Expert Execution & Space OS',
      desc: 'Vetted craftsmen on-site with daily photo & timeline updates visible in Space OS.',
    },
    {
      num: '05',
      title: 'Guaranteed Handover',
      desc: 'Keys handed over on schedule. Written post-handover warranty coverage begins.',
    },
  ];

  return (
    <section
      className="bg-surface-deep/40 py-section-y border-b border-border-subtle"
      aria-labelledby="process-heading"
    >
      <Container>
        <Stack gap={8}>
          <Stack gap={3} className="text-center max-w-measure mx-auto">
            <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-semibold">
              How We Work
            </p>
            <h2
              id="process-heading"
              className="font-display text-[length:var(--typography-h2-font-size)] leading-tight text-on-surface"
            >
              5 Steps from Brief to Guaranteed Handover
            </h2>
            <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
              A structured, transparent journey designed to eliminate delays and
              budget surprises.
            </p>
          </Stack>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="relative rounded-xl lx-liquid-glass-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
              >
                <Stack gap={3}>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-h2 text-accent font-bold drop-shadow-sm">
                      {step.num}
                    </span>
                    {idx < steps.length - 1 && (
                      <span
                        className="hidden md:inline text-accent/50 text-small"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-h3 text-on-surface font-bold">
                    {step.title}
                  </h3>
                  <p className="font-ui text-small text-on-surface-2">
                    {step.desc}
                  </p>
                </Stack>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button as="a" href="/process" variant="primary">
              View Detailed Process Guide
            </Button>
          </div>
        </Stack>
      </Container>
    </section>
  );
}
