import Image from 'next/image';
import { POSTERS, type PosterId } from '@/lib/content/posters';

/**
 * A section's poster, with content laid over it.
 *
 * This used to be the seam between the DOM site and a WebGL layer: it observed
 * its own visibility, published an `activeScene` to the store, and a persistent
 * canvas rendered into the same coordinates when the flag, the device tier and
 * the motion preference all allowed it. The 3D layer has been removed, so what
 * is left is the part that was always doing the work — a poster, a scrim, and
 * children above it.
 *
 * It is a Server Component again as a result. The client boundary existed only
 * for the IntersectionObserver; with that gone there is no state, no effect and
 * no reason to ship this to the browser.
 *
 * The name is unchanged because seventeen call sites say `SceneSlot` and the
 * sections are still called scenes in the specs. Renaming it would be churn
 * that communicates nothing.
 */
export function SceneSlot({
  id,
  children,
  layout = 'aspect',
}: {
  id: PosterId;
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
   * there is no shift to avoid.
   */
  layout?: 'aspect' | 'content';
}) {
  const poster = POSTERS[id];

  return (
    <div
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
          ("Text scrim over 3D/photo").

          This is a blind spot rather than a cosmetic choice: axe reports
          text-over-image as "incomplete", never as a violation, because it
          cannot know which pixel sits behind a glyph. So no gate in this
          project can catch headline-over-photo contrast failing — and the
          contrast suite only measures flat token pairs. Today every poster is
          a flat tone so nothing looks wrong; the moment real photography lands,
          a bright sky behind an ivory headline fails WCAG with every check
          still green.
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
