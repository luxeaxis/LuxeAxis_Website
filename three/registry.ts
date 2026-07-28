import type { ComponentType } from 'react';

export const SCENE_IDS = [
  'hero', 'persona-router', 'vastu', 'space-score',
  'space-os', 'portfolio', 'journey', 'pricing-axis', 'nri-globe',
] as const;

export type SceneId = (typeof SCENE_IDS)[number];

export type ScenePoster = {
  src: string;
  /** The CLAIM the scene makes — not a description of pixels. Read aloud by
   *  screen readers in place of the scene, so it must carry the same argument. */
  alt: string;
  aspect: `${number}/${number}`;
  /** True for 'hero' only — this is the LCP element. */
  priority?: boolean;
};

export type SceneModule = {
  Scene: ComponentType<{ sceneId: SceneId }>;
  budgetKB: number;
  minTier: 'T2' | 'T3';
  flag: string;
};

/** Total record: every scene must have a poster or the build fails typecheck. */
export const POSTERS: Record<SceneId, ScenePoster> = {
  hero: {
    src: '/posters/hero.avif',
    alt: 'A finished living room resolved along a line of gold light: pendant lit, sofa placed, plant settled — space and applied intelligence producing a designed home.',
    aspect: '16/9',
    priority: true,
  },
  'persona-router': {
    src: '/posters/persona-router.avif',
    alt: 'Six lit routes into the studio, one for each kind of visitor, arranged around a Chennai skyline marker.',
    aspect: '16/9',
  },
  vastu: {
    src: '/posters/vastu.avif',
    alt: 'A floor plan under a gold Vastu grid: favourable zones marked in gold, zones needing review in teal, with a chip confirming a human designer reviewed the result.',
    aspect: '4/3',
  },
  'space-score': {
    src: '/posters/space-score.avif',
    alt: 'A four-arc gauge rating a room on wellness, function, aesthetics and sustainability, each arc filled to its measured value.',
    aspect: '1/1',
  },
  'space-os': {
    src: '/posters/space-os.avif',
    alt: 'The client portal on a tablet, showing a moodboard, live build progress and a visible budget — the project as the client sees it.',
    aspect: '4/3',
  },
  portfolio: {
    src: '/posters/portfolio.avif',
    alt: 'Completed Chennai projects presented as material-rich panels along the gold axis.',
    aspect: '16/9',
  },
  journey: {
    src: '/posters/journey.avif',
    alt: 'The seven stages of a Luxe Axis project as lit nodes descending the axis, from first discovery through handover and concierge care.',
    aspect: '9/16',
  },
  'pricing-axis': {
    src: '/posters/pricing-axis.avif',
    alt: 'A gold bead resting on the axis at a published fee, illustrating pricing that is stated openly rather than quoted privately.',
    aspect: '16/9',
  },
  'nri-globe': {
    src: '/posters/nri-globe.avif',
    alt: 'An arc drawn from the Tamil diaspora to Chennai, tracing how a home here is designed and delivered from abroad.',
    aspect: '1/1',
  },
};

/** Partial by design: the type system encodes that live 3D is optional, so no
 *  page can be written that depends on a scene existing. Populated per scene in
 *  a later phase, each behind its own flag. */
export const SCENES: Partial<Record<SceneId, () => Promise<SceneModule>>> = {};
