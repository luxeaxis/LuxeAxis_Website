import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { TrustMarquee } from '@/components/TrustMarquee';

afterEach(() => {
  cleanup();
});

describe('TrustMarquee', () => {
  it('renders the top marquee strip with trust commitments', () => {
    render(<TrustMarquee />);
    const bar = screen.getByLabelText('Studio trust commitments');
    expect(bar).toBeDefined();
    expect(screen.getAllByText('Flat Post-Handover Warranty')[0]).toBeDefined();
    // Not a figure. The strip renders on every route from the root layout, so
    // it has no tier context to qualify one with — 60 days is Signature's
    // commitment, Essential's is 45 and Elite's is milestone-based.
    expect(
      screen.getAllByText('Committed Handover Date, Per Tier')[0],
    ).toBeDefined();
    expect(screen.queryByText(/\d+-Day Handover Guarantee/)).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Close top announcement bar' }),
    ).toBeDefined();
  });

  it('dismisses and unmounts when the close button is clicked', () => {
    render(<TrustMarquee />);
    const closeBtn = screen.getByRole('button', {
      name: 'Close top announcement bar',
    });
    fireEvent.click(closeBtn);
    expect(screen.queryByLabelText('Studio trust commitments')).toBeNull();
  });
});
