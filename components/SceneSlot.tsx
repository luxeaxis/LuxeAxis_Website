'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { POSTERS, type SceneId } from '@/three/registry';
import { useAppStore } from '@/lib/store';

/** Renders a poster with content above it. When a scene is registered for this
 *  id AND its flag is on AND tier >= minTier AND reduced-motion is off AND first
 *  paint has happened, a later phase upgrades this slot to live WebGL by
 *  publishing activeScene to the store — the persistent canvas renders into
 *  these same coordinates.
 *
 *  Children never move between poster and live modes. That is what makes CLS
 *  zero by construction and reduced-motion parity structural rather than a
 *  branch someone has to remember to maintain. */
export function SceneSlot({
  id,
  children,
  layout = 'aspect',
}: {
  id: SceneId;
  children: React.ReactNode;
  /**
   * `'aspect'` (default) reserves the poster's own ratio — right for a slot
   * whose whole job is to hold media, where nothing else defines a height and
   * the reserved box is what keeps CLS at zero.
   *
   * `'content'` lets the children define the height and the poster fill behind
   * them. The hero needs this: at 16/9 on a 360px phone the slot is 202px tall,
   * which will not hold a headline, a sub, two CTAs and a trust strip. It costs
   * nothing in layout stability — the height comes from server-rendered DOM, so
   * there is no shift to avoid — and every other guarantee is unchanged: same
   * poster, same scrim, same upgrade path to a live scene, children still never
   * move between poster and live modes.
   */
  layout?: 'aspect' | 'content';
}) {
  const poster = POSTERS[id];
  const slotRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useAppStore((state) => state.setActiveScene);

  /**
   * On a journey page, the journey owns `activeScene` and this slot stands down.
   *
   * Both this component and `components/JourneyProvider.tsx` publish
   * `activeScene`, and on the home page both are mounted at once — so without
   * this they fight. The failure is specific and would have been unpleasant to
   * diagnose: at the `about` or `services` station the journey correctly writes
   * `null` (neither declares a scene), while a `Card` further down the page
   * whose media slot happens to be 30% visible writes its own scene id back.
   * The canvas then mounts a scene the camera is not composed for, and which
   * station "wins" depends on scroll speed.
   *
   * The journey wins by design: it knows the whole page's narrative order,
   * whereas a slot only knows whether it personally is on screen. The two
   * observers also disagree on what "visible" means — 30% of the slot here,
   * versus owning the middle 10% of the viewport there — and reconciling that
   * is not worth doing when one of them is strictly better informed.
   */
  const onJourney = useAppStore((state) => state.station) !== null;

  useEffect(() => {
    if (onJourney) return;

    const el = slotRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setActiveScene(id);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveScene, onJourney]);

  return (
    <div
      ref={slotRef}
      data-scene-id={id}
      className="relative isolate w-full"
      style={layout === 'aspect' ? { aspectRatio: poster.aspect } : undefined}
    >
      <Image
        src={poster.src}
        alt={poster.alt}
        fill
        priority={poster.priority ?? false}
        sizes="100vw"
        className="object-cover"
      />
      {/* Text scrim. `opacity.scrim` exists in the token file for exactly this
          ("Text scrim over 3D/photo") and had no consumer.

          This is a blind spot rather than a cosmetic choice: axe reports
          text-over-image as "incomplete", never as a violation, because it
          cannot know which pixel sits behind a glyph. So no gate in this
          project can catch headline-over-photo contrast failing — and the
          contrast suite only measures flat token pairs. Today every poster is
          flat navy so nothing looks wrong; the moment real photography lands
          under workstream B, a bright sky behind an ivory headline fails WCAG
          with every check still green.
          Sized from the deepest surface so the scrim darkens toward the void
          rather than introducing a colour the palette does not contain. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-surface-deep opacity-scrim"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
