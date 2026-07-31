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
