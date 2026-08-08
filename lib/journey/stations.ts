import type { Station } from './types';

/**
 * The homepage journey — the nine stations of the film, in order.
 *
 * ## This list is the single source of truth for three separate things
 *
 * 1. The DOM section ids the page renders (`components/sections/*` must use
 *    these ids, and `tests/unit/journey.test.ts` asserts they do).
 * 2. The rail's links and their order.
 * 3. The camera's pose at each stop.
 *
 * Keeping them together is what stops the classic failure of a guided journey:
 * a rail that says you are in section four while the camera is composed for
 * section five, because two lists drifted apart.
 *
 * ## The poses are a continuous descent, not nine unrelated compositions
 *
 * Y falls monotonically from 3.2 to 0.4 across the journey, and Z pulls in from
 * 9 to 3. That is the spec's "Descent (dolly) — the default between every
 * scene; never stops entirely until the CTA". Read the `position` column top to
 * bottom and you are reading the camera's travel down the Axis.
 *
 * The last station is a `settle` at a dead rest, because §2 requires it: "A
 * 'Settle' always precedes any call to action so decisions are made from
 * stillness, not motion."
 */
export const HOME_STATIONS: readonly Station[] = [
  {
    id: 'hero',
    label: 'The Spark',
    description: 'Opening. The studio’s promise and the first call to action.',
    sceneId: 'hero',
    pose: {
      position: [0, 3.2, 9.0],
      target: [0, 1.6, 0],
      fov: 42,
      move: 'descent',
    },
  },
  {
    id: 'about',
    label: 'The Studio',
    description: 'Who designs your home, and how the studio works.',
    pose: {
      position: [0.8, 2.9, 7.8],
      target: [0.2, 1.4, -0.4],
      fov: 42,
      move: 'descent',
    },
  },
  {
    id: 'services',
    label: 'What We Do',
    description: 'The services offered, from single rooms to complete homes.',
    pose: {
      position: [-0.6, 2.6, 6.9],
      target: [-0.2, 1.3, -0.8],
      fov: 41,
      move: 'descent',
    },
  },
  {
    id: 'personas',
    label: 'Six Ways In',
    description: 'Six routes into the studio, one for each kind of visitor.',
    sceneId: 'persona-router',
    pose: {
      position: [0, 2.3, 6.0],
      target: [0, 1.2, -1.0],
      fov: 44,
      move: 'pullBack',
    },
  },
  {
    id: 'intelligence',
    label: 'Vastu-Tech',
    description: 'How the studio applies intelligence to a floor plan.',
    sceneId: 'vastu',
    pose: {
      position: [1.1, 1.9, 4.8],
      target: [0.2, 1.0, -1.2],
      fov: 36,
      move: 'pushIn',
    },
  },
  {
    id: 'work',
    label: 'The Work',
    description: 'Completed Chennai projects you can inspect.',
    sceneId: 'portfolio',
    pose: {
      position: [-0.9, 1.6, 4.2],
      target: [-0.1, 0.95, -1.4],
      fov: 40,
      move: 'rackFocus',
    },
  },
  {
    id: 'pricing',
    label: 'The Price',
    description: 'Published fees, stated openly rather than quoted privately.',
    sceneId: 'pricing-axis',
    pose: {
      position: [0.4, 1.2, 3.6],
      target: [0, 0.85, -1.6],
      fov: 38,
      move: 'pushIn',
    },
  },
  {
    id: 'process',
    label: 'The Process',
    description: 'The seven stages from first discovery through handover.',
    sceneId: 'journey',
    pose: {
      position: [0, 0.9, 3.2],
      target: [0, 0.75, -1.8],
      fov: 42,
      move: 'crane',
    },
  },
  {
    id: 'contact',
    label: 'The Invitation',
    description: 'Book a design audit. The journey’s destination.',
    pose: {
      position: [0, 0.4, 3.0],
      target: [0, 0.6, -1.8],
      fov: 38,
      move: 'settle',
    },
  },
] as const;

/** Look a station up by its DOM id / URL fragment. */
export function stationById(
  stations: readonly Station[],
  id: string | null | undefined,
): Station | undefined {
  if (!id) return undefined;
  return stations.find((station) => station.id === id);
}

/** Index of a station, or -1. Used for "which direction did we travel". */
export function stationIndex(
  stations: readonly Station[],
  id: string | null,
): number {
  if (!id) return -1;
  return stations.findIndex((station) => station.id === id);
}

/**
 * Normalised progress through the journey, 0 to 1.
 *
 * Drives the rail's progress bead. Deliberately derived from station INDEX and
 * not from scroll offset: the bead should mark "you are at stop 5 of 9", which
 * is a fact about the journey, not "you are 63% down the document", which is a
 * fact about how tall the sections happen to be. Those two diverge badly when
 * one section is three times the height of another.
 */
export function journeyProgress(
  stations: readonly Station[],
  id: string | null,
): number {
  const index = stationIndex(stations, id);
  if (index < 0 || stations.length < 2) return 0;
  return index / (stations.length - 1);
}
