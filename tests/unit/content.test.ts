import { describe, expect, it } from 'vitest';
import {
  getFeaturedProjects,
  getIntelligenceFeatures,
  getPersonas,
  getStats,
  getTestimonials,
  getTiers,
  getTrustPoints,
} from '@/lib/content/source';
import { SCENE_IDS } from '@/three/registry';

/**
 * The invariants a TypeScript type cannot state.
 *
 * `lib/content/types.ts` explains why the model is plain types rather than Zod:
 * the data is in-repo, so the compiler already checks every field, and the only
 * things left worth asserting are semantic — a tier with an empty inclusion
 * list type-checks perfectly and is useless; a testimonial with a blank name
 * type-checks and is a fabricated review.
 *
 * The tests that assert emptiness are the load-bearing ones. They will start
 * failing the day someone seeds placeholder proof, which is the point.
 */

describe('personas', () => {
  it('offers exactly the six routes the spec defines', async () => {
    // "Six Ways In" is a named concept (Cinematic §5.2) and the grid is built
    // for six. A seventh persona is a design decision, not a content edit.
    expect((await getPersonas()).length).toBe(6);
  });

  it('gives every persona a question, not just a label', async () => {
    // The question is the routing signal — a visitor recognises themselves by
    // it far faster than by a segment name — so a persona without one cannot
    // do its job on the page.
    for (const persona of await getPersonas()) {
      expect(persona.question.length, `${persona.id} has no question`).toBeGreaterThan(15);
      expect(persona.question).toMatch(/\?$/);
      expect(persona.href.startsWith('/'), `${persona.id} href must be internal`).toBe(true);
    }
  });

  it('keeps persona ids unique', async () => {
    const ids = (await getPersonas()).map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('intelligence features', () => {
  it('states a claim for each, not a feature bullet', async () => {
    for (const feature of await getIntelligenceFeatures()) {
      expect(feature.claim.length, `${feature.id} has no claim`).toBeGreaterThan(30);
      expect(feature.href.startsWith('/intelligence/')).toBe(true);
    }
  });

  it('names a scene id for each feature that has one', async () => {
    // Vastu-Tech, Space Score and Space OS each have a scene in the registry
    // (Cinematic §5.3-5.5). Keeping the ids aligned is what will let the
    // teaser's poster slots upgrade to live scenes later without a rename.
    const featureIds = (await getIntelligenceFeatures()).map((f) => f.id);
    for (const id of ['vastu-tech', 'space-score', 'space-os']) {
      expect(featureIds).toContain(id);
    }
    expect(SCENE_IDS).toContain('vastu');
    expect(SCENE_IDS).toContain('space-score');
    expect(SCENE_IDS).toContain('space-os');
  });
});

describe('tiers', () => {
  it('offers the three named tiers in ascending order', async () => {
    expect((await getTiers()).map((t) => t.name)).toEqual(['Essential', 'Signature', 'Elite']);
  });

  it('recommends at most one tier', async () => {
    // Design System §3.2: the gold hairline plus the overline badge marks ONE
    // tier. Two recommended tiers recommends neither.
    const recommended = (await getTiers()).filter((t) => t.recommended);
    expect(recommended.length).toBeLessThanOrEqual(1);
  });

  it('gives every tier real inclusions', async () => {
    for (const tier of await getTiers()) {
      expect(tier.inclusions.length, `${tier.name} has no inclusions`).toBeGreaterThan(0);
      for (const inclusion of tier.inclusions) {
        expect(inclusion.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('publishes a real floor for every tier', async () => {
    // This asserted the OPPOSITE until the studio published its price list —
    // that no tier carried a figure, because a placeholder would have
    // discredited the "we publish our prices" claim the whole site rests on.
    // Now that real numbers exist the useful invariant flips: every tier must
    // carry one, or a tier card silently falls back to "Fee band: To be
    // published" while its neighbours show prices.
    for (const tier of await getTiers()) {
      expect(tier.priceFrom, `${tier.name} has no published floor`).toBeGreaterThan(0);
    }
  });

  it('orders the tier floors Essential < Signature < Elite', async () => {
    // Three numbers transcribed from a price list. If they ever came out of
    // order the tier cards would present a cheaper Elite than Signature, which
    // is the kind of thing nobody notices until a customer does.
    const [essential, signature, elite] = await getTiers();
    expect(essential!.priceFrom!).toBeLessThan(signature!.priceFrom!);
    expect(signature!.priceFrom!).toBeLessThan(elite!.priceFrom!);
  });
});

describe('trust points', () => {
  it('carries the blueprint trust strip verbatim', async () => {
    expect(await getTrustPoints()).toEqual([
      'Transparent pricing',
      'Vastu-smart AI',
      '60-day handover guarantee',
      '200+ vetted vendors',
    ]);
  });
});

describe('the collections that must stay empty until real content exists', () => {
  it('ships no invented projects', async () => {
    expect(await getFeaturedProjects()).toEqual([]);
  });

  it('ships no invented testimonials', async () => {
    // A testimonial with a made-up name attached is a fabricated review about a
    // person who does not exist. Landing Blueprint §3.5 rests entirely on this
    // proof being documentary.
    expect(await getTestimonials()).toEqual([]);
  });

  it('ships no invented statistics', async () => {
    // The blueprint names the measures (projects delivered, on-time %, NPS,
    // referral rate) and publishes none of their values. A plausible invented
    // figure is indistinguishable from a real one to a visitor, which is what
    // makes inventing it unacceptable rather than untidy.
    expect(await getStats()).toEqual([]);
  });

  it('still validates the shape of that content once it arrives', async () => {
    // Guards the guard: the assertions above pass trivially on an empty array,
    // so this pins the rules that will apply to whatever is seeded later.
    for (const project of await getFeaturedProjects()) {
      expect(project.image.alt.length).toBeGreaterThan(20);
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
    }
    for (const testimonial of await getTestimonials()) {
      expect(testimonial.attribution.name.trim().length).toBeGreaterThan(0);
      expect(testimonial.attribution.context.trim().length).toBeGreaterThan(0);
    }
  });
});
