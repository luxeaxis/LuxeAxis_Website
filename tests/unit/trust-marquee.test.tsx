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
    expect(screen.getAllByText('60-Day Handover Guarantee')[0]).toBeDefined();
    expect(screen.getByRole('button', { name: 'Close top announcement bar' })).toBeDefined();
  });

  it('dismisses and unmounts when the close button is clicked', () => {
    render(<TrustMarquee />);
    const closeBtn = screen.getByRole('button', { name: 'Close top announcement bar' });
    fireEvent.click(closeBtn);
    expect(screen.queryByLabelText('Studio trust commitments')).toBeNull();
  });
});
