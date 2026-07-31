import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

  // The scrim is the only thing standing between an ivory headline and a
  // bright photograph. No automated gate can catch its absence: axe reports
  // text-over-image as "incomplete" rather than a violation, and the contrast
  // suite only measures flat token pairs. So its presence is asserted here
  // directly — otherwise it can be deleted as "an empty div" and every check
  // stays green right up until real photography ships.
  it('lays a scrim between the poster and its content', () => {
    const { container } = render(<SceneSlot id="hero"><p>copy</p></SceneSlot>);
    const scrim = container.querySelector('[aria-hidden="true"]');
    expect(scrim).not.toBeNull();
    expect(scrim!.className).toContain('opacity-scrim');
  });

  it('keeps the scrim decorative and the content above it', () => {
    const { container } = render(
      <SceneSlot id="hero">
        <h1>Where Space Meets Intelligence</h1>
      </SceneSlot>,
    );
    const scrim = container.querySelector('[aria-hidden="true"]')!;
    // Scoped to this render's container, not `screen`: cleanup between tests
    // is not configured, so earlier renders are still in the document and a
    // global heading query matches several.
    const heading = within(container).getByRole('heading', { level: 1 });

    // Hidden from assistive tech, and never an ancestor of the content — the
    // heading must not inherit aria-hidden from it.
    expect(scrim.getAttribute('aria-hidden')).toBe('true');
    expect(scrim.contains(heading)).toBe(false);
  });
});
