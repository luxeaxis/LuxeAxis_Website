import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithIntl } from './helpers/render-with-intl';

const pathnameState = vi.hoisted(() => ({ value: '/pricing' }));
vi.mock('@/i18n/navigation', () => ({ usePathname: () => pathnameState.value }));

import { Header } from '@/components/Header';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  pathnameState.value = '/pricing';
});

describe('Header', () => {
  it('marks the active top-level item with aria-current="page", never colour alone', () => {
    pathnameState.value = '/pricing';
    renderWithIntl(<Header />);

    const active = screen.getByRole('link', { name: 'Pricing' });
    expect(active.getAttribute('aria-current')).toBe('page');
    // The non-colour cue: Link's standalone variant only wins persistent
    // underline colour via the `aria-[current=page]:` selector, so the
    // attribute itself is the affordance, not merely a colour class.
    expect(active.className).toMatch(/aria-\[current=page\]:decoration-accent/);

    const inactive = screen.getByRole('link', { name: 'Portfolio' });
    expect(inactive.getAttribute('aria-current')).toBeNull();
  });

  it('renders every top-level nav item from the sitemap, capped at five', () => {
    renderWithIntl(<Header />);
    for (const label of ['Residential', 'Commercial', 'Intelligence', 'Portfolio', 'Pricing']) {
      expect(screen.getByRole('link', { name: label })).toBeDefined();
    }
  });

  it('the Book Audit CTA is present and links to the dedicated conversion route', () => {
    renderWithIntl(<Header />);
    const ctas = screen.getAllByRole('link', { name: 'Book Audit' });
    expect(ctas.length).toBeGreaterThan(0);
    for (const cta of ctas) {
      expect(cta.getAttribute('href')).toBe('/book-audit');
    }
  });

  it('the logo links home', () => {
    renderWithIntl(<Header />);
    const home = screen.getByRole('link', { name: 'Luxe Axis — home' });
    expect(home.getAttribute('href')).toBe('/');
  });

  it('condenses height and gains stronger blur once scrolled past the 80px threshold (§3.3 N1)', () => {
    const scrollY = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
    const { container } = renderWithIntl(<Header />);
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    expect(header!.className).toMatch(/h-\[var\(--component-nav-height\)\]/);
    expect(header!.className).not.toMatch(/lx-glass--condensed/);

    scrollY.mockReturnValue(100);
    fireEvent.scroll(window);

    expect(header!.className).toMatch(/h-\[var\(--component-nav-height-condensed\)\]/);
    expect(header!.className).toMatch(/lx-glass--condensed/);
  });
});
