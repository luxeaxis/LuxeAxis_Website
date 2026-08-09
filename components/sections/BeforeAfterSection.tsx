import { Container, Stack } from '@/components/layout';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Reveal } from '@/components/Reveal';

/**
 * BeforeAfterSection — Transformation section featuring BeforeAfterSlider (Build Backlog HomeOne Layout Alignment).
 */
export function BeforeAfterSection() {
  return (
    <section
      className="bg-surface-deep/30 py-section-y border-b border-border-subtle overflow-hidden"
      aria-labelledby="before-after-heading"
    >
      <Container>
        <Stack gap={8}>
          <Reveal>
            <Stack gap={3} className="text-center max-w-measure mx-auto">
              <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent font-semibold">
                The Transformation Effect
              </p>
              <h2
                id="before-after-heading"
                className="font-display text-[length:var(--typography-h2-font-size)] leading-tight text-on-surface"
              >
                Before & After: Real Chennai Transformations
              </h2>
              <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
                Drag the golden divider handle or use left/right arrow keys to
                reveal the renovation transformation.
              </p>
            </Stack>
          </Reveal>

          <Reveal>
            <div className="max-w-4xl mx-auto w-full">
              <BeforeAfterSlider
                beforeImage={{
                  src: '/posters/home-transformation-before.png',
                  alt: 'Poes Garden apartment living space before renovation',
                }}
                afterImage={{
                  src: '/posters/home-transformation-after.png',
                  alt: 'Finished luxury living room transformation by Luxe Axis in Poes Garden',
                }}
                aspect="16/9"
              />
              <p className="mt-3 text-center font-ui text-small text-on-surface-2 italic">
                Poes Garden Sanctuary — Living Room Transformation, Signature Tier
              </p>
            </div>
          </Reveal>
        </Stack>
      </Container>
    </section>
  );
}
