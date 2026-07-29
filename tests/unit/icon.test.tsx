import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Icon } from '@/components/Icon';

afterEach(cleanup);

describe('Icon', () => {
  it('labelled usage exposes an accessible name via role=img', () => {
    render(<Icon name="alert-circle" label="Error" />);
    expect(screen.getByRole('img', { name: 'Error' })).toBeDefined();
  });

  it('decorative usage is hidden from assistive tech', () => {
    const { container } = render(<Icon name="check" decorative />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('role')).toBeNull();
  });

  // Icon-only accessibility is enforced at the type level, not just at
  // runtime: `IconProps` is `{ label: string } | { decorative: true }` with
  // no default for either, so this is a compile-time check as much as a
  // behavioural one — the two branches above are the only two ways to
  // construct valid props at all.
});
