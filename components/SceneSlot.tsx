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
      <div className="relative z-10">{children}</div>
    </div>
  );
}
