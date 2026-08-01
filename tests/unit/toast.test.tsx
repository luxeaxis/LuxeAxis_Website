import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ToastProvider, useToast, type ToastInput } from '@/components/Toast';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function Trigger(toast: ToastInput) {
  const push = useToast();
  return <button onClick={() => push(toast)}>Push</button>;
}

function MultiTrigger() {
  const push = useToast();
  return (
    <div>
      <button onClick={() => push({ title: 'One' })}>Push One</button>
      <button onClick={() => push({ title: 'Two' })}>Push Two</button>
      <button onClick={() => push({ title: 'Three' })}>Push Three</button>
      <button onClick={() => push({ title: 'Four' })}>Push Four</button>
    </div>
  );
}

describe('Toast', () => {
  it('useToast() throws when called outside a ToastProvider — a caller cannot silently no-op', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bare() {
      useToast();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it('a non-error tone announces via role="status" (polite)', () => {
    render(
      <ToastProvider>
        <Trigger title="Saved" tone="success" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));
    const toast = screen.getByRole('status');
    expect(toast.textContent).toContain('Saved');
  });

  it('an error toast is role="alert" (assertive), not role="status"', () => {
    render(
      <ToastProvider>
        <Trigger title="Failed to save" tone="error" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));
    expect(screen.getByRole('alert').textContent).toContain('Failed to save');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('caps the visible stack at 3, dropping the oldest', () => {
    render(
      <ToastProvider>
        <MultiTrigger />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push One' }));
    fireEvent.click(screen.getByRole('button', { name: 'Push Two' }));
    fireEvent.click(screen.getByRole('button', { name: 'Push Three' }));
    fireEvent.click(screen.getByRole('button', { name: 'Push Four' }));

    expect(screen.queryByText('One')).toBeNull();
    expect(screen.getByText('Two')).toBeDefined();
    expect(screen.getByText('Three')).toBeDefined();
    expect(screen.getByText('Four')).toBeDefined();
  });

  it('auto-dismisses after its dwell time (once the exit transition ends), and hover pauses the timer', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger title="Saved" tone="success" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));
    const toast = screen.getByRole('status');

    fireEvent.mouseEnter(toast);
    act(() => {
      vi.advanceTimersByTime(10_000); // well past the 5s dwell — paused, still here
    });
    expect(screen.getByRole('status')).toBeDefined();

    fireEvent.mouseLeave(toast);
    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    fireEvent.transitionEnd(toast);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('does not lose dwell time when hover and focus overlap', () => {
    // The bug: hover and focus each called the same `pause`, so reaching the
    // close button by keyboard (which passes through both) subtracted the
    // elapsed time twice. The toast then resumed owing far less than it
    // should and could vanish almost immediately — on the keyboard user the
    // pause exists to protect.
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger title="Saved" tone="success" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));
    const toast = screen.getByRole('status');

    // 4s of the 5s dwell burnt, then hover AND focus — the double-subtract
    // would leave roughly -3s remaining, i.e. dismiss on the next tick.
    act(() => {
      vi.advanceTimersByTime(4_000);
    });
    fireEvent.mouseEnter(toast);
    fireEvent.focus(toast);

    fireEvent.mouseLeave(toast);
    fireEvent.blur(toast);

    // Only the genuine ~1s should be left, so this is short of it.
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.queryByRole('status'), 'dismissed early — dwell was over-subtracted').not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    fireEvent.transitionEnd(toast);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('stays paused while focus remains on it after the pointer leaves', () => {
    // The mirror-image bug: pointer and keyboard were independent triggers for
    // the same resume, so moving the mouse away restarted the countdown even
    // though the close button still held focus. A toast timing out while
    // focused is the least defensible moment for auto-dismiss.
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger title="Saved" tone="success" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));
    const toast = screen.getByRole('status');

    fireEvent.mouseEnter(toast);
    fireEvent.focus(toast);
    fireEvent.mouseLeave(toast); // pointer gone, focus stays

    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(screen.queryByRole('status'), 'timed out while still focused').not.toBeNull();

    // Only once focus leaves too does the clock start again.
    fireEvent.blur(toast);
    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    fireEvent.transitionEnd(toast);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('the manual close button dismisses it immediately (once the exit transition ends), without waiting for the dwell', () => {
    render(
      <ToastProvider>
        <Trigger title="Saved" tone="success" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));
    const toast = screen.getByRole('status');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    fireEvent.transitionEnd(toast);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('a neutral toast (no tone) renders only its close icon — no status icon, unlike a toned one', () => {
    const { unmount } = render(
      <ToastProvider>
        <Trigger title="Plain notice" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));
    // Just the manual-close button's icon — no leading status glyph.
    expect(screen.getByRole('status').querySelectorAll('svg')).toHaveLength(1);
    unmount();

    render(
      <ToastProvider>
        <Trigger title="Saved" tone="success" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Push' }));
    // Status glyph + close icon.
    expect(screen.getByRole('status').querySelectorAll('svg')).toHaveLength(2);
  });
});
