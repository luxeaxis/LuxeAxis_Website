import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { renderWithIntl } from './helpers/render-with-intl';

const pathnameState = vi.hoisted(() => ({ value: '/' }));
vi.mock('@/i18n/navigation', () => ({ usePathname: () => pathnameState.value }));

import { MobileSheet } from '@/components/MobileSheet';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
  pathnameState.value = '/';
});

describe('MobileSheet', () => {
  it('starts closed: no dialog in the DOM, trigger reports aria-expanded=false', () => {
    renderWithIntl(<MobileSheet locale="en" />);
    expect(screen.queryByRole('dialog')).toBeNull();
    const trigger = screen.getByRole('button', { name: 'Open menu' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    // No dangling IDREF: aria-controls is only set once the panel exists.
    expect(trigger.getAttribute('aria-controls')).toBeNull();
  });

  it('opens on trigger click: dialog appears, locks body scroll, and moves focus into the panel', () => {
    renderWithIntl(<MobileSheet locale="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(dialog.contains(document.activeElement)).toBe(true);

    expect(within(dialog).getByRole('heading', { name: 'Menu' })).toBeDefined();
    expect(within(dialog).getByRole('link', { name: 'Pricing' })).toBeDefined();
    expect(within(dialog).getByRole('link', { name: 'Book Audit' }).getAttribute('href')).toBe('/book-audit');
  });

  it('Esc returns focus to the trigger immediately, and the dialog unmounts once its close transition ends', () => {
    renderWithIntl(<MobileSheet locale="en" />);
    const trigger = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');

    fireEvent.keyDown(document, { key: 'Escape' });

    // Focus return happens synchronously in the Esc handler — it does not
    // wait for the close transition (see MobileSheet.tsx's file comment).
    expect(document.activeElement).toBe(trigger);
    // Still mounted: the panel unmounts on `transitionend`, not immediately.
    expect(screen.getByRole('dialog')).toBe(dialog);

    fireEvent.transitionEnd(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('clicking the in-panel close button closes it the same way as Esc', () => {
    renderWithIntl(<MobileSheet locale="en" />);
    const trigger = screen.getByRole('button', { name: 'Open menu' });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close menu' }));
    expect(document.activeElement).toBe(trigger);

    fireEvent.transitionEnd(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
