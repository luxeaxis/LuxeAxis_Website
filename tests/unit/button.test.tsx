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

  it('loading prevents activation, sets aria-busy, and keeps the accessible name', () => {
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
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    // The visible "Working…" swap is a sibling overlay, not a replacement of
    // the accessible name — the original label stays in the DOM (just
    // visually hidden via opacity, which screen readers still expose).
    expect(screen.getByText('Working…')).toBeDefined();
  });

  it('a disabled/loading anchor button does not navigate (no href) and blocks its onClick', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button as="a" href="/audit" loading onClick={onClick}>
        Book audit
      </Button>,
    );
    // Dropping `href` on purpose removes the implicit link role (an <a>
    // without `href` isn't a link to the accessibility tree either), so
    // this queries the tag directly rather than by role.
    const anchor = container.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBeNull();
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(anchor!);
    expect(onClick).not.toHaveBeenCalled();
  });
});
