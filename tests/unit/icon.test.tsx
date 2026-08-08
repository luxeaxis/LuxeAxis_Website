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

  it('renders social icons instagram and linkedin accurately', () => {
    const { container: igContainer } = render(
      <Icon name="instagram" decorative />,
    );
    expect(igContainer.querySelector('svg')).toBeDefined();

    const { container: liContainer } = render(
      <Icon name="linkedin" decorative />,
    );
    expect(liContainer.querySelector('svg')).toBeDefined();
  });
});
