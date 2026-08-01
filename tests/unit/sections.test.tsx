import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { PersonaRouter } from '@/components/sections/PersonaRouter';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { FeaturedProjects, IntelligenceTeaser, PricingTeaser } from '@/components/sections/Teaser';
import { CTASection, TestimonialBand } from '@/components/sections/CTASection';
import type { Persona, Stat, Testimonial, Tier } from '@/lib/content/types';

// StatCounter (inside StatCard) reads matchMedia and IntersectionObserver on
// mount, and jsdom implements neither — see tests/unit/stat-counter.test.tsx,
// which stubs the same pair for the same reason. Reduced motion is stubbed ON
// so the count-up never starts: these tests are about which sections render,
// not about the tween, and a running rAF loop would make them flaky for no gain.
beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  );
  class StubIntersectionObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal('IntersectionObserver', StubIntersectionObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const PERSONA: Persona = {
  id: 'homeowner',
  label: 'I own a flat in Chennai',
  question: 'Can I afford a premium job, and what will it cost?',
  href: '/residential',
  cta: 'Book free audit',
};

describe('Hero', () => {
  const render_ = () =>
    render(
      <Hero
        headline="Your Chennai home, thoughtfully designed. Transparently priced."
        sub="AI-assisted design, Vastu-smart, delivered on a 60-day handover guarantee."
        trustPoints={['Transparent pricing', '60-day handover guarantee']}
      />,
    );

  it('makes the headline the only h1 on the section', () => {
    render_();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]!.textContent).toContain('Transparently priced');
  });

  it('offers one primary and one secondary action, not two competing primaries', () => {
    // Landing Blueprint §2: "Never two competing primaries in one viewport —
    // one gold button, everything else quieter."
    render_();
    expect(screen.getByRole('link', { name: 'Book Audit' })).toBeDefined();
    expect(screen.getByRole('link', { name: /See your price/ })).toBeDefined();
  });

  it('renders the trust strip as a list, so its shape is announced', () => {
    render_();
    const items = screen.getAllByRole('listitem');
    expect(items.map((li) => li.textContent)).toEqual([
      'Transparent pricing',
      '60-day handover guarantee',
    ]);
  });
});

describe('PersonaRouter', () => {
  it('gives each persona one link carrying its label and question', () => {
    render(<PersonaRouter personas={[PERSONA]} />);
    const link = screen.getByRole('link', { name: /I own a flat in Chennai/ });
    expect(link.getAttribute('href')).toBe('/residential');
    // One link per tile, never a nested control — the trap components/Card.tsx
    // makes unrepresentable.
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByText(PERSONA.question)).toBeDefined();
  });

  it('renders nothing at all when there are no personas', () => {
    const { container } = render(<PersonaRouter personas={[]} />);
    expect(container.innerHTML).toBe('');
  });
});

/**
 * The sections whose content the specs describe but do not supply. Rendering
 * nothing is the specified behaviour, not a placeholder state — see
 * lib/content/source.ts. These tests exist so that "shows up empty" can never
 * be quietly replaced by "shows up with invented proof".
 */
describe('sections gated on content that does not exist yet', () => {
  it('ProofStrip renders nothing without real statistics', () => {
    const { container } = render(<ProofStrip stats={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('FeaturedProjects renders nothing without real projects', () => {
    const { container } = render(<FeaturedProjects projects={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('TestimonialBand renders nothing without a real, attributed quote', () => {
    const { container } = render(<TestimonialBand testimonials={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('but each appears as soon as content arrives, with no component change', () => {
    const stats: Stat[] = [{ id: 'delivered', value: 120, label: 'Projects delivered' }];
    const testimonials: Testimonial[] = [
      {
        id: 't1',
        quote: 'They published the price before we asked.',
        attribution: { name: 'A. Client', context: 'Adyar, 3BHK' },
      },
    ];

    const { container: statContainer } = render(<ProofStrip stats={stats} />);
    expect(statContainer.innerHTML).not.toBe('');
    expect(screen.getByText('Projects delivered')).toBeDefined();
    // StatCounter keeps the final value in the DOM from first paint.
    expect(screen.getAllByText('120').length).toBeGreaterThan(0);

    cleanup();
    render(<TestimonialBand testimonials={testimonials} />);
    expect(screen.getByText(/published the price/)).toBeDefined();
    expect(screen.getByText(/A. Client/)).toBeDefined();
  });
});

describe('PricingTeaser', () => {
  const unpriced: Tier[] = [
    { id: 'essential', name: 'Essential', summary: 'A complete 2 or 3BHK.', priceFrom: null, inclusions: ['Design'] },
  ];

  it('shows the tier structure without inventing a figure while prices are unpublished', () => {
    render(<PricingTeaser tiers={unpriced} />);
    expect(screen.getByRole('link', { name: /Essential/ })).toBeDefined();
    // No currency anywhere: the rupee sign only ever comes from PriceTag, and
    // PriceTag is only reachable once every tier has a real amount.
    expect(document.body.textContent).not.toMatch(/₹/);
  });

  it('switches to real price bands once every tier has a figure', () => {
    const priced: Tier[] = [{ ...unpriced[0]!, priceFrom: 1840000 }];
    render(<PricingTeaser tiers={priced} />);
    expect(document.body.textContent).toMatch(/₹/);
  });

  it('still leads with the transparency claim either way', () => {
    render(<PricingTeaser tiers={unpriced} />);
    expect(screen.getByRole('heading', { name: /Most Chennai studios hide the price/ })).toBeDefined();
  });
});

describe('IntelligenceTeaser', () => {
  it('renders one card per feature, each linking into /intelligence', () => {
    render(
      <IntelligenceTeaser
        features={[
          {
            id: 'vastu-tech',
            name: 'Vastu-Tech',
            claim: 'We check your plan against Vastu in seconds, then a human confirms it.',
            href: '/intelligence/vastu-tech',
            icon: 'compass',
          },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: /Vastu-Tech/ }).getAttribute('href')).toBe(
      '/intelligence/vastu-tech',
    );
  });
});

describe('CTASection', () => {
  it('repeats the primary action and names the reassurance', () => {
    render(<CTASection />);
    expect(screen.getByRole('link', { name: 'Book Audit' })).toBeDefined();
    expect(screen.getByText(/No obligation, no hard sell/)).toBeDefined();
    expect(screen.getByText(/not a bot/)).toBeDefined();
  });

  it('links nothing it cannot honour', () => {
    // The blueprint names WhatsApp as the low-friction rung, but no number has
    // been supplied. Better absent than wired to a placeholder that fails on
    // the highest-value click on the page.
    render(<CTASection />);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs.some((href) => href?.includes('wa.me') || href?.includes('whatsapp'))).toBe(false);
  });
});
