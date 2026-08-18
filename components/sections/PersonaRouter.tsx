import { FeatureCard } from '../Card';
import { Section } from './Section';
import { Stagger } from '../Reveal';
import type { Persona } from '@/lib/content/types';

/**
 * "Six Ways In" (Cinematic §5.2, Spec §2.1) — route the six personas fast,
 * without a wall of text. All cards are styled to equal height and proportion.
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
      <Stagger
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        itemClassName="h-full"
        items={personas.map((persona) => (
          <FeatureCard
            key={persona.id}
            href={persona.href}
            title={persona.label}
            body={persona.question}
            surface="glass"
            className="h-full flex flex-col justify-between"
          />
        ))}
      />
    </Section>
  );
}
