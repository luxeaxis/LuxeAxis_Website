import type { ReactNode } from 'react';
import { Container, Stack } from '../layout';

/**
 * The shared frame every home-page block below the hero sits in: an eyebrow, an
 * `h2` that labels the landmark, an optional lede, then the block's own body.
 *
 * Exists so heading level and landmark labelling are decided once. The spec's
 * a11y gate requires one `h1` and no skipped levels, and the reliable way to
 * hold that across eight sections written at different times is to make the
 * `h2` structural rather than something each block remembers to render.
 * `aria-labelledby` points the `<section>` at its own heading, so assistive tech
 * announces a navigable region by name rather than an anonymous group.
 *
 * Not promoted from `app/style/page.tsx`'s similar local helper: that one exists
 * to document the system and carries reference-page scaffolding (border rules,
 * anchor ids for the ToC) this one has no business inheriting.
 */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    // A plain <section> rather than the `Bleed` primitive: `Bleed` models only
    // children/className/as, so it has nowhere to put `aria-labelledby`, and
    // the labelled landmark is the whole reason this wrapper exists.
    <section aria-labelledby={headingId} className="relative w-full py-section-y">
      <Container>
        <Stack gap={8}>
          <Stack gap={3}>
            {eyebrow && (
              <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
                {eyebrow}
              </p>
            )}
            <h2
              id={headingId}
              className="font-display text-[length:var(--typography-h1-font-size)] leading-snug tracking-[var(--font-tracking-tight)] text-on-surface"
            >
              {title}
            </h2>
            {lede && (
              <p className="max-w-measure text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
                {lede}
              </p>
            )}
          </Stack>
          {children}
        </Stack>
      </Container>
    </section>
  );
}
