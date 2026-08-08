import { describe, expect, it, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';

describe('BeforeAfterSlider (T-16)', () => {
  afterEach(() => {
    cleanup();
  });
  const beforeImage = {
    src: '/posters/hero.avif',
    alt: 'Original space before renovation',
  };
  const afterImage = {
    src: '/posters/hero.avif',
    alt: 'Finished luxury interior after renovation',
  };

  it('renders slider element with accessibility role and initial value', () => {
    const { getByRole } = render(
      <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />,
    );
    const slider = getByRole('slider', {
      name: /Before and after renovation comparison slider/i,
    });
    expect(slider).toBeDefined();
    expect(slider.getAttribute('aria-valuenow')).toBe('50');
  });

  it('responds to keyboard ArrowLeft and ArrowRight navigation', () => {
    const { getByRole } = render(
      <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />,
    );
    const slider = getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider.getAttribute('aria-valuenow')).toBe('45');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider.getAttribute('aria-valuenow')).toBe('50');
  });

  it('responds to Home and End keys', () => {
    const { getByRole } = render(
      <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />,
    );
    const slider = getByRole('slider');

    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider.getAttribute('aria-valuenow')).toBe('0');

    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider.getAttribute('aria-valuenow')).toBe('100');
  });
});
