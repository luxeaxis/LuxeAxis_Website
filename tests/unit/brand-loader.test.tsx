import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrandLoader, MIN_DISPLAY_MS, TIMEOUT_MS } from '@/components/BrandLoader';

/**
 * The loader's whole behaviour is temporal, so these run on fake timers.
 *
 * What is being defended: a loading state is the easiest place on a site to be
 * dishonest — a fake progress ramp, a spinner that never resolves, or a
 * "brand moment" that is really a delay inserted into a page that was ready.
 */

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  // Explicit: there is no global setup file registering auto-cleanup, so
  // without this each render stacks in the same document and `getByRole`
  // starts matching the previous test's DOM.
  cleanup();
  vi.useRealTimers();
});

describe('the minimum-display guard', () => {
  it('holds a loader that finishes almost immediately', () => {
    // The flash case: work completes at ~0ms. Without the guard the loader
    // appears and vanishes inside a frame or two, which reads as a glitch.
    const { rerender } = render(<BrandLoader value={10} />);
    expect(screen.getByRole('progressbar')).toBeTruthy();

    rerender(<BrandLoader value={100} done />);
    expect(screen.queryByRole('progressbar'), 'released before the guard').toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(MIN_DISPLAY_MS);
    });
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('does not extend a loader that was already up longer than the window', () => {
    // The guard is anti-flash, not a floor on every load. Once the window has
    // passed, finishing must release immediately — otherwise a slow load pays
    // the penalty twice.
    const { rerender } = render(<BrandLoader value={10} />);

    act(() => {
      vi.advanceTimersByTime(MIN_DISPLAY_MS + 500);
    });
    rerender(<BrandLoader value={100} done />);

    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});

describe('the timeout path', () => {
  it('stops claiming progress and offers a retry', () => {
    const onRetry = vi.fn();
    render(<BrandLoader value={40} onRetry={onRetry} />);

    expect(screen.getByRole('progressbar')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(TIMEOUT_MS);
    });

    // A bar frozen at 40% forever is the failure mode this replaces.
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });

  it('says the rest of the page still works, because it does', () => {
    // This loader never gates the document — the page around it is prerendered
    // and already usable. Telling the visitor that is the difference between a
    // missing visual and an apparently broken site.
    render(<BrandLoader value={40} />);
    act(() => {
      vi.advanceTimersByTime(TIMEOUT_MS);
    });
    expect(screen.getByText(/rest of the page works/)).toBeTruthy();
  });

  it('does not time out once the work is done', () => {
    render(<BrandLoader value={100} done />);
    act(() => {
      vi.advanceTimersByTime(TIMEOUT_MS * 2);
    });
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
  });
});

describe('what it reports to assistive tech', () => {
  it('marks itself busy while loading and not once it has given up', () => {
    const { container } = render(<BrandLoader value={40} />);
    const region = container.querySelector('[aria-live]')!;
    expect(region.getAttribute('aria-busy')).toBe('true');

    act(() => {
      vi.advanceTimersByTime(TIMEOUT_MS);
    });
    // Still busy after a timeout would mean a screen reader waits forever for
    // an update that is not coming.
    expect(region.getAttribute('aria-busy')).toBe('false');
  });

  it('names the load once, not twice', () => {
    // The Progress bar carries the accessible name. The mark beside it is
    // decorative, so a screen reader is not told the brand as well.
    const { container } = render(<BrandLoader value={40} label="Loading the scene" />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('progressbar').getAttribute('aria-label')).toBe('Loading the scene');
  });

  it('reports the real percentage it was given', () => {
    // Determinate. A loading bar that invents its own ramp is the one dishonest
    // thing this component could do.
    render(<BrandLoader value={37} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('37');
  });
});
