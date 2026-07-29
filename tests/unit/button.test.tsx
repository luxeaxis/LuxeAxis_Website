import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Button } from '@/components/Button';

// No @testing-library/jest-dom in this repo (see package.json) — assertions
// use plain DOM properties/attributes instead of its custom matchers.
// `getByRole(role, { name })` still computes the accessible name via
// @testing-library/dom's own accessibility-tree logic, no jest-dom needed.

// Nothing in vitest.config.ts registers @testing-library/react's automatic
// cleanup (no setupFiles), so each render() otherwise accumulates in the
// same jsdom document across tests in this file — explicit per-test cleanup
// is required rather than optional here.
afterEach(cleanup);

describe('Button', () => {
  it('renders a real <button> by default', () => {
    render(<Button>Book a free design audit</Button>);
    const button = screen.getByRole('button', { name: 'Book a free design audit' });
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders a real <a> when given as="a" and href', () => {
    render(
      <Button as="a" href="/audit">
        Book a free design audit
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Book a free design audit' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/audit');
  });

  it('is operable via click and calls onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('tertiary reveals its underline on hover/focus instead of showing it permanently', () => {
    render(
      <Button variant="tertiary" as="a" href="/portfolio">
        Learn more
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Learn more' });
    expect(link.className).toMatch(/\bunderline\b/);
    expect(link.className).toMatch(/\bdecoration-transparent\b/);
    expect(link.className).toMatch(/hover:decoration-current\b/);
    expect(link.className).toMatch(/focus-visible:decoration-current\b/);
  });

  it('the press animation transitions transform alongside colour, not transition-colors alone', () => {
    render(<Button>Book a free design audit</Button>);
    const button = screen.getByRole('button', { name: 'Book a free design audit' });
    // `transition-colors` only ever animates color/background-color/
    // border-color/text-decoration-color/fill/stroke — transform is not in
    // that list, so `active:scale-press` would otherwise snap instantly.
    expect(button.className).toMatch(/\btransition-colors-transform\b/);
    expect(button.className).not.toMatch(/\btransition-colors\b(?!-transform)/);
  });

  it('an icon-only button requires — and exposes — an aria-label as its accessible name', () => {
    render(<Button variant="icon" icon="close" aria-label="Close dialog" />);
    // getByRole with `name` only matches if the computed accessible name is
    // exactly "Close dialog" — the icon itself is aria-hidden and
    // contributes no text, so this proves aria-label is doing the work.
    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button).toBeDefined();
  });

  it('disabled prevents activation', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Book audit
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Book audit' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('loading prevents activation, sets aria-busy/aria-disabled, and keeps the accessible name', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Book a free design audit
      </Button>,
    );
    // The accessible name is still the original label — this query would
    // fail to find anything if loading had replaced it with "Working…".
    const button = screen.getByRole('button', { name: 'Book a free design audit' }) as HTMLButtonElement;
    expect(button.getAttribute('aria-busy')).toBe('true');
    // `loading` is communicated via `aria-disabled`, NOT the native
    // `disabled` attribute — see the next test for why (native `disabled`
    // on the currently-focused element forces a browser blur).
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.disabled).toBe(false);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    // The visible "Working…" swap is a sibling overlay, not a replacement of
    // the accessible name — the original label stays in the DOM (just
    // visually hidden via opacity, which screen readers still expose).
    expect(screen.getByText('Working…')).toBeDefined();
  });

  it('entering loading keeps the just-activated button focused (native disabled would force a blur)', () => {
    // Simulates the realistic sequence: a keyboard/screen-reader user
    // activates the button, and the app's response is to flip it into
    // `loading` (e.g. a controlled `loading` prop driven by submit state).
    const { rerender } = render(<Button>Book a free design audit</Button>);
    const button = screen.getByRole('button', { name: 'Book a free design audit' }) as HTMLButtonElement;
    button.focus();
    expect(document.activeElement).toBe(button);

    rerender(<Button loading>Book a free design audit</Button>);

    // If `loading` set the native `disabled` attribute, the browser would
    // force a blur here, resetting `document.activeElement` to `<body>` and
    // destroying tab position at the one moment it matters most.
    expect(document.activeElement).toBe(button);
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
  });

  it('a click on a loading button does not fire its handler, even though the element stays enabled', () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    const button = screen.getByRole('button', { name: 'Go' }) as HTMLButtonElement;
    button.focus();

    rerender(
      <Button loading onClick={onClick}>
        Go
      </Button>,
    );
    expect(document.activeElement).toBe(button);
    // A guarded handler, not the native `disabled` gate, is what blocks
    // activation now — fireEvent.click still dispatches (the element is
    // enabled), so this proves the guard itself works, not just that the
    // browser suppressed the event.
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  // Note: there is no equivalent "true disabled forces a blur" test here.
  // That blur is a real browser behaviour triggered by mutating the
  // `disabled` DOM property on the focused element — jsdom does not
  // simulate it (verified directly: focusing a button then setting
  // `el.disabled = true` leaves `document.activeElement` unchanged in
  // jsdom), so it isn't something this suite can assert either way. The
  // fix only needs `disabled` to keep using the native attribute for the
  // true-disabled case, which the tests above and below already cover.

  it('a loading anchor keeps its href (still focusable/a link) but blocks navigation and its onClick', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button as="a" href="/audit" loading onClick={onClick}>
        Book audit
      </Button>,
    );
    // Unlike genuine `disabled`, `loading` does NOT strip `href` off an
    // anchor — removing `href` would drop it from the accessibility tree as
    // a link (and blur it, if it were focused) the same way native
    // `disabled` would on a button. `aria-disabled` plus a guarded `onClick`
    // is what makes it un-activatable instead.
    const anchor = container.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBe('/audit');
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(anchor!);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('a disabled (not loading) anchor drops href — genuinely out of the interaction surface', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button as="a" href="/audit" disabled onClick={onClick}>
        Book audit
      </Button>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBeNull();
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(anchor!);
    expect(onClick).not.toHaveBeenCalled();
  });
});
