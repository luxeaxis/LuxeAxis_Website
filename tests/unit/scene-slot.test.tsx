import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SceneSlot } from '@/components/SceneSlot';
import { POSTERS } from '@/three/registry';

describe('SceneSlot', () => {
  it('renders its children as real DOM, independent of any scene', () => {
    render(<SceneSlot id="hero"><h1>Where Space Meets Intelligence</h1></SceneSlot>);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('renders the poster with the claim as alt text', () => {
    render(<SceneSlot id="vastu"><p>copy</p></SceneSlot>);
    expect(screen.getByAltText(POSTERS.vastu.alt)).toBeDefined();
  });

  it('reserves space via aspect-ratio so the slot cannot shift layout', () => {
    const { container } = render(<SceneSlot id="hero"><p>copy</p></SceneSlot>);
    const slot = container.firstElementChild as HTMLElement;
    expect(slot.style.aspectRatio).toBe('16/9');
  });
});
