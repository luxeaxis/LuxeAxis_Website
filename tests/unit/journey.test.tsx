import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { act, cleanup, render, screen } from '@testing-library/react';
import { JourneyProvider } from '@/components/JourneyProvider';
import { JourneyRail } from '@/components/JourneyRail';
import { JourneyStation } from '@/components/JourneyStation';
import {
  HOME_STATIONS,
  journeyProgress,
  stationById,
  stationIndex,
} from '@/lib/journey/stations';
import { useAppStore } from '@/lib/store';

afterEach(cleanup);

beforeEach(() => {
  useAppStore.setState({ station: null, stationDirection: 'forward' });
});

describe('journey station model', () => {
  it('every station id is unique', () => {
    // Duplicate ids would break anchors, the IntersectionObserver, and
    // `document.getElementById` — all three silently, all three only for the
    // second station.
    const ids = HOME_STATIONS.map((station) => station.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every station carries a label and a longer description', () => {
    for (const station of HOME_STATIONS) {
      expect(station.label.length).toBeGreaterThan(0);
      // The description exists for assistive technology, which gets no context
      // from the rail's visual position. If it is not longer than the label it
      // is not adding anything.
      expect(station.description.length).toBeGreaterThan(station.label.length);
    }
  });

  it('the camera descends monotonically through the journey', () => {
    // The spec's "Descent (dolly) — the default between every scene; never
    // stops entirely until the CTA". A station that rose would read as the
    // camera backtracking, which breaks the sense of travelling somewhere.
    const heights = HOME_STATIONS.map((station) => station.pose.position[1]);
    for (let i = 1; i < heights.length; i += 1) {
      expect(heights[i]!).toBeLessThanOrEqual(heights[i - 1]!);
    }
  });

  it('every FOV is architectural (35–45)', () => {
    for (const station of HOME_STATIONS) {
      expect(station.pose.fov).toBeGreaterThanOrEqual(35);
      expect(station.pose.fov).toBeLessThanOrEqual(45);
    }
  });

  it('the journey ends on a settle, so the CTA is decided from stillness', () => {
    expect(HOME_STATIONS[HOME_STATIONS.length - 1]!.pose.move).toBe('settle');
  });

  it('progress runs 0 to 1 across the stations and is 0 for an unknown id', () => {
    expect(journeyProgress(HOME_STATIONS, HOME_STATIONS[0]!.id)).toBe(0);
    expect(journeyProgress(HOME_STATIONS, HOME_STATIONS.at(-1)!.id)).toBe(1);
    expect(journeyProgress(HOME_STATIONS, 'not-a-station')).toBe(0);
    expect(journeyProgress(HOME_STATIONS, null)).toBe(0);
  });

  it('lookup helpers tolerate null and unknown ids', () => {
    expect(stationById(HOME_STATIONS, null)).toBeUndefined();
    expect(stationById(HOME_STATIONS, 'nope')).toBeUndefined();
    expect(stationIndex(HOME_STATIONS, null)).toBe(-1);
    expect(stationIndex(HOME_STATIONS, 'nope')).toBe(-1);
  });
});

describe('JourneyRail is a table of contents, not a widget', () => {
  it('renders one real anchor per station, pointing at its fragment', () => {
    render(<JourneyRail stations={HOME_STATIONS} />);
    for (const station of HOME_STATIONS) {
      const link = screen.getByRole('link', { name: station.label });
      // A real href is what makes this work with JavaScript disabled, with
      // WebGL unavailable, and with the three_v1 flag off.
      expect(link.getAttribute('href')).toBe(`#${station.id}`);
    }
  });

  it('marks only the current station with aria-current', () => {
    useAppStore.setState({ station: 'pricing' });
    render(<JourneyRail stations={HOME_STATIONS} />);

    const current = screen.getByRole('link', { name: 'The Price' });
    expect(current.getAttribute('aria-current')).toBe('true');

    const other = screen.getByRole('link', { name: 'The Spark' });
    expect(other.getAttribute('aria-current')).toBeNull();
  });

  it('every station label stays in the accessibility tree even when visually faded', () => {
    // The inactive labels are hidden with opacity, never `display:none` or
    // `visibility:hidden` — either of those would remove them from the
    // accessibility tree and leave a screen-reader user with nine unnamed
    // links.
    useAppStore.setState({ station: 'hero' });
    const { container } = render(<JourneyRail stations={HOME_STATIONS} />);
    for (const station of HOME_STATIONS) {
      expect(screen.getByText(station.label)).toBeDefined();
    }
    expect(container.querySelector('[style*="display: none"]')).toBeNull();
  });

  it('is a labelled navigation landmark', () => {
    render(<JourneyRail stations={HOME_STATIONS} />);
    expect(screen.getByRole('navigation', { name: 'Journey' })).toBeDefined();
  });

  it('renders without a current station — the no-JS and 3D-off state', () => {
    render(<JourneyRail stations={HOME_STATIONS} />);
    expect(screen.getAllByRole('link')).toHaveLength(HOME_STATIONS.length);
  });
});

describe('JourneyStation', () => {
  it('is focusable programmatically but never in the Tab order', () => {
    const { container } = render(
      <JourneyStation id="about">
        <p>Body</p>
      </JourneyStation>,
    );
    const station = container.querySelector('#about');
    // -1 is the whole mechanism behind "navigation moves focus, the browser
    // scrolls". Without it `focus()` silently no-ops on a non-interactive
    // element and keyboard users are stranded at the top of the document.
    expect(station?.getAttribute('tabindex')).toBe('-1');
  });

  it('exposes a data-station hook for the observer and the e2e suite', () => {
    const { container } = render(
      <JourneyStation id="contact">
        <p>Body</p>
      </JourneyStation>,
    );
    expect(container.querySelector('[data-station="contact"]')).not.toBeNull();
  });
});

/**
 * Station tracking and keyboard navigation.
 *
 * IntersectionObserver is stubbed rather than exercised for real: jsdom has no
 * layout, and a real browser only delivers intersection callbacks while the
 * page is compositing frames — which a headless or backgrounded tab is not
 * doing. Stubbing the observer lets the callback be driven deterministically,
 * which is what these assertions are actually about.
 */
describe('JourneyProvider tracks the current station', () => {
  type ObserverCallback = (
    entries: Partial<IntersectionObserverEntry>[],
  ) => void;
  let trigger: ObserverCallback | null = null;

  beforeEach(() => {
    trigger = null;
    class StubObserver {
      constructor(callback: ObserverCallback) {
        trigger = callback;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    }
    vi.stubGlobal('IntersectionObserver', StubObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mountJourney() {
    return render(
      <>
        <JourneyProvider stations={HOME_STATIONS} />
        {HOME_STATIONS.map((station) => (
          <JourneyStation key={station.id} id={station.id}>
            <p>{station.label}</p>
          </JourneyStation>
        ))}
      </>,
    );
  }

  it('publishes the most-visible intersecting section, not the first', () => {
    mountJourney();
    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 0.1,
          target: { id: 'about' } as Element,
        },
        {
          isIntersecting: true,
          intersectionRatio: 0.8,
          target: { id: 'pricing' } as Element,
        },
      ]);
    });
    // Two sections can intersect at once on a tall page. Taking the first would
    // flicker between them as the visitor scrolls.
    expect(useAppStore.getState().station).toBe('pricing');
  });

  it("sets the station's scene, and clears it for a station that has none", () => {
    mountJourney();
    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target: { id: 'intelligence' } as Element,
        },
      ]);
    });
    expect(useAppStore.getState().activeScene).toBe('vastu');

    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target: { id: 'about' } as Element,
        },
      ]);
    });
    // `about` declares no sceneId, so the canvas must unmount rather than hold
    // the previous station's scene.
    expect(useAppStore.getState().activeScene).toBeNull();
  });

  it('records the direction of travel', () => {
    mountJourney();
    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target: { id: 'work' } as Element,
        },
      ]);
    });
    expect(useAppStore.getState().stationDirection).toBe('forward');

    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target: { id: 'about' } as Element,
        },
      ]);
    });
    expect(useAppStore.getState().stationDirection).toBe('back');
  });

  it('ignores a callback with nothing intersecting', () => {
    mountJourney();
    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target: { id: 'work' } as Element,
        },
      ]);
    });
    act(() => {
      trigger?.([
        {
          isIntersecting: false,
          intersectionRatio: 0,
          target: { id: 'work' } as Element,
        },
      ]);
    });
    // Scrolling a section out of view does not mean "no station" — it means the
    // next one is arriving. Clearing here would blank the rail between stops.
    expect(useAppStore.getState().station).toBe('work');
  });

  it('advances one station per J press without waiting for a scroll to settle', () => {
    mountJourney();
    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target: { id: 'hero' } as Element,
        },
      ]);
    });

    // Two presses in immediate succession. Before the keyboard path published
    // directly, both read the same stale store value and resolved to the same
    // station, so the journey stalled on the second press.
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j' }));
    });
    expect(useAppStore.getState().station).toBe('about');

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j' }));
    });
    expect(useAppStore.getState().station).toBe('services');

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    });
    expect(useAppStore.getState().station).toBe('about');
  });

  it('clamps at both ends rather than wrapping', () => {
    mountJourney();
    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target: { id: 'hero' } as Element,
        },
      ]);
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    });
    // Wrapping from the first station to the last would teleport the camera
    // across the whole journey on a mistaken keypress.
    expect(useAppStore.getState().station).toBe('hero');
  });

  it('never steals a keystroke from a form field', () => {
    const { container } = render(
      <>
        <JourneyProvider stations={HOME_STATIONS} />
        <input aria-label="Name" />
        {HOME_STATIONS.map((station) => (
          <JourneyStation key={station.id} id={station.id}>
            <p>{station.label}</p>
          </JourneyStation>
        ))}
      </>,
    );
    act(() => {
      trigger?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
          target: { id: 'hero' } as Element,
        },
      ]);
    });

    const input = container.querySelector('input')!;
    input.focus();
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'j', bubbles: true }),
      );
    });
    // Typing "j" in a name field must type a j, not jump the camera.
    expect(useAppStore.getState().station).toBe('hero');
  });
});

/**
 * The structural guarantee, in the same spirit as the WebGL seam test.
 *
 * Cinematic Direction §10.2 is a stated pass/fail gate: "The visitor always
 * drives. No autoplay, no scroll-jacking that changes speed or direction."
 * A source-level check because it fails in milliseconds at the moment the
 * mistake is made, rather than in a manual test somebody has to think to run —
 * and because scroll-jacking is the single most likely thing to be
 * reintroduced here by someone trying to make the journey feel "tighter".
 */
describe('the journey never hijacks scrolling', () => {
  /**
   * Comments are stripped before checking.
   *
   * The first version of these assertions ran against the raw source and
   * failed on `JourneyProvider`'s own doc comments — which explain, at some
   * length, why it deliberately does NOT call `scrollIntoView` and why it
   * leaves `Home`/`End` alone. Rewording the prose to appease a substring
   * match would have deleted the most useful documentation in the file to
   * satisfy a test about behaviour it does not have.
   *
   * (The WebGL seam test in registry.test.ts makes the opposite trade for a
   * good reason: there, the risk is a real import, the cost of avoiding one
   * word in prose is nil, and keeping the check dumb keeps it fast. Here the
   * prose IS the point.)
   */
  const stripComments = (source: string) =>
    source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  const provider = stripComments(
    readFileSync('components/JourneyProvider.tsx', 'utf8'),
  );

  it('binds no wheel, touchmove or scroll listener', () => {
    expect(provider).not.toMatch(/addEventListener\(\s*['"]wheel['"]/);
    expect(provider).not.toMatch(/addEventListener\(\s*['"]touchmove['"]/);
    expect(provider).not.toMatch(/addEventListener\(\s*['"]scroll['"]/);
  });

  it('never drives the scroll position itself', () => {
    // Navigation moves FOCUS and lets the browser scroll — which honours
    // scroll-padding-top, scroll-behavior and the visitor's reduced-motion
    // setting for free. Calling these would reimplement all three, worse.
    expect(provider).not.toContain('scrollIntoView');
    expect(provider).not.toContain('scrollTo');
    expect(provider).not.toContain('scrollTop');
  });

  it('leaves the native scrolling keys alone', () => {
    // Arrow keys, Space, Page Up/Down and Home/End already scroll and are what
    // keyboard and screen-reader users expect. Rebinding any of them to "next
    // station" is the hijack this design exists to avoid.
    for (const key of [
      'ArrowDown',
      'ArrowUp',
      'PageDown',
      'PageUp',
      'Home',
      'End',
      "' '",
    ]) {
      expect(provider).not.toContain(key);
    }
  });

  it('uses proximity snapping, never mandatory', () => {
    // `mandatory` makes the middle of a section taller than the viewport
    // literally unreachable and fights find-in-page.
    const css = readFileSync('styles/globals.css', 'utf8');
    expect(css).toContain('scroll-snap-type: y proximity');
    expect(css).not.toContain('scroll-snap-type: y mandatory');
  });

  it('turns snapping off entirely under reduced motion', () => {
    const css = readFileSync('styles/globals.css', 'utf8');
    expect(css).toMatch(
      /prefers-reduced-motion: reduce\)\s*\{[^}]*\.lx-journey\s*\{\s*scroll-snap-type:\s*none/s,
    );
  });
});
