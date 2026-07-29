import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Link } from '@/components/Link';

afterEach(cleanup);

describe('Link', () => {
  it('renders a real, keyboard-operable <a> for an internal href', () => {
    render(<Link href="/portfolio">Our portfolio</Link>);
    const link = screen.getByRole('link', { name: 'Our portfolio' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/portfolio');
    // A real anchor is natively focusable and Enter-activatable — no
    // tabindex tampering here that would take it out of the tab order.
    expect(link.getAttribute('tabindex')).toBeNull();
  });

  it('always shows an underline — the non-colour affordance never depends on hover', () => {
    render(<Link href="/portfolio">Our portfolio</Link>);
    const link = screen.getByRole('link', { name: 'Our portfolio' });
    expect(link.className).toMatch(/\bunderline\b/);
    // No hover-only class family (e.g. a `hover:underline` that implies no
    // underline beforehand) — the class list must not contain the
    // no-underline utility at all.
    expect(link.className).not.toMatch(/\bno-underline\b/);
  });

  it('treats an absolute URL as external: new tab, noopener/noreferrer', () => {
    render(<Link href="https://example.com/press">Press coverage</Link>);
    const link = screen.getByRole('link', { name: 'Press coverage' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does not force external handling onto an internal href', () => {
    render(<Link href="/contact">Contact us</Link>);
    const link = screen.getByRole('link', { name: 'Contact us' });
    expect(link.getAttribute('target')).toBeNull();
  });

  describe('standalone variant', () => {
    it('lays out the underline at rest but hides it via a transparent decoration colour, revealed on hover', () => {
      render(
        <Link href="/portfolio" variant="standalone">
          Our portfolio
        </Link>,
      );
      const link = screen.getByRole('link', { name: 'Our portfolio' });
      // Still `underline` (the line is laid out — text isn't the only
      // thing there) but coloured away at rest, and drawn back in via
      // `hover:`/`focus-visible:decoration-current` — never a plain
      // `hover:underline` that implies no line exists beforehand.
      expect(link.className).toMatch(/\bunderline\b/);
      expect(link.className).toMatch(/\bdecoration-transparent\b/);
      expect(link.className).toMatch(/hover:decoration-current\b/);
      expect(link.className).toMatch(/focus-visible:decoration-current\b/);
    });

    it('pairs the hover underline reveal with a text-colour change — never colour alone', () => {
      render(
        <Link href="/portfolio" variant="standalone">
          Our portfolio
        </Link>,
      );
      const link = screen.getByRole('link', { name: 'Our portfolio' });
      expect(link.className).toMatch(/\btext-on-surface-2\b/);
      expect(link.className).toMatch(/hover:text-on-surface\b/);
    });

    it('keeps a distinguishable, persistent underline colour on the current page', () => {
      render(
        <Link href="/portfolio" variant="standalone" aria-current="page">
          Our portfolio
        </Link>,
      );
      const link = screen.getByRole('link', { name: 'Our portfolio' });
      expect(link.getAttribute('aria-current')).toBe('page');
      expect(link.className).toMatch(/aria-\[current=page\]:decoration-accent\b/);
    });
  });
});
