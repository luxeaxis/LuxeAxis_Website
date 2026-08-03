import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAppStore } from '@/lib/store';
import { GoldAxisRail } from '@/components/GoldAxisRail';

describe('Motion & Scroll Engine', () => {
  it('updates scrollProgress and scrollDirection in Zustand store', () => {
    useAppStore.getState().setScrollProgress(0.45, 'down');
    expect(useAppStore.getState().scrollProgress).toBe(0.45);
    expect(useAppStore.getState().scrollDirection).toBe('down');
  });

  it('renders GoldAxisRail when reducedMotion is false', () => {
    useAppStore.getState().setReducedMotion(false);
    render(<GoldAxisRail />);
    const rail = screen.getByLabelText('Gold Axis scroll progress');
    expect(rail).toBeDefined();
  });

  it('bypasses GoldAxisRail when reducedMotion is true', () => {
    useAppStore.getState().setReducedMotion(true);
    render(<GoldAxisRail />);
    const rail = screen.queryByLabelText('Gold Axis scroll progress');
    expect(rail).toBeNull();
  });
});
