import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { PriceTag } from '@/components/PriceTag';

afterEach(cleanup);

describe('PriceTag', () => {
  it('formats an amount with Indian digit grouping and the rupee sign', () => {
    render(<PriceTag amount={1840000} />);
    // Lakh notation, shared with the Fee Calculator. This asserted
    // '₹18,40,000' while PriceTag formatted with Intl directly — correct
    // grouping, but a different reading from the calculator a few hundred
    // pixels away on /pricing. One formatter now serves both.
    expect(screen.getByText('₹18.4L')).toBeDefined();
  });

  it('renders an optional period qualifier alongside the figure', () => {
    render(<PriceTag amount={500000} period="onwards" />);
    expect(screen.getByText('onwards')).toBeDefined();
  });

  it('omits the period entirely when none is given', () => {
    const { container } = render(<PriceTag amount={500000} />);
    // Only the figure's own span should be present — no empty qualifier node.
    expect(container.querySelectorAll('span')).toHaveLength(1);
  });
});
