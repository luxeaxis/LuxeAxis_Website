import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Chip } from '@/components/Chip';

afterEach(cleanup);

describe('Chip', () => {
  it('a plain chip (no onSelect/onRemove) renders as inert text, not a control', () => {
    render(<Chip>Adyar</Chip>);
    expect(screen.getByText('Adyar')).toBeDefined();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('a selectable chip is a real button reporting aria-pressed, and calls onSelect', () => {
    const onSelect = vi.fn();
    render(
      <Chip selected={false} onSelect={onSelect}>
        Signature
      </Chip>,
    );
    const chip = screen.getByRole('button', { name: 'Signature' });
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(chip);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('selected fills the chip and shows a non-colour check cue, not colour alone', () => {
    render(
      <Chip selected onSelect={() => {}}>
        Signature
      </Chip>,
    );
    const chip = screen.getByRole('button', { name: 'Signature' });
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(chip.querySelector('svg')).not.toBeNull(); // the check icon
  });

  it('a removable chip requires removeLabel — omitting it while passing onRemove throws', () => {
    expect(() => render(<Chip onRemove={() => {}}>Adyar</Chip>)).toThrow(
      /removeLabel/,
    );
  });

  it('the close button is independently labelled and calls onRemove without triggering onSelect', () => {
    const onRemove = vi.fn();
    const onSelect = vi.fn();
    render(
      <Chip
        onSelect={onSelect}
        onRemove={onRemove}
        removeLabel="Remove Adyar filter"
      >
        Adyar
      </Chip>,
    );
    const closeButton = screen.getByRole('button', {
      name: 'Remove Adyar filter',
    });
    fireEvent.click(closeButton);
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
