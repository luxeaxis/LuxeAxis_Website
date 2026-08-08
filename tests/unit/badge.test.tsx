import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Badge } from '@/components/Badge';

afterEach(cleanup);

describe('Badge', () => {
  it('renders its label as real text', () => {
    render(<Badge tone="accent">Signature</Badge>);
    expect(screen.getByText('Signature')).toBeDefined();
  });

  it('a status tone (success/warning/error/info) always pairs with an icon — never colour-only', () => {
    const { container: success } = render(
      <Badge tone="success">Delivered</Badge>,
    );
    const { container: warning } = render(
      <Badge tone="warning">Delayed</Badge>,
    );
    const { container: error } = render(<Badge tone="error">Failed</Badge>);
    const { container: info } = render(<Badge tone="info">Draft</Badge>);
    for (const container of [success, warning, error, info]) {
      expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    }
  });

  it('a plain neutral/accent tone renders no automatic icon (the text itself is the label, not a status)', () => {
    const { container } = render(<Badge tone="neutral">Essential</Badge>);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('an explicit icon overrides the automatic one', () => {
    const { container } = render(
      <Badge tone="success" icon="close">
        Custom
      </Badge>,
    );
    // 'close' renders an "M6 6l12 12" path segment distinct from 'check's.
    expect(container.querySelector('path')?.getAttribute('d')).toMatch(
      /^M6 6l12 12/,
    );
  });
});
