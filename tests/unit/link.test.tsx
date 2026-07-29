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
});
