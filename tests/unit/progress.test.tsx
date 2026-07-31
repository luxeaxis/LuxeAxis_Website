import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Progress } from '@/components/Progress';

afterEach(cleanup);

describe('Progress', () => {
  it('exposes a real, rounded aria-valuenow — never fake, never absent', () => {
    render(<Progress value={42.6} label="Uploading floor plan" />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading floor plan' });
    expect(bar.getAttribute('aria-valuenow')).toBe('43');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
  });

  it('clamps out-of-range values instead of reporting an impossible percentage', () => {
    const { rerender } = render(<Progress value={140} label="Uploading" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
    rerender(<Progress value={-20} label="Uploading" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
  });

  it('the visible percentage tracks aria-valuenow', () => {
    render(<Progress value={65} label="Uploading" />);
    expect(screen.getByText('65%')).toBeDefined();
  });

  it('renders the optional step label', () => {
    render(<Progress value={50} label="Uploading" helpText="File 2 of 4" />);
    expect(screen.getByText('File 2 of 4')).toBeDefined();
  });
});
