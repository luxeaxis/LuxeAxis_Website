import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { FeeCalculator } from '@/components/FeeCalculator';
import type { CalculatorConfig } from '@/lib/content/types';

afterEach(cleanup);

// A fixture, never a proposal — see tests/unit/estimate.test.ts.
const FIXTURE: CalculatorConfig = {
  area: { min: 500, max: 5000, step: 50 },
  rates: {
    Essential: { low: 1000, high: 2000 },
    Signature: { low: 2000, high: 3000 },
    Elite: { low: 3000, high: 5000 },
  },
  roundToNearest: 1000,
};

function setup() {
  render(<FeeCalculator config={FIXTURE} />);
  return {
    area: screen.getByLabelText('Carpet area (square feet)') as HTMLInputElement,
    output: document.querySelector('output')!,
  };
}

describe('FeeCalculator', () => {
  it('labels both inputs programmatically, not just visually', () => {
    setup();
    // getByLabelText would throw if the association were only visual.
    expect(screen.getByLabelText('Carpet area (square feet)')).toBeDefined();
    expect(screen.getByRole('group', { name: 'Finish tier' })).toBeDefined();
  });

  it('offers the tiers as real radios, so arrow keys work with no extra handlers', () => {
    setup();
    const radios = screen.getAllByRole('radio');
    expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual([
      'Essential',
      'Signature',
      'Elite',
    ]);
    // sr-only, not display:none — the control has to stay in the tab order and
    // the accessibility tree; the pill drawn around it is only paint.
    for (const radio of radios) {
      expect(radio.className).toContain('sr-only');
    }
  });

  it('defaults to the recommended tier', () => {
    setup();
    expect((screen.getByRole('radio', { name: 'Signature' }) as HTMLInputElement).checked).toBe(true);
  });

  it('announces the result politely without moving focus', () => {
    const { output } = setup();
    // <output> carries an implicit role=status / aria-live=polite. Asserting
    // the element rather than a hand-rolled live region is the point: it is the
    // one built for "a calculated result changed".
    expect(output.tagName).toBe('OUTPUT');
    expect(output.getAttribute('for')).toBeTruthy();
  });

  it('updates the estimate as the area changes', () => {
    const { area, output } = setup();
    fireEvent.change(area, { target: { value: '1000' } });
    // 1000 sq ft at Signature's 2000-3000 band.
    expect(output.textContent).toContain('20,00,000');
    expect(output.textContent).toContain('30,00,000');
  });

  it('updates the estimate when the tier changes', () => {
    const { area, output } = setup();
    fireEvent.change(area, { target: { value: '1000' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Elite' }));
    expect(output.textContent).toContain('30,00,000');
    expect(output.textContent).toContain('50,00,000');
  });

  it('shows a prompt rather than ₹0 when the field is cleared', () => {
    // The failure this guards: an empty field parsing to NaN, coercing to 0 and
    // rendering "₹0" as though it were a real estimate.
    const { area, output } = setup();
    fireEvent.change(area, { target: { value: '' } });
    expect(output.textContent).not.toContain('₹');
    expect(output.textContent).toMatch(/Enter a carpet area/);
  });

  it('says so when it has clamped the area, instead of silently repricing', () => {
    const { area, output } = setup();
    fireEvent.change(area, { target: { value: '50000' } });
    expect(output.textContent).toMatch(/5,000 sq ft/);
    expect(output.textContent).toMatch(/largest this calculator covers/);
  });

  it('states that the number is an estimate, not a quote', () => {
    setup();
    expect(screen.getByText('This is an estimate, not a quote')).toBeDefined();
  });

  it('carries the audit CTA, which is where this journey ends', () => {
    // Spec §2.1's primary path: Home to Residential to Fee Calculator to Audit.
    setup();
    expect(screen.getByRole('link', { name: 'Book Audit' }).getAttribute('href')).toBe(
      '/book-audit',
    );
  });

  it('is not a form, so Enter cannot reload the page', () => {
    // There is nothing to submit — the estimate is derived live. A <form> here
    // would make Enter in the number field navigate away mid-calculation.
    const { container } = render(<FeeCalculator config={FIXTURE} />);
    expect(container.querySelector('form')).toBeNull();
  });
});
