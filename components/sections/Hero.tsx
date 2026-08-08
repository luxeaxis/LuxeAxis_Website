'use client';

import { useState } from 'react';
import { Button } from '../Button';
import { Container } from '../layout';
import { SceneSlot } from '../SceneSlot';
import { Icon } from '../Icon';
import { BOOK_AUDIT } from '@/lib/nav';
import { track } from '@/lib/analytics/client';

/**
 * The hero (Landing Blueprint §1, §3.1; Cinematic Direction Scene 01).
 *
 * ## What changed, and why the video had to go
 *
 * This used to be a four-slide MP4 carousel advancing on a 10-second timer.
 * Three separate rules said it could not stay:
 *
 *   - `LuxeAxis_Performance_A11y_QA.md` §5, on video: "avoid on the hero",
 *     "prefer a poster still over autoplay video", "never the LCP". The four
 *     files totalled 71 MB — 99.9% of every asset in `public/`.
 *   - Cinematic Direction §10.2 bans timed reveals in the main flow: "No
 *     autoplay, no scroll-jacking, no timed reveals." A carousel that advances
 *     on a clock takes the pacing away from the visitor.
 *   - §10.1 requires content be readable at every frame. A slide that changes
 *     under a reader mid-sentence is the opposite.
 *
 * What replaces it is `three/scenes/HeroRoomScene.tsx` — a camera entering a
 * living room — layered over the poster that was always meant to be the LCP
 * element.
 *
 * ## What is preserved, exactly
 *
 * The `h1`, the sub, the eyebrow, both CTAs and their hrefs, and the trust
 * points are unchanged. The page's `metadata` export lives in `app/page.tsx`
 * and is untouched, so nothing about the SEO surface moves.
 *
 * The showcase card is gone with the carousel that fed it: it existed to name
 * whichever slide was on screen, and three of its four entries pointed at
 * `/portfolio` rather than at a project. Its job — proving there is real work —
 * is done properly by `FeaturedProjects` further down the same page, from real
 * content rather than a hardcoded list.
 *
 * ## The 3D layer is an enhancement, and this file assumes nothing about it
 *
 * `SceneSlot` decides poster-versus-live by itself. With `three_v1` off, on
 * T0/T1, under reduced motion, or with no WebGL, everything below renders
 * identically over a still. The hotspot buttons work in all of those cases —
 * they are ordinary disclosure buttons whose content is ordinary DOM. The 3D
 * markers are a second way to reach a control that already works, never the
 * only way.
 */

type Hotspot = {
  id: string;
  label: string;
  detail: string;
  href: string;
  linkLabel: string;
};

/**
 * The three claims the room makes.
 *
 * Each `id` is also the `controlId` a marker in the 3D scene dispatches to (see
 * `three/core/interaction.tsx`). The pairing is the accessibility contract: the
 * mesh is a pointer affordance for this button, not a separate control.
 */
const HOTSPOTS: readonly Hotspot[] = [
  {
    id: 'hero-hotspot-materials',
    label: 'Materials',
    detail:
      'Stone, solid timber and real metal, specified by name in your estimate rather than described as “premium finishes”.',
    href: '/style',
    linkLabel: 'See the material system',
  },
  {
    id: 'hero-hotspot-lighting',
    label: 'Lighting',
    detail:
      'A layered scheme — ambient, task and accent — designed as one circuit plan, not chosen fitting by fitting at the end.',
    href: '/residential/false-ceiling',
    linkLabel: 'How we plan lighting',
  },
  {
    id: 'hero-hotspot-axis',
    label: 'Vastu alignment',
    detail:
      'Every plan is checked against Vastu zoning, and a human designer reviews the result before it reaches you.',
    href: '/intelligence/vastu',
    linkLabel: 'About Vastu-Tech',
  },
];

export function Hero({
  headline,
  sub,
  trustPoints,
}: {
  headline: string;
  sub: string;
  trustPoints: readonly string[];
}) {
  // Null means "nothing expanded", which is the state the page loads in. The
  // room reads as a room before it reads as a diagram of one.
  const [openHotspot, setOpenHotspot] = useState<string | null>(null);

  const toggle = (hotspot: Hotspot) => {
    const next = openHotspot === hotspot.id ? null : hotspot.id;
    setOpenHotspot(next);
    if (next) {
      // `hero_hotspot` was added to the `AnalyticsEvent` union rather than
      // passed as a free string — the union is what stops event names drifting
      // into six spellings of the same thing. `track` is a no-op until a
      // provider is configured AND consent is granted, so this costs nothing
      // today and starts working the moment either lands.
      track('hero_hotspot', { hotspot: hotspot.label });
    }
  };

  const open = HOTSPOTS.find((hotspot) => hotspot.id === openHotspot) ?? null;

  return (
    <SceneSlot id="hero" layout="content">
      <section
        aria-label="Introduction"
        className="relative isolate flex min-h-[85vh] w-full flex-col justify-between overflow-hidden"
      >
        <Container className="relative z-10 my-auto w-full py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
            <div className="flex max-w-full flex-col gap-5 sm:gap-6 lg:col-span-7 lg:max-w-measure">
              {/* Eyebrow. The pulsing dot is gone: §10.7 bans anything flashing
                  more than three times a second, and an indefinite pulse beside
                  a headline is motion with no message. */}
              <div className="inline-flex max-w-full items-center gap-2 self-start font-ui text-overline font-bold uppercase tracking-[var(--font-tracking-wider)] text-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span className="truncate">
                  Architecture, Interiors &amp; Vastu-Tech
                </span>
              </div>

              <div className="m-0 flex flex-col gap-3 p-0 sm:gap-4">
                {/* The page's only h1, and the LCP text. It is server-rendered
                    and never waits on WebGL — the whole reason the scene is
                    allowed to exist at all. */}
                <h1 className="m-0 text-balance p-0 font-display text-[length:var(--typography-display-font-size)] font-bold leading-[1.08] tracking-[var(--font-tracking-tight)] text-on-surface drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] [text-shadow:_0_2px_12px_rgba(0,0,0,0.9)]">
                  {headline}
                </h1>
                <p className="m-0 text-pretty p-0 text-body font-semibold leading-relaxed text-on-surface drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] [text-shadow:_0_1px_8px_rgba(0,0,0,0.9)] sm:text-[length:var(--typography-body-lg-font-size)]">
                  {sub}
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4 sm:pt-2">
                <Button
                  as="a"
                  href={BOOK_AUDIT.href}
                  size="lg"
                  className="w-full justify-center text-center font-bold shadow-2xl sm:w-auto"
                >
                  {BOOK_AUDIT.label}
                </Button>
                <Button
                  as="a"
                  href="/pricing"
                  variant="secondary"
                  size="lg"
                  iconTrailing="arrow-right"
                  className="w-full justify-center border border-accent/30 bg-surface-raised/90 text-center font-semibold text-on-surface shadow-2xl backdrop-blur-sm hover:bg-surface-raised sm:w-auto"
                >
                  See your price
                </Button>
              </div>

              {/* Named, because the hero now contains two lists. An unlabelled
                  list is announced as "list, 2 items" with no indication of
                  what it is a list OF, and two of them in one region is worse
                  again — a screen-reader user has to read into each to tell
                  them apart. */}
              <ul
                aria-label="Studio guarantees"
                className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 pt-2 text-overline text-on-surface drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] sm:gap-x-6 sm:gap-y-2.5 sm:pt-3 sm:text-small"
              >
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-center gap-2 font-bold">
                    <Icon
                      name="check"
                      size="sm"
                      className="shrink-0 text-accent"
                      decorative
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column: the hotspots, as an ordinary disclosure list.
                This is the "keyboard-operable DOM equivalent" spec §8.2 asks
                for — real DOM rather than drei's <Html>, so it is
                server-rendered, indexable, focusable in document order, and
                present for every visitor who never loads a canvas. */}
            <div className="w-full lg:col-span-5">
              <div className="rounded-xl border border-accent/20 bg-surface-deep/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
                <h2
                  id="hero-hotspots-heading"
                  className="m-0 font-display text-small font-bold text-on-surface"
                >
                  What you are looking at
                </h2>
                <p className="m-0 mt-1 font-ui text-overline text-on-surface-2">
                  Three decisions in every room we design.
                </p>

                <ul
                  aria-labelledby="hero-hotspots-heading"
                  className="m-0 mt-4 flex list-none flex-col gap-2 p-0"
                >
                  {HOTSPOTS.map((hotspot) => {
                    const isOpen = openHotspot === hotspot.id;
                    return (
                      <li key={hotspot.id}>
                        <button
                          id={hotspot.id}
                          type="button"
                          onClick={() => toggle(hotspot)}
                          aria-expanded={isOpen}
                          aria-controls={`${hotspot.id}-detail`}
                          className="flex w-full items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-raised/60 px-3 py-2.5 text-left font-ui text-small font-semibold text-on-surface transition-colors hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
                        >
                          <span className="flex items-center gap-2.5">
                            {/* Paired with the marker in the 3D scene. Shape
                                and text carry the meaning, never colour alone. */}
                            <span
                              aria-hidden="true"
                              className={`h-2 w-2 shrink-0 rounded-full ${isOpen ? 'bg-accent' : 'bg-on-surface-3/60'}`}
                            />
                            {hotspot.label}
                          </span>
                          {/* Rotated rather than swapped for a `chevron-up`:
                              the Icon set is a deliberately closed list and
                              does not contain one. A transform is also the
                              better answer here — it animates, and it cannot
                              fall out of sync with the open state. */}
                          <Icon
                            name="chevron-down"
                            size="sm"
                            className={`shrink-0 text-accent transition-transform motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                            decorative
                          />
                        </button>

                        <div
                          id={`${hotspot.id}-detail`}
                          role="region"
                          aria-labelledby={hotspot.id}
                          hidden={!isOpen}
                          className="px-3 pb-3 pt-2"
                        >
                          <p className="m-0 text-small leading-relaxed text-on-surface-2">
                            {hotspot.detail}
                          </p>
                          <a
                            href={hotspot.href}
                            className="mt-2 inline-flex items-center gap-1.5 font-ui text-overline font-bold uppercase tracking-[var(--font-tracking-wider)] text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            {hotspot.linkLabel}
                            <Icon name="arrow-right" size="sm" decorative />
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {open === null && (
                  <p className="m-0 mt-3 font-ui text-overline text-on-surface-3">
                    Select any of the three, or the matching marker in the room.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </SceneSlot>
  );
}
