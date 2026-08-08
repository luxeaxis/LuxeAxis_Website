import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  FeatureCard,
  ProjectCard,
  StatCard,
  TierCard,
} from '@/components/Card';

// See tests/unit/button.test.tsx: no automatic RTL cleanup is registered.
afterEach(cleanup);

// StatCard renders StatCounter, a client leaf that needs both browser APIs
// stubbed before mount (see tests/unit/stat-counter.test.tsx).
function stubBrowserApis() {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
  class NoopIntersectionObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal('IntersectionObserver', NoopIntersectionObserver);
}

const projectProps = {
  href: '/portfolio/example',
  title: 'Example project',
  neighbourhood: 'Adyar, Chennai',
  media: {
    kind: 'photo' as const,
    src: '/posters/portfolio.avif',
    alt: '',
    aspect: '4/3' as const,
  },
};

const featureProps = {
  href: '/intelligence/example',
  icon: 'check' as const,
  title: 'Example feature',
};

const tierProps = {
  name: 'Signature' as const,
  price: { amount: 1000000 },
  inclusions: ['One inclusion', 'Another inclusion'],
  cta: { label: 'Book audit', href: '/book-audit' },
};

describe('Card family — the whole-card-link problem', () => {
  it('ProjectCard is exactly one interactive element: the card-wide link, no nested button', () => {
    const { container } = render(<ProjectCard {...projectProps} />);
    const interactive = container.querySelectorAll('a, button');
    expect(interactive).toHaveLength(1);
    expect(interactive[0]?.tagName).toBe('A');
    expect(screen.getByRole('link', { name: /Example project/ })).toBeDefined();
  });

  it('FeatureCard is exactly one interactive element: the card-wide link, no nested button', () => {
    const { container } = render(<FeatureCard {...featureProps} />);
    const interactive = container.querySelectorAll('a, button');
    expect(interactive).toHaveLength(1);
    expect(interactive[0]?.tagName).toBe('A');
  });

  it('TierCard is exactly one interactive element: the CTA button, and the card itself is not a link', () => {
    const { container } = render(<TierCard {...tierProps} />);
    const interactive = container.querySelectorAll('a, button');
    expect(interactive).toHaveLength(1);
    // The CTA renders via Button as="a" — a real anchor, but it is the ONLY
    // one; nothing wraps the whole card in a second, outer link.
    expect(interactive[0]?.tagName).toBe('A');
    expect(screen.getByRole('link', { name: 'Book audit' })).toBeDefined();
    expect(container.querySelector(':scope > a')).toBeNull(); // outer element is a <div>, not an <a>
  });

  it('StatCard has no interactive elements at all — a number and a label, nothing to click', () => {
    stubBrowserApis();
    const { container } = render(<StatCard value={42} label="Example stat" />);
    expect(container.querySelectorAll('a, button')).toHaveLength(0);
    vi.unstubAllGlobals();
  });
});

describe('TierCard — tier and the recommended state', () => {
  it('the recommended tier gets a real, visible text badge — not a colour-only cue', () => {
    render(<TierCard {...tierProps} recommended />);
    const badge = screen.getByText('Recommended');
    // Announced, not merely styled: real text content, not aria-hidden.
    expect(badge.getAttribute('aria-hidden')).toBeNull();
    expect(badge.textContent).toBe('Recommended');
  });

  it('a non-recommended tier renders no "Recommended" text at all', () => {
    render(<TierCard {...tierProps} />);
    expect(screen.queryByText('Recommended')).toBeNull();
  });

  it('the recommended tier also gets the gold-hairline border class, paired with (not instead of) the text badge', () => {
    const { container } = render(<TierCard {...tierProps} recommended />);
    const card = container.firstElementChild;
    expect(card?.className).toMatch(/\bborder-accent\b/);
  });

  it('tier name is real text, not conveyed only via a colour swatch', () => {
    render(<TierCard {...tierProps} />);
    expect(screen.getByText('Signature')).toBeDefined();
  });
});

describe('TierCard — inclusions and price render as real content', () => {
  it('renders every inclusion as list text', () => {
    render(<TierCard {...tierProps} />);
    expect(screen.getByText('One inclusion')).toBeDefined();
    expect(screen.getByText('Another inclusion')).toBeDefined();
  });

  it('renders the formatted price', () => {
    render(<TierCard {...tierProps} />);
    expect(screen.getByText('₹10L')).toBeDefined();
  });
});
