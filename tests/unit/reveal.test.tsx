import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Reveal, STAGGER_STEP_MS, Stagger } from '@/components/Reveal';

/**
 * The reveal system's safety properties.
 *
 * Almost every test here checks that content is VISIBLE, which is the point: an
 * animation that fails open is a missed animation, and one that fails closed is
 * a blank page. The failure modes worth guarding are all in that direction.
 */

function stubEnvironment({
  reducedMotion,
  hasObserver = true,
  inViewport = false,
}: {
  reducedMotion: boolean;
  hasObserver?: boolean;
  inViewport?: boolean;
}) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: reducedMotion,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );

  if (hasObserver) {
    class StubIntersectionObserver {
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    vi.stubGlobal('IntersectionObserver', StubIntersectionObserver);
  } else {
    vi.stubGlobal('IntersectionObserver', undefined);
  }

  // jsdom reports 0 for every box, which reads as "above the fold" — so
  // off-screen content has to be simulated explicitly.
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: inViewport ? 10 : 5000,
    bottom: inViewport ? 100 : 5100,
    left: 0,
    right: 0,
    width: 100,
    height: 90,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

beforeEach(() => {
  vi.stubGlobal('innerHeight', 800);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Reveal', () => {
  it('leaves content untouched under reduced motion', () => {
    // Not merely fast — untouched. A reduced-motion visitor's DOM should be
    // identical to the un-animated one, not the same animation at 0ms.
    stubEnvironment({ reducedMotion: true, inViewport: false });
    render(<Reveal>content</Reveal>);
    expect(screen.getByText('content').getAttribute('data-reveal')).toBeNull();
  });

  it('leaves content untouched when IntersectionObserver is unavailable', () => {
    // The load-bearing case. If the element were hidden here it could never be
    // shown again, and the section would be permanently invisible.
    stubEnvironment({
      reducedMotion: false,
      hasObserver: false,
      inViewport: false,
    });
    render(<Reveal>content</Reveal>);
    expect(screen.getByText('content').getAttribute('data-reveal')).toBeNull();
  });

  it('never animates content that is already on screen', () => {
    // Above-the-fold content includes the LCP element. Fading it in delays
    // first meaningful paint to buy nothing, since the visitor is already
    // looking at it.
    stubEnvironment({ reducedMotion: false, inViewport: true });
    render(<Reveal>content</Reveal>);
    expect(screen.getByText('content').getAttribute('data-reveal')).toBeNull();
  });

  it('hides content that is below the fold, ready to rise in', () => {
    stubEnvironment({ reducedMotion: false, inViewport: false });
    render(<Reveal>content</Reveal>);
    expect(screen.getByText('content').getAttribute('data-reveal')).toBe(
      'hidden',
    );
  });

  it('renders the final state on the server, before any client code runs', () => {
    // Server-rendered HTML carries no `data-reveal` at all, so a visitor whose
    // JS never arrives gets the page in its finished state rather than a blank
    // one. Asserted via renderToString rather than by mocking, because this is
    // a property of the server output specifically.
    stubEnvironment({ reducedMotion: false, inViewport: false });
    return import('react-dom/server').then(({ renderToString }) => {
      const html = renderToString(<Reveal>content</Reveal>);
      expect(html).not.toContain('data-reveal');
      expect(html).toContain('content');
    });
  });
});

describe('Stagger', () => {
  it('steps each sibling 80ms behind the last', () => {
    // Spec §2.3: "stagger siblings by 60-90ms"; S1 names 80.
    expect(STAGGER_STEP_MS).toBe(80);

    stubEnvironment({ reducedMotion: false, inViewport: false });
    const { container } = render(<Stagger items={['one', 'two', 'three']} />);
    const wrappers = [...(container.firstElementChild?.children ?? [])];
    expect(wrappers).toHaveLength(3);

    const styles = wrappers.map((node) => node.getAttribute('style'));
    // The first carries no style attribute at all rather than `0ms` — an
    // absent custom property falls back cleanly in the CSS, so there is nothing
    // to emit.
    expect(styles[0]).toBeNull();
    expect(styles[1]).toContain('80ms');
    expect(styles[2]).toContain('160ms');
  });

  it('renders every item exactly once', () => {
    stubEnvironment({ reducedMotion: false, inViewport: true });
    render(<Stagger items={['one', 'two', 'three']} />);
    for (const label of ['one', 'two', 'three']) {
      expect(screen.getByText(label)).toBeDefined();
    }
  });
});
