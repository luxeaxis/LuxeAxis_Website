import Image from 'next/image';
import { POSTERS, type SceneId } from '@/three/registry';

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
}: {
  id: SceneId;
  children: React.ReactNode;
}) {
  const poster = POSTERS[id];

  return (
    <div className="relative isolate w-full" style={{ aspectRatio: poster.aspect }}>
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
