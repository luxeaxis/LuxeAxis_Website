import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Skeleton } from '@/components/Skeleton';

afterEach(cleanup);

describe('Skeleton', () => {
  it('reserves the final dimensions via inline width/height, not layout that can collapse to 0', () => {
    const { container } = render(<Skeleton variant="block" width="240px" height="120px" />);
    const bone = container.firstElementChild as HTMLElement;
    expect(bone.style.width).toBe('240px');
    expect(bone.style.height).toBe('120px');
  });

  it('defaults to a plausible non-zero size per variant when no width/height is given', () => {
    const { container } = render(<Skeleton variant="circle" />);
    const bone = container.firstElementChild as HTMLElement;
    expect(bone.style.width).not.toBe('');
    expect(bone.style.height).not.toBe('');
  });

  it('the shimmer collapses completely under reduced-motion — both the animation and the moving gradient are stripped, not just paused', () => {
    const { container } = render(<Skeleton variant="text" />);
    const bone = container.firstElementChild as HTMLElement;
    expect(bone.className).toMatch(/\banimate-shimmer\b/);
    // `motion-reduce:animate-none` stops the loop; `motion-reduce:bg-none`
    // additionally removes the gradient image itself, so reduced-motion
    // lands on a flat, single-colour block rather than freezing the sheen
    // mid-sweep at an arbitrary phase.
    expect(bone.className).toMatch(/\bmotion-reduce:animate-none\b/);
    expect(bone.className).toMatch(/\bmotion-reduce:bg-none\b/);
  });

  it('is purely decorative (aria-hidden) by default — no label means no announcement', () => {
    const { container } = render(<Skeleton variant="block" />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it('an explicit label wraps it in a role="status" region with one sr-only announcement', () => {
    render(<Skeleton variant="block" label="Loading portfolio" />);
    const status = screen.getByRole('status');
    expect(status.textContent).toContain('Loading portfolio');
  });

  it('multi-line text renders `lines` bones, the last one narrower', () => {
    const { container } = render(<Skeleton variant="text" lines={3} width="20rem" />);
    const bones = container.querySelectorAll('[aria-hidden="true"]');
    expect(bones).toHaveLength(3);
    expect((bones[0] as HTMLElement).style.width).toBe('20rem');
    expect((bones[2] as HTMLElement).style.width).toBe('75%');
  });
});
