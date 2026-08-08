'use client';

import { useAppStore } from '@/lib/store';
import { journeyProgress } from '@/lib/journey/stations';
import type { Station } from '@/lib/journey/types';

/**
 * The Axis rail — wayfinding for the journey.
 *
 * `LuxeAxis_Cinematic_Direction.md` §10.4 makes this mandatory, not decorative:
 * "Wayfinding is constant. The gold progress bead shows how much film remains;
 * the nav is always reachable; each scene has a visible label." A guided
 * journey without a visible position indicator is the "infinite tunnel anxiety"
 * §3 warns about.
 *
 * ## It is a table of contents, not a widget
 *
 * Every station is a real `<a href="#id">`. That single decision is what makes
 * the journey work for everyone:
 *
 *   - Keyboard users Tab to it and press Enter. No key handlers, no roving
 *     tabindex, no `role="button"` on a div — native behaviour that has worked
 *     since 1993.
 *   - It functions with JavaScript disabled, with WebGL unavailable, and with
 *     the `three_v1` flag off. Anchor links are a browser feature.
 *   - Middle-click, Ctrl-click, "copy link address" and "open in new tab" all
 *     behave, because they are links and the browser knows what links are.
 *
 * The camera reacting to the resulting navigation is a bonus layered on top. It
 * is never load-bearing.
 *
 * ## Why no `aria-live` announcing the current station
 *
 * It was considered and deliberately left out. Journey navigation moves focus
 * to the target section, and assistive technology already announces a focus
 * change with the section's accessible name. A live region on top of that
 * would announce the same station twice — and while merely scrolling, it would
 * fire on every IntersectionObserver change, talking over the content the
 * visitor is trying to read. `aria-current` carries the state without speaking.
 */
export function JourneyRail({
  stations,
  className = '',
}: {
  stations: readonly Station[];
  className?: string;
}) {
  const station = useAppStore((state) => state.station);
  const progress = journeyProgress(stations, station);

  return (
    <nav
      aria-label="Journey"
      // Hidden below `lg`: a fixed vertical rail on a phone costs more of the
      // viewport than the wayfinding is worth, and the sections are still
      // reachable by scrolling, by the header nav, and by URL fragment. This is
      // a progressive enhancement, so removing it removes nothing.
      className={`pointer-events-none fixed left-6 top-1/2 z-sticky hidden -translate-y-1/2 lg:block ${className}`}
    >
      <ol className="pointer-events-auto relative flex flex-col gap-4">
        {/* The rail itself: a hairline the beads sit on. `aria-hidden` because
            it is the visual metaphor, and the list already conveys the
            structure to assistive technology. */}
        <span
          aria-hidden="true"
          className="absolute left-[5px] top-1 h-[calc(100%-0.5rem)] w-px bg-on-surface-3/25"
        />
        {/* The filled portion — "how much film remains", as a single scaled
            element rather than per-bead state, so it cannot disagree with the
            progress value. */}
        <span
          aria-hidden="true"
          className="absolute left-[5px] top-1 w-px origin-top bg-accent transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{
            height: 'calc(100% - 0.5rem)',
            transform: `scaleY(${progress})`,
          }}
        />

        {stations.map((entry) => {
          const isCurrent = entry.id === station;
          return (
            <li key={entry.id} className="relative">
              <a
                href={`#${entry.id}`}
                // `aria-current="true"` rather than "location": the rail marks
                // a position within one page, not the current page in a set of
                // pages. `page` would be wrong and misleading here.
                aria-current={isCurrent ? 'true' : undefined}
                className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span
                  aria-hidden="true"
                  className={`relative z-10 h-[11px] w-[11px] shrink-0 rounded-full border transition-colors motion-reduce:transition-none ${
                    isCurrent
                      ? 'border-accent bg-accent'
                      : 'border-on-surface-3/50 bg-surface group-hover:border-accent'
                  }`}
                />
                {/* The label is always in the accessibility tree — only its
                    visual opacity changes. Hiding it with `display:none` until
                    hover would make the rail unusable for a screen reader,
                    which is the point of the distinction. */}
                <span
                  className={`whitespace-nowrap font-ui text-caption transition-opacity duration-200 motion-reduce:transition-none ${
                    isCurrent
                      ? 'text-on-surface opacity-100'
                      : 'text-on-surface-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                  }`}
                >
                  {entry.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      {/* Discoverability for the keyboard commands. Visible only on focus
          within the rail, so it teaches the shortcut at the moment a keyboard
          user is looking at the navigation and never clutters the page. */}
      <p className="pointer-events-none mt-6 max-w-[12ch] font-ui text-caption text-on-surface-2 opacity-0 transition-opacity focus-within:opacity-100 motion-reduce:transition-none">
        Press J and K to move between stops.
      </p>
    </nav>
  );
}
