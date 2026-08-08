import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { PersonaRouter } from '@/components/sections/PersonaRouter';
import { ProofStrip } from '@/components/sections/ProofStrip';
import {
  FeaturedProjects,
  IntelligenceTeaser,
  PricingTeaser,
} from '@/components/sections/Teaser';
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
    vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
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
        headline="Your home, thoughtfully designed. Transparently priced."
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

  it('offers a pause control for the auto-advancing slideshow', () => {
    render_();
    expect(
      screen.getByRole('button', { name: 'Pause slideshow' }),
    ).toBeDefined();
  });

  it('does not mount background video when reduced motion is preferred', () => {
    render_();
    expect(document.querySelector('video')).toBeNull();
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
 * The sections whose content the specs describe but do not supply.
 *
 * Each shows an explicit "To be published" against the named fact rather than
 * disappearing. The tests below hold the line that makes that honest: the
 * placeholder names the gap and NEVER carries a plausible stand-in value. A
 * placeholder is only truthful while it is unmistakably a placeholder.
 */
describe('sections waiting on content that does not exist yet', () => {
  const PENDING_LABELS = ['Projects delivered', 'On-time completion'];

  it('ProofStrip names the measures but publishes no figure', () => {
    render(<ProofStrip stats={[]} pendingLabels={PENDING_LABELS} />);
    expect(screen.getByText('Projects delivered')).toBeDefined();
    expect(screen.getAllByText('To be published').length).toBe(2);
    // The load-bearing assertion: no digit anywhere. An invented statistic is
    // indistinguishable from a real one to a visitor, which is exactly why it
    // must be impossible to ship one by accident.
    const section = document.body.textContent ?? '';
    expect(section).not.toMatch(/\d/);
  });

  it('FeaturedProjects says case studies are pending without inventing one', () => {
    render(<FeaturedProjects projects={[]} />);
    expect(screen.getByText('Case studies are being prepared')).toBeDefined();
    // No project, no neighbourhood, no photograph — a sample project would be a
    // fabricated case study about a client who does not exist.
    expect(document.querySelector('img')).toBeNull();
  });

  it('TestimonialBand says quotes are pending without inventing an attribution', () => {
    render(<TestimonialBand testimonials={[]} />);
    expect(screen.getByText(/To be published/)).toBeDefined();
    // No blockquote: a quote with a made-up name is a fabricated review.
    expect(document.querySelector('blockquote')).toBeNull();
  });

  it('but each appears as soon as content arrives, with no component change', () => {
    const stats: Stat[] = [
      { id: 'delivered', value: 120, label: 'Projects delivered' },
    ];
    const testimonials: Testimonial[] = [
      {
        id: 't1',
        quote: 'They published the price before we asked.',
        attribution: { name: 'A. Client', context: 'Adyar, 3BHK' },
      },
    ];

    render(<ProofStrip stats={stats} pendingLabels={PENDING_LABELS} />);
    expect(screen.getByText('Projects delivered')).toBeDefined();
    // Real figures replace the placeholder entirely — never both at once.
    expect(screen.queryByText('To be published')).toBeNull();
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
    {
      id: 'essential',
      name: 'Essential',
      summary: 'A complete 2 or 3BHK.',
      priceFrom: null,
      inclusions: ['Design'],
    },
  ];

  it('names the fee band as pending rather than inventing a figure', () => {
    render(<PricingTeaser tiers={unpriced} />);
    expect(screen.getByRole('link', { name: /Essential/ })).toBeDefined();
    expect(screen.getByText('Fee band:')).toBeDefined();
    expect(screen.getByText('To be published')).toBeDefined();
    // No currency anywhere: the rupee sign only ever comes from PriceTag, and
    // PriceTag is only reachable once every tier has a real amount. This is the
    // section whose own heading claims the studio publishes its prices, so a
    // placeholder number here would be self-refuting.
    expect(document.body.textContent).not.toMatch(/₹/);
  });

  it('switches to real price bands once every tier has a figure', () => {
    const priced: Tier[] = [{ ...unpriced[0]!, priceFrom: 1840000 }];
    render(<PricingTeaser tiers={priced} />);
    expect(document.body.textContent).toMatch(/₹/);
  });

  it('still leads with the transparency claim either way', () => {
    render(<PricingTeaser tiers={unpriced} />);
    expect(
      screen.getByRole('heading', {
        name: /Most Chennai studios hide the price/,
      }),
    ).toBeDefined();
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
            claim:
              'We check your plan against Vastu in seconds, then a human confirms it.',
            href: '/intelligence/vastu-tech',
            icon: 'compass',
            summary: 'A Vastu grid is laid over your floor plan and scanned.',
          },
        ]}
      />,
    );
    expect(
      screen.getByRole('link', { name: /Vastu-Tech/ }).getAttribute('href'),
    ).toBe('/intelligence/vastu-tech');
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
    const hrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'));
    expect(
      hrefs.some(
        (href) => href?.includes('wa.me') || href?.includes('whatsapp'),
      ),
    ).toBe(false);
  });
});
