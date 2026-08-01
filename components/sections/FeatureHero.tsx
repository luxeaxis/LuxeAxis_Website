import type { ReactNode } from 'react';
import { Badge } from '../Badge';
import { Container, Stack } from '../layout';
import { SceneSlot } from '../SceneSlot';
import { ToBePublished } from '../ToBePublished';
import type { IntelligenceFeature } from '@/lib/content/types';

/**
 * `FeatureHero`, `ClaimProof` and `Stepper` (Build Backlog T-17).
 *
 * The three pieces every Intelligence feature page is built from. Kept together
 * because they are only ever used together, and reading them in one file makes
 * the page's anatomy obvious.
 */

/**
 * The top of a feature page: what it is called, what it claims, and the slot
 * its 3D scene will occupy.
 *
 * The scene slot is reserved NOW even though every scene is a static poster —
 * that is the point of T-17's "each page reserves the scene slot for T-32".
 * `SceneSlot` decides poster-versus-live itself, so when the scene ships the
 * page does not change and the layout does not move.
 *
 * Features with no scene (Virtual Staging) render no slot at all rather than an
 * empty box: the sitemap gives it no scene, and reserving space for something
 * that is not coming is just a hole in the page.
 */
export function FeatureHero({ feature }: { feature: IntelligenceFeature }) {
  return (
    <Container className="py-section-y">
      <Stack gap={8}>
        <Stack gap={4} className="max-w-measure">
          <p className="font-ui text-overline uppercase tracking-[var(--font-tracking-wider)] text-accent">
            Intelligence
          </p>
          <h1 className="font-display text-[length:var(--typography-display-font-size)] leading-tight tracking-[var(--font-tracking-tight)] text-on-surface">
            {feature.name}
          </h1>
          <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
            {feature.claim}
          </p>
        </Stack>

        {feature.sceneId && (
          <SceneSlot id={feature.sceneId}>
            <span className="sr-only">{feature.name}</span>
          </SceneSlot>
        )}
      </Stack>
    </Container>
  );
}

/**
 * The claim and what backs it, side by side.
 *
 * `proof` is the spec's own "Proves:" line — the commercial argument, kept
 * separate from the claim because they answer different questions: the claim is
 * what the capability does for the visitor, the proof is why it is defensible.
 * A feature with no stated proof renders the summary alone rather than an empty
 * frame.
 *
 * The human-in-the-loop note is a `Badge`, not body text, because Spec P4 ("AI
 * assists, humans decide") is a promise the studio makes rather than a
 * description — and §5.3 asks for it as a visible chip specifically. `accent`
 * tone: it is reassurance, not a status.
 */
export function ClaimProof({ feature }: { feature: IntelligenceFeature }) {
  return (
    <Stack gap={5} className="max-w-measure">
      <p className="text-[length:var(--typography-body-lg-font-size)] text-on-surface-2">
        {feature.summary}
      </p>
      {feature.proof && (
        <p className="border-l-regular border-accent pl-5 font-display text-[length:var(--typography-h3-font-size)] text-on-surface">
          {feature.proof}
        </p>
      )}
      {feature.humanInTheLoop && (
        <Stack gap={3}>
          <div>
            <Badge tone="accent" icon="check">
              Reviewed by a designer
            </Badge>
          </div>
          <p className="text-small text-on-surface-2">{feature.humanInTheLoop}</p>
        </Stack>
      )}
    </Stack>
  );
}

/**
 * The how-it-works stepper.
 *
 * An ordered list of real text, which is both the accessible equivalent T-17
 * requires for the future line-draw diagram AND §5.3's stated reduced-motion
 * fallback ("a 'See how it works' text stepper replaces the scan"). Writing it
 * first, rather than deriving it from a diagram later, is what keeps the
 * accessible version from becoming the afterthought that lags behind the
 * picture.
 *
 * `<ol>` rather than styled divs: the order is the meaning here, and a screen
 * reader announcing "list, 4 items" conveys that for free.
 */
export function Stepper({
  steps,
  pendingNote,
}: {
  steps?: readonly { title: string; body: string }[];
  /** Shown when a feature has no documented process yet, so the section names
   *  the gap rather than vanishing. */
  pendingNote?: ReactNode;
}) {
  if (!steps || steps.length === 0) {
    if (!pendingNote) return null;
    return <p className="max-w-measure text-on-surface-2">{pendingNote}</p>;
  }

  return (
    <ol className="flex max-w-measure flex-col gap-6">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span
            aria-hidden="true"
            className="flex h-icon-lg w-icon-lg shrink-0 items-center justify-center rounded-round border-hairline border-accent font-mono text-overline text-accent"
          >
            {index + 1}
          </span>
          <Stack gap={1}>
            <h3 className="font-ui font-semibold text-on-surface">{step.title}</h3>
            <p className="text-on-surface-2">{step.body}</p>
          </Stack>
        </li>
      ))}
    </ol>
  );
}

/** The "not documented yet" note for a feature whose process no spec describes.
 *  Uses the shared marker so it reads the same as every other content gap. */
export function PendingDetail({ what }: { what: string }) {
  return <ToBePublished label={what} />;
}
