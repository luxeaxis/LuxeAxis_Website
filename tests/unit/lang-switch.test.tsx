import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import { renderWithIntl } from './helpers/render-with-intl';

// `usePathname` (i18n/navigation.ts) resolves to `null` in this environment
// (no real Next.js router) — mocked here so each test controls exactly what
// "current route" LangSwitch reasons about, independent of that fallback.
const pathnameState = vi.hoisted(() => ({ value: '/' }));
vi.mock('@/i18n/navigation', () => ({ usePathname: () => pathnameState.value }));

import { LangSwitch } from '@/components/LangSwitch';

afterEach(() => {
  cleanup();
  pathnameState.value = '/';
});

describe('LangSwitch', () => {
  it('on the published root, reading English: EN is current, தமிழ் is an offered link to /ta', () => {
    pathnameState.value = '/';
    renderWithIntl(<LangSwitch locale="en" />, 'en');

    const en = screen.getByText('EN');
    expect(en.getAttribute('aria-current')).toBe('true');
    expect(en.tagName).not.toBe('A');

    const ta = screen.getByRole('link', { name: 'தமிழ்' });
    expect(ta.getAttribute('href')).toBe('/ta');
  });

  it('on the published root, reading Tamil: தமிழ் is current, EN links back to English', () => {
    pathnameState.value = '/';
    renderWithIntl(<LangSwitch locale="ta" />, 'ta');

    const ta = screen.getByText('தமிழ்');
    expect(ta.getAttribute('aria-current')).toBe('true');

    const en = screen.getByRole('link', { name: 'EN' });
    expect(en.getAttribute('href')).toBe('/');
  });

  it('is absent entirely on a route with no Tamil translation while reading English', () => {
    pathnameState.value = '/pricing';
    const { container } = renderWithIntl(<LangSwitch locale="en" />, 'en');
    expect(container.querySelector('nav[aria-label="Language"]')).toBeNull();
  });

  it('never renders a தமிழ் link into an unpublished route (would 307 straight back)', () => {
    pathnameState.value = '/pricing';
    renderWithIntl(<LangSwitch locale="en" />, 'en');
    expect(screen.queryByText('தமிழ்')).toBeNull();
  });
});
