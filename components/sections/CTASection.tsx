import { Button } from '../Button';
import { Container, Stack } from '../layout';
import { ToBePublished } from '../ToBePublished';
import { BOOK_AUDIT } from '@/lib/nav';
import { Reveal } from '../Reveal';
import type { Testimonial } from '@/lib/content/types';

/**
 * The closing band (Landing Blueprint §3.8) — "make saying yes feel easy,
 * human, and low-risk: a chat, not a contract."
 */
export function CTASection() {
  return (
    <section
      aria-labelledby="audit-heading"
      className="border-t-hairline border-border-subtle bg-surface-deep/80 py-section-y relative overflow-hidden isolate"
    >
      <Container>
        <Reveal>
          <div className="lx-liquid-glass rounded-2xl p-8 sm:p-12 md:p-16 relative overflow-hidden border border-accent/40 shadow-2xl backdrop-blur-2xl">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
            <Stack gap={6} className="max-w-measure relative z-10">
              <Stack gap={3}>
                <h2
                  id="audit-heading"
                  className="font-display text-[length:var(--typography-h1-font-size)] leading-snug tracking-[var(--font-tracking-tight)] text-on-surface font-bold"
                >
                  Let&rsquo;s talk about your space
                </h2>
                <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2 font-medium">
                  A free 45-minute audit with a real designer. No obligation, no
                  hard sell.
                </p>
              </Stack>
              <div>
                <Button
                  as="a"
                  href={BOOK_AUDIT.href}
                  size="lg"
                  className="lx-liquid-btn font-bold"
                >
                  {BOOK_AUDIT.label}
                </Button>
              </div>
              <p className="text-small text-on-surface-muted font-ui">
                You&rsquo;ll speak to a designer, not a bot.
              </p>
            </Stack>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * The testimonial beat that sits between pricing and the closing band in the
 * home order (Cinematic §9.1).
 *
 * Empty today, and renders nothing rather than a placeholder quote. A
 * testimonial with an invented name attached is a fabricated review — not a
 * stylistic shortcut but a false statement about a real person who does not
 * exist — and §3.5 turns entirely on this proof being documentary. `Testimonial`
 * in the content model requires attribution for the same reason: an
 * unattributed quote is indistinguishable from copywriting.
 */
export function TestimonialBand({
  testimonials,
}: {
  testimonials: readonly Testimonial[];
}) {
  const featured = testimonials[0];

  if (!featured) {
    return (
      <section
        aria-labelledby="testimonial-heading"
        className="w-full py-section-y"
      >
        <Container>
          <Stack gap={3} className="max-w-measure">
            <h2
              id="testimonial-heading"
              className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-on-surface-muted"
            >
              What our clients say
            </h2>
            {/* No quote, no name, no photograph. A testimonial with an invented
                attribution is a fabricated review about a person who does not
                exist — not a placeholder in any sense that would make it
                acceptable to render one here. */}
            <p className="text-on-surface-2">
              <ToBePublished>
                Client quotes are published once the client has approved the
                wording and agreed to be named. To be published.
              </ToBePublished>
            </p>
          </Stack>
        </Container>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="testimonial-heading"
      className="w-full py-section-y"
    >
      <Container>
        <Stack gap={5} className="max-w-measure">
          <h2 id="testimonial-heading" className="sr-only">
            What our clients say
          </h2>
          <blockquote className="font-display text-[length:var(--typography-h2-font-size)] leading-snug text-on-surface">
            {featured.quote}
          </blockquote>
          <p className="text-small text-on-surface-2">
            {featured.attribution.name} · {featured.attribution.context}
          </p>
        </Stack>
      </Container>
    </section>
  );
}
