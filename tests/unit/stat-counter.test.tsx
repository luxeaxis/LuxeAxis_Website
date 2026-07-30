import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { StatCounter } from '@/components/StatCounter';

// Nothing in vitest.config.ts registers @testing-library/react's automatic
// cleanup (no setupFiles) — see tests/unit/button.test.tsx for the same note.
afterEach(cleanup);

// jsdom implements neither API at all (confirmed: `window.matchMedia is not
// a function` / no IntersectionObserver global) — both need stubbing before
// mount, every test, or StatCounter's effect throws.
function stubBrowserApis({ reduceMotion, observe }: { reduceMotion: boolean; observe?: () => void }) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches: reduceMotion, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  );
  class StubIntersectionObserver {
    observe() {
      observe?.();
    }
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal('IntersectionObserver', StubIntersectionObserver);
}

describe('StatCounter', () => {
  it('exposes the final formatted value in the DOM immediately, in an sr-only node', () => {
    stubBrowserApis({ reduceMotion: false });
    render(<StatCounter value={1240} />);
    // Present at first render, before any effect/observer/animation frame
    // has had a chance to run — this is the literal "final value must be in
    // the DOM for assistive tech immediately" requirement.
    const [srText] = screen.getAllByText('1,240');
    expect(srText?.className).toMatch(/\bsr-only\b/);
    vi.unstubAllGlobals();
  });

  it('renders a second, aria-hidden node for the animated visual (never the sr-only one)', () => {
    stubBrowserApis({ reduceMotion: false });
    const { container } = render(<StatCounter value={1240} />);
    const hidden = container.querySelector('[aria-hidden="true"]');
    expect(hidden).not.toBeNull();
    expect(hidden?.className).not.toMatch(/\bsr-only\b/);
    expect(hidden?.textContent).toBe('1,240');
    vi.unstubAllGlobals();
  });

  it('applies prefix and suffix to both the accessible and visual value', () => {
    stubBrowserApis({ reduceMotion: false });
    render(<StatCounter value={98} prefix="₹" suffix="%" />);
    expect(screen.getAllByText('₹98%')).toHaveLength(2); // sr-only + aria-hidden
    vi.unstubAllGlobals();
  });

  it('under reduced motion, renders the final value with no animation — no observer is ever attached', () => {
    const observeSpy = vi.fn();
    stubBrowserApis({ reduceMotion: true, observe: observeSpy });
    render(<StatCounter value={42} />);
    expect(screen.getAllByText('42')).toHaveLength(2);
    expect(observeSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('formats decimals', () => {
    stubBrowserApis({ reduceMotion: false });
    render(<StatCounter value={4.5} decimals={1} />);
    expect(screen.getAllByText('4.5')).toHaveLength(2);
    vi.unstubAllGlobals();
  });
});
