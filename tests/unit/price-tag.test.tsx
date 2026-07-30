import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { PriceTag } from '@/components/PriceTag';

afterEach(cleanup);

describe('PriceTag', () => {
  it('formats an amount with Indian digit grouping and the rupee sign', () => {
    render(<PriceTag amount={1840000} />);
    expect(screen.getByText('₹18,40,000')).toBeDefined();
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
