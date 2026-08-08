import { Grid } from '../layout';
import { FeatureCard } from '../Card';
import { Section } from './Section';
import type { Persona } from '@/lib/content/types';

/**
 * "Six Ways In" (Cinematic §5.2, Spec §2.1) — route the six personas fast,
 * without a wall of text.
 *
 * The 3D version orbits six tiles around a Chennai skyline marker; §5.2's own
 * reduced-motion fallback is "a static responsive grid of six cards", which is
 * exactly what this renders. Building the fallback first is the phase order the
 * Build Backlog sets out (Phase 2 static site before Phase 4 polygons) and
 * means the router is complete and converting before any scene exists.
 *
 * Each tile leads with the persona's own words and carries the question the
 * spec says the site must answer fast for them. The question is the routing
 * signal, not flavour text — a visitor recognises themselves by their question
 * far quicker than by a segment name, so it is body copy on the card rather
 * than something hidden behind a hover.
 *
 * No icon on these tiles: the question is the content, and a glyph beside it
 * would be decoration competing with it — as well as colliding with the
 * trailing arrow `FeatureCard` already draws.
 *
 * `FeatureCard` gives the whole tile one link and no nested interactive
 * elements, which is the trap this card family exists to make unrepresentable
 * (see components/Card.tsx). Several destinations are not built yet — the same
 * deliberate position `lib/nav.ts` takes, and a soft landing since a miss now
 * renders the branded 404 rather than a bare framework page.
 */
export function PersonaRouter({ personas }: { personas: readonly Persona[] }) {
  if (personas.length === 0) return null;

  return (
    <Section
      id="personas"
      eyebrow="Six ways in"
      title="Start where you are"
      lede="Tell us which of these sounds like you, and we will take you straight to the part of the studio that answers it."
    >
      <Grid cols={3} gap={5}>
        {personas.map((persona) => (
          <FeatureCard
            key={persona.id}
            href={persona.href}
            title={persona.label}
            body={persona.question}
            surface="glass"
          />
        ))}
      </Grid>
    </Section>
  );
}
