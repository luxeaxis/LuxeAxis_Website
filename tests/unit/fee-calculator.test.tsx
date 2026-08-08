import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FeeCalculator } from '@/components/FeeCalculator';
import type { CalculatorConfig } from '@/lib/content/types';

afterEach(cleanup);

/** A fixture, not a proposal — the real list is asserted in estimate.test.ts. */
const FIXTURE: CalculatorConfig = {
  brackets: [
    {
      id: '2bhk',
      label: '2BHK',
      area: { min: 800, max: 1_200 },
      tiers: ['Essential', 'Signature'],
      projectCost: { low: 700_000, high: 1_500_000 },
      designFee: { low: 75_000, high: 180_000 },
    },
    {
      id: 'villa',
      label: 'Villa',
      area: { min: 2_000, max: null },
      tiers: ['Signature', 'Elite'],
      projectCost: { low: 2_500_000, high: 8_000_000 },
      designFee: { low: 300_000, high: 1_200_000 },
    },
  ],
};

const setup = () => render(<FeeCalculator config={FIXTURE} />);

describe('FeeCalculator', () => {
  it('asks for property type as a real radio group', () => {
    setup();
    expect(
      screen.getByRole('group', { name: 'What kind of home is it?' }),
    ).toBeDefined();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('starts with nothing chosen, rather than guessing at the visitor’s home', () => {
    // Any seeded default is an assumption, and the first figure shown would be
    // for somebody else's property.
    setup();
    for (const radio of screen.getAllByRole('radio')) {
      expect((radio as HTMLInputElement).checked).toBe(false);
    }
    expect(document.querySelector('output')!.textContent).toMatch(
      /Pick a property type/,
    );
  });

  it('shows the typical area against each option, for anyone unsure', () => {
    setup();
    expect(screen.getByText('800–1,200 sq ft')).toBeDefined();
    expect(screen.getByText('2,000+ sq ft')).toBeDefined();
  });

  it('publishes the whole project cost AND the design fee within it', () => {
    // Showing only the total makes a visitor suspect the fee is buried in it;
    // showing only the fee hides the number they need to budget.
    setup();
    fireEvent.click(screen.getByRole('radio', { name: /2BHK/ }));
    const output = document.querySelector('output')!.textContent!;
    expect(output).toContain('₹7L to ₹15L');
    expect(output).toContain('₹75,000 to ₹1.8L');
  });

  it('names which tiers serve the choice', () => {
    setup();
    fireEvent.click(screen.getByRole('radio', { name: /Villa/ }));
    expect(document.querySelector('output')!.textContent).toContain(
      'Signature or Elite',
    );
  });

  it('announces the result politely, without stealing focus', () => {
    setup();
    const output = document.querySelector('output')!;
    // <output> is implicitly role=status / aria-live=polite — the element built
    // for "a calculated result changed", rather than a hand-rolled live region.
    expect(output.tagName).toBe('OUTPUT');
    expect(output.getAttribute('for')).toBeTruthy();
  });

  it('says these are ranges rather than a quote', () => {
    setup();
    expect(
      screen.getByText('These are published ranges, not a quote'),
    ).toBeDefined();
  });

  it('is not a form, so Enter cannot reload the page', () => {
    const { container } = setup();
    expect(container.querySelector('form')).toBeNull();
  });

  it('carries the audit CTA, where this journey ends', () => {
    setup();
    expect(
      screen.getByRole('link', { name: 'Book Audit' }).getAttribute('href'),
    ).toBe('/book-audit');
  });
});
