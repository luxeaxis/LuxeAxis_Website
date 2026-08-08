'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { stationIndex } from '@/lib/journey/stations';
import type { Station } from '@/lib/journey/types';

/**
 * The journey's navigation controller — and the reason this design is
 * accessible rather than merely claiming to be.
 *
 * ## What this does NOT do
 *
 * It does not listen for `wheel`. It does not `preventDefault` on anything. It
 * does not animate `scrollTop`, hold the visitor on a section, change scroll
 * speed, or reverse direction. Guardrail §10.2 of the Cinematic Direction doc
 * is a stated pass/fail gate — "The visitor always drives. No autoplay, no
 * scroll-jacking that changes speed or direction" — and a controller that
 * intercepted the wheel would fail it on the first line.
 *
 * The "guided" feel comes from CSS `scroll-snap` (see `styles/globals.css`),
 * which the browser implements natively. That distinction is not pedantry: a
 * native snap keeps trackpad momentum, keyboard paging, find-in-page,
 * screen-reader virtual cursors, and the browser's own scroll restoration all
 * working, and every one of those breaks under a JS scroll-jacker no matter how
 * much keyboard handling is bolted on afterwards.
 *
 * ## What it does
 *
 * Resolves ONE question — which station is current — from four inputs that all
 * mean the same thing, and publishes the answer to the store:
 *
 *   1. The section scrolled into view (IntersectionObserver).
 *   2. The URL fragment on load, so `/#pricing` deep-links correctly.
 *   3. Browser back/forward (`hashchange`, `popstate`).
 *   4. Keyboard journey commands, which move focus and let native scrolling
 *      follow — they never scroll directly.
 *
 * The camera then reacts to the store. It is downstream of all four, which is
 * why it stays correct under every one of them without knowing any exist.
 */

/** How far into the viewport a section must be to become current. */
const ACTIVATION_MARGIN = '-45% 0px -45% 0px';

export function JourneyProvider({
  stations,
  /** Journey keyboard commands. On by default; a page that binds J/K for
   *  something else can opt out without losing station tracking. */
  keyboard = true,
}: {
  stations: readonly Station[];
  keyboard?: boolean;
}) {
  useJourneyKeys(stations, keyboard);

  /**
   * Publish a station, working out which way we travelled so the camera can
   * ease differently arriving backwards.
   *
   * The current station is read from the STORE, not from a local ref. That
   * matters because there are two writers — this observer and the keyboard
   * commands in `useJourneyKeys`, which publish immediately rather than waiting
   * for a scroll to settle. A local ref would only ever see this one's writes,
   * so after a keyboard move it would hold a stale id, believe the observer's
   * confirming callback was a real change, and fire a redundant transition with
   * a direction computed from the wrong origin.
   *
   * One source of truth, and the de-duplication is correct for both writers.
   */
  const publish = useRef((id: string | null) => {
    const state = useAppStore.getState();
    const previous = state.station;
    if (previous === id) return;

    const from = stationIndex(stations, previous);
    const to = stationIndex(stations, id);

    state.setStation(id, to >= from ? 'forward' : 'back');

    const station = stations.find((entry) => entry.id === id);
    // `activeScene` is what `three/stage.tsx` gates the whole canvas on, so a
    // station with no scene correctly leaves the WebGL layer unmounted rather
    // than rendering an empty one.
    state.setActiveScene((station?.sceneId as never) ?? null);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sections = stations
      .map((station) => document.getElementById(station.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    // Which section owns the middle of the viewport. Reading the most-visible
    // entry rather than the first intersecting one matters on tall sections,
    // where two can be intersecting at once and "first" flickers between them
    // as the visitor scrolls.
    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio)
            best = entry;
        }
        if (best) publish.current(best.target.id);
      },
      { rootMargin: ACTIVATION_MARGIN, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const section of sections) observer.observe(section);

    // Deep link. `/#pricing` from an ad or an email must land composed at that
    // station, not at the top with the camera catching up.
    const fromHash = window.location.hash.replace('#', '');
    if (fromHash && stations.some((station) => station.id === fromHash)) {
      publish.current(fromHash);
    }

    // Browser history. Back/forward are navigation, and navigation is what the
    // camera reflects — so they must move it, exactly like a link click does.
    const onHashChange = () => {
      const id = window.location.hash.replace('#', '');
      if (id && stations.some((station) => station.id === id))
        publish.current(id);
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, [stations]);

  return null;
}

/**
 * Keyboard journey commands.
 *
 * ## The rule that keeps this accessible
 *
 * These commands move FOCUS. They do not scroll. `element.focus()` makes the
 * browser scroll the target into view using its own mechanism, honouring
 * `scroll-padding-top`, `scroll-behavior`, and the visitor's reduced-motion
 * setting for free. Calling `scrollIntoView` ourselves would reimplement all
 * three, worse, and would leave focus behind at the top of the document — the
 * single most common failure in hand-built section navigation, and the one that
 * makes a keyboard user's next Tab jump somewhere they did not expect.
 *
 * ## What is deliberately NOT bound
 *
 * Arrow keys, Space, Page Up/Down and Home/End are left entirely alone. They
 * already scroll, they are what screen-reader and keyboard users expect, and
 * rebinding them to "next station" is exactly the hijack this design exists to
 * avoid. The journey commands sit on `J`/`K` — unclaimed, discoverable from the
 * rail's title attributes, and inert while the visitor is typing.
 */
export function useJourneyKeys(stations: readonly Station[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const go = (delta: number) => {
      const state = useAppStore.getState();
      const current = state.station;
      const index = stationIndex(stations, current);
      const next =
        stations[Math.min(stations.length - 1, Math.max(0, index + delta))];
      if (!next || next.id === current) return;

      const section = document.getElementById(next.id);
      if (!section) return;

      // The section is `tabIndex={-1}` (see JourneyStation) so it can receive
      // programmatic focus without ever entering the Tab order.
      section.focus();
      // Record the move in history so browser Back returns to the previous
      // station. A journey whose Back button leaves the page is a trap.
      window.history.pushState(null, '', `#${next.id}`);

      // Publish immediately rather than waiting for the IntersectionObserver
      // to notice the scroll.
      //
      // The observer is asynchronous — it delivers on the next frame at the
      // earliest, and only once the browser has finished scrolling, which under
      // smooth scrolling is several hundred milliseconds. Two quick presses of
      // J would both read the same stale `station` and resolve to the same
      // `next`, so the journey would stall on the second press and every press
      // after it until the scroll settled.
      //
      // Publishing here makes keyboard navigation deterministic and independent
      // of scroll timing. The observer still runs and will publish the same id
      // moments later; `publish` de-duplicates on the station id, so the
      // confirming call is a no-op rather than a second transition.
      state.setStation(next.id, delta > 0 ? 'forward' : 'back');
      state.setActiveScene((next.sceneId as never) ?? null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // Never steal a key from a field, a rich-text area, or anything the page
      // has made editable.
      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (target.isContentEditable) return;
      }

      if (event.key === 'j' || event.key === 'J') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'k' || event.key === 'K') {
        event.preventDefault();
        go(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stations, enabled]);
}
