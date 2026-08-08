import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { Tooltip } from '@/components/Tooltip';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// Fake-timer advances that cross a `setTimeout` boundary trigger a React
// state update (`setOpen`) outside of any React-aware event — without
// wrapping the advance itself in `act()`, the resulting re-render is not
// guaranteed to have flushed before the very next assertion runs.
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('Tooltip', () => {
  it('does not appear immediately on hover — it waits out the 240ms open delay', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Book a 30-minute audit call">
        <button>Book audit</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Book audit' }));
    expect(screen.queryByRole('tooltip')).toBeNull();
    advance(239);
    expect(screen.queryByRole('tooltip')).toBeNull();
    advance(1);
    expect(screen.getByRole('tooltip').textContent).toBe(
      'Book a 30-minute audit call',
    );
  });

  it('opens on focus as well as hover — not hover-only', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint text">
        <button>Trigger</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button', { name: 'Trigger' }));
    advance(240);
    expect(screen.getByRole('tooltip')).toBeDefined();
  });

  it('wires the trigger to the tooltip content via aria-describedby once open, not before', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint text">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger.getAttribute('aria-describedby')).toBeNull();
    fireEvent.focus(trigger);
    advance(240);
    const tooltip = screen.getByRole('tooltip');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('closes with 0 delay on mouse leave / blur — no lingering timer', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint text">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.mouseEnter(trigger);
    advance(240);
    expect(screen.getByRole('tooltip')).toBeDefined();
    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('a hover that ends before the open delay elapses never opens the tooltip at all', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint text">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.mouseEnter(trigger);
    advance(100);
    fireEvent.mouseLeave(trigger);
    advance(1000);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('Esc dismisses an already-open tooltip (§5 "Esc closes layers")', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Hint text">
        <button>Trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    advance(240);
    expect(screen.getByRole('tooltip')).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('composes onto a handler the trigger already carries, rather than replacing it', () => {
    vi.useFakeTimers();
    const onFocus = vi.fn();
    render(
      <Tooltip content="Hint text">
        <button onFocus={onFocus}>Trigger</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button', { name: 'Trigger' }));
    expect(onFocus).toHaveBeenCalledTimes(1);
  });
});
