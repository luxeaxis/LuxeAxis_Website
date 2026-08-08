/**
 * The shared vocabulary between the DOM journey and the WebGL camera.
 *
 * ## Why this lives in `lib/` and not in `three/`
 *
 * Both sides need these types. The DOM side (`components/JourneyRail.tsx`,
 * `components/JourneyProvider.tsx`) needs the station model to render the rail
 * and track the current station; the WebGL side (`three/core/JourneyCamera.tsx`)
 * needs the camera poses attached to each one.
 *
 * `eslint.config.mjs` forbids anything under `components/` from importing
 * `three/**` — including type-only imports, because the restriction matches on
 * the specifier, not on whether the import survives compilation. So the shared
 * types cannot live under `three/`. They can live here, because `three/` is
 * free to import from `lib/` (`three/stage.tsx` already imports `@/lib/store`)
 * and this module imports nothing from three at all — it is plain data and
 * plain tuples.
 *
 * That direction is the whole seam in one sentence: `lib/` knows nothing about
 * WebGL, `three/` knows about `lib/`, and `components/` can never reach across.
 */

/** A position or direction in world space. Metres, matching the room scale. */
export type Vec3 = [number, number, number];

/**
 * The seven camera moves from `LuxeAxis_Cinematic_Direction.md` §2.
 *
 * Defined here rather than in `three/core/camera.tsx` so a station can name its
 * move without the DOM side importing anything from `three/`. The camera module
 * imports this as its canonical definition — there is exactly one list, and
 * adding an eighth move means editing this line.
 */
export type JourneyMove =
  | 'descent'
  | 'pushIn'
  | 'pullBack'
  | 'orbit'
  | 'rackFocus'
  | 'crane'
  | 'settle';

/** Where the camera stands when a station is the current one. */
export type StationPose = {
  position: Vec3;
  target: Vec3;
  /** Clamped to 35–45 by the camera on write. */
  fov: number;
  /** How the camera arrives here from the previous station. */
  move: JourneyMove;
  /**
   * An authored opening move into this station, played once on a fresh load.
   *
   * Only honoured for the FIRST station, and only when motion is not reduced.
   * That restriction is the whole reason this is safe: an entry animation on
   * any other station would mean a deep link to `/#pricing` flying the camera
   * in from somewhere the visitor never asked to be, and every arrival by
   * scroll would replay an opening the visitor is already past.
   *
   * `entryFrom` is where the camera starts; it travels to `position` over
   * `entryDuration` seconds. `entryTarget` is where it looks at the start — a
   * separate value because "enter through a doorway" needs the camera aimed at
   * the opening it is passing through, not at where it will end up.
   */
  entryFrom?: Vec3;
  entryTarget?: Vec3;
  entryDuration?: number;
};

/**
 * One stop on the journey.
 *
 * A station is a real section of a real page. `id` is its DOM `id` and its URL
 * fragment, which is what makes the whole thing linkable, bookmarkable,
 * crawlable and reachable by browser history — the properties a scroll-jacked
 * journey throws away and cannot get back.
 */
export type Station = {
  /** DOM id and URL fragment. Must match the rendered `<section id>`. */
  id: string;
  /** Rail label. Short — it sits in a fixed-width vertical strip. */
  label: string;
  /**
   * Announced to assistive technology when this station becomes current.
   * Longer and more explicit than `label`, because a screen-reader user gets
   * no visual context from the rail's position.
   */
  description: string;
  /** The scene that should be live while this station is current, if any. */
  sceneId?: string;
  pose: StationPose;
};
