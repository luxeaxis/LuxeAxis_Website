import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { InlineAlert } from '@/components/InlineAlert';

afterEach(cleanup);

describe('InlineAlert', () => {
  it('error is role="alert" (assertive) — the one tone that interrupts', () => {
    render(
      <InlineAlert tone="error" title="We could not save your changes">
        Try again in a moment.
      </InlineAlert>,
    );
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('every non-error tone is role="status" (polite), not role="alert"', () => {
    for (const tone of ['success', 'warning', 'info'] as const) {
      const { unmount } = render(
        <InlineAlert tone={tone} title={`${tone} title`} />,
      );
      expect(screen.getByRole('status')).toBeDefined();
      expect(screen.queryByRole('alert')).toBeNull();
      unmount();
    }
  });

  it('pairs the tone with an icon and text — never colour alone', () => {
    const { container } = render(
      <InlineAlert tone="warning" title="Heads up" />,
    );
    expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByText('Heads up')).toBeDefined();
  });

  it('renders an optional action slot the caller wires up itself', () => {
    render(
      <InlineAlert
        tone="error"
        title="Upload failed"
        action={<button>Retry</button>}
      >
        The file was too large.
      </InlineAlert>,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeDefined();
    expect(screen.getByText('The file was too large.')).toBeDefined();
  });
});
