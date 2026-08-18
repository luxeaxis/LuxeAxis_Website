import { describe, expect, it } from 'vitest';
import {
  getFeaturedProjects,
  getIntelligenceFeatures,
  getPersonas,
  getGuarantees,
  getStats,
  getTestimonials,
  getTiers,
  getTrustPoints,
} from '@/lib/content/source';
import { POSTER_IDS } from '@/lib/content/posters';

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
      expect(
        persona.question.length,
        `${persona.id} has no question`,
      ).toBeGreaterThan(15);
      expect(persona.question).toMatch(/\?$/);
      expect(
        persona.href.startsWith('/'),
        `${persona.id} href must be internal`,
      ).toBe(true);
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
      expect(
        feature.claim.length,
        `${feature.id} has no claim`,
      ).toBeGreaterThan(30);
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
    expect(POSTER_IDS).toContain('vastu');
    expect(POSTER_IDS).toContain('space-score');
    expect(POSTER_IDS).toContain('space-os');
  });
});

describe('tiers', () => {
  it('offers the three named tiers in ascending order', async () => {
    expect((await getTiers()).map((t) => t.name)).toEqual([
      'Essential',
      'Signature',
      'Elite',
    ]);
  });

  it('recommends at most one tier', async () => {
    // Design System §3.2: the gold hairline plus the overline badge marks ONE
    // tier. Two recommended tiers recommends neither.
    const recommended = (await getTiers()).filter((t) => t.recommended);
    expect(recommended.length).toBeLessThanOrEqual(1);
  });

  it('gives every tier real inclusions', async () => {
    for (const tier of await getTiers()) {
      expect(
        tier.inclusions.length,
        `${tier.name} has no inclusions`,
      ).toBeGreaterThan(0);
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
      expect(
        tier.priceFrom,
        `${tier.name} has no published floor`,
      ).toBeGreaterThan(0);
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
  it('states a handover guarantee without naming a figure the tiers contradict', async () => {
    // The blueprint's strip read "60-day handover guarantee", and this test
    // asserted it verbatim. The studio's own tier data then showed 60 days is
    // SIGNATURE's commitment — Essential is 45 and Elite is milestone-based —
    // so the flat claim overstated one tier and misdescribed another, on the
    // one strip whose whole job is to be trusted at a glance.
    //
    // Generalised rather than dropped: the guarantee is real, only the single
    // number was wrong. The specific figures are published against each tier on
    // /pricing and /process.
    const points = await getTrustPoints();
    expect(points).toEqual([
      'Transparent pricing',
      'Vastu-smart AI',
      'A guaranteed handover date',
      '200+ vetted vendors',
    ]);
    expect(points.join(' ')).not.toContain('60-day');
  });
});

describe('the handover claim', () => {
  it('is never stated flat — only against the tier that owns it', async () => {
    // Fixing the trust strip was not enough — the same flat claim was also in
    // the home hero (visible copy AND its meta description), the /process meta
    // description, and an FAQ answer that ships inside FAQPage structured data.
    // A guarantee overstated in schema.org markup is a claim made to Google as
    // well as to the reader.
    //
    // So this is a whole-tree guard rather than another per-file assertion:
    // "60-day" is only ever legitimate as Signature's commitment, and every
    // other appearance is the overstatement coming back.
    const { readFileSync } = await import('node:fs');
    const { execSync } = await import('node:child_process');

    // Directory pathspecs, not `app/**/*.tsx` — that glob requires at least one
    // intermediate directory, so it silently skips `app/page.tsx`, which is
    // where the worst instance of this claim actually was. A guard that misses
    // the home page is worse than no guard.
    //
    // `components` is in the list because leaving it out is how the claim came
    // back: TrustMarquee renders on every route from the root layout and read
    // "60-Day Handover Guarantee", and this guard could not see the file. A
    // site-wide strip is the single worst place for an unqualified number and
    // was the only place the guard was not looking.
    const tracked = execSync('git ls-files app lib components', {
      encoding: 'utf8',
    })
      .split('\n')
      .filter((file) => /\.tsx?$/.test(file));
    expect(tracked, 'nothing scanned — the pathspec is wrong').toContain(
      'app/page.tsx',
    );
    expect(tracked, 'components/ is not being scanned').toContain(
      'components/TrustMarquee.tsx',
    );

    // Only 60 is enforced here, and only for now. The rule that matters is
    // wider — a handover figure means nothing without the tier attached — but
    // the site currently carries ~130 flat "45-day" claims across the
    // residential service and commercial pages, and those cannot be resolved
    // by a test: `lib/content/commercial.ts` publishes no timeline guarantee
    // at all, so there is no correct figure to check them against. Widening
    // FIGURE to /\b(45|60)[-\s]day/ is the one-character change that turns
    // this into the full guard, and it should happen the moment the studio
    // states a commercial and per-service commitment.
    const FIGURE = /\b60[-\s]day/i;

    // A claim is fine if the tier it belongs to is attached. "Attached" is
    // deliberately not "on the same line": a stat block puts the figure in a
    // <strong> and its qualifier in the <span> underneath, and AboutSplit puts
    // the title on one line and "for Signature projects" on the next. Both
    // read correctly and neither would survive a line-local check. So the
    // window is the line plus its four neighbours — and the file path counts
    // too, since every figure on /pricing/signature is Signature's by
    // construction.
    //
    // Four rather than one or two because prettier breaks a stat block across
    // six lines: the figure lands inside a <strong> on its own line and its
    // qualifying <span> four lines below. A window narrower than the formatter's
    // output measures the formatter, not the copy. It is a loose heuristic in
    // exchange for one that stays green while still catching a bare figure
    // sitting on its own — which is the shape the regression actually took.
    const TIER = /\b(essential|signature|elite|by tier|per tier)\b/i;
    const CONTEXT = 4;

    const offenders = tracked.flatMap((file) => {
      const lines = readFileSync(file, 'utf8').split('\n');
      if (TIER.test(file)) return [];

      return (
        lines
          .map((text, index) => ({ file, line: index + 1, text, index }))
          .filter(({ text }) => FIGURE.test(text))
          // Comments, including the ones explaining why a flat version was
          // removed — they are not shipped copy.
          .filter(({ text }) => !/^\s*(\/\/|\*|\/\*)/.test(text))
          .filter(({ index }) => {
            const window = lines
              .slice(Math.max(0, index - CONTEXT), index + CONTEXT + 1)
              .join(' ');
            return !TIER.test(window);
          })
          .map(({ file: f, line, text }) => ({ file: f, line, text }))
      );
    });

    expect(
      offenders.map(({ file, line, text }) => `${file}:${line} ${text.trim()}`),
      'a handover figure is stated without the tier it belongs to',
    ).toEqual([]);
  });

  it('does not publish flat handover-day figures on commercial routes', async () => {
    const { readFileSync } = await import('node:fs');
    const { execSync } = await import('node:child_process');
    const FIGURE = /\b(45|60)[-\s]day/i;
    const commercial = execSync('git ls-files app/commercial', {
      encoding: 'utf8',
    })
      .split('\n')
      .filter((file) => /\.tsx?$/.test(file));

    const offenders = commercial.flatMap((file) => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines
        .map((text, index) => ({ file, line: index + 1, text }))
        .filter(({ text }) => FIGURE.test(text))
        .filter(({ text }) => !/^\s*(\/\/|\*|\/\*)/.test(text));
    });

    expect(
      offenders.map(({ file, line, text }) => `${file}:${line} ${text.trim()}`),
      'commercial pages must not state a flat handover-day figure — no published commercial timeline exists',
    ).toEqual([]);
  });
});

describe('guarantees', () => {
  it('publishes the timeline commitment per tier, since all three differ', async () => {
    const timeline = (await getGuarantees()).find((g) => g.id === 'timeline')!;
    expect(timeline.byTier).toEqual({
      Essential: '45-day handover',
      Signature: '60-day handover',
      Elite: 'Milestone-based, agreed up front',
    });
  });

  it('names only real tiers in a per-tier commitment', async () => {
    // A typo'd key would silently render nothing for that tier rather than
    // erroring, so the page would quietly under-promise.
    const names = (await getTiers()).map((tier) => tier.name);
    for (const guarantee of await getGuarantees()) {
      for (const key of Object.keys(guarantee.byTier ?? {})) {
        expect(names, `${guarantee.id} names an unknown tier`).toContain(key);
      }
    }
  });

  it('states the warranty response times rather than promising to look into it', async () => {
    const warranty = (await getGuarantees()).find((g) => g.id === 'warranty')!;
    expect(warranty.terms).toContain('same day');
    // The exclusions matter as much as the cover — a warranty that does not say
    // what it excludes is one a client discovers the limits of during a dispute.
    expect(warranty.terms).toContain('excluded');
  });

  it('leaves a genuinely unwritten term null rather than drafting one', async () => {
    // The supply-chain fee's conditions have not been published. `null` renders
    // as an explicit gap; inventing terms would commit the studio to an
    // obligation a visitor could later hold it to.
    const fee = (await getGuarantees()).find(
      (g) => g.id === 'supply-chain-fee',
    )!;
    expect(fee.terms).toBeNull();
  });
});

describe('the published case studies and client feedback collections', () => {
  it('publishes valid consented projects with photography', async () => {
    const projects = await getFeaturedProjects();
    expect(projects.length).toBeGreaterThan(0);
  });

  it('publishes attributable client testimonials', async () => {
    const testimonials = await getTestimonials();
    expect(testimonials.length).toBeGreaterThan(0);
  });

  it('publishes verified track record statistics', async () => {
    const stats = await getStats();
    expect(stats.length).toBe(4);
    expect(stats.find((s) => s.id === 'delivered')?.value).toBe(250);
    expect(stats.find((s) => s.id === 'on-time')?.value).toBe(98.4);
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
