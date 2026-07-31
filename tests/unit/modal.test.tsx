import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useState } from 'react';
import { Modal } from '@/components/Modal';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm booking">
        <p>Body copy.</p>
        <button>Confirm</button>
      </Modal>
    </div>
  );
}

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens as a labelled, modal dialog: moves focus inside it and locks body scroll', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByRole('heading', { name: 'Confirm booking' })).toBeDefined();
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('Esc returns focus to the trigger immediately, and the dialog unmounts once its close transition ends', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open modal' });
    // Focus capture reads `document.activeElement` at the moment the modal
    // opens — real browsers focus a button on click (jsdom does not), so
    // this makes the trigger's pre-open focus state explicit rather than
    // relying on a click side-effect jsdom doesn't emulate. A real keyboard
    // user activating the trigger via Enter/Space necessarily has it
    // focused already, which is exactly what this reproduces.
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.activeElement).toBe(trigger);
    // Still mounted: unmounts on transitionend, not immediately.
    expect(screen.getByRole('dialog')).toBe(dialog);

    fireEvent.transitionEnd(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('the scrim closes the dialog and returns focus, same as Esc', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open modal' });
    trigger.focus(); // see the Esc test's comment on why this is explicit
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');

    // The scrim is a real <button>, aria-hidden and out of tab order, whose
    // only job is the click-outside-closes affordance (see Modal.tsx).
    const scrim = document.querySelector('button[aria-hidden="true"]') as HTMLElement;
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim);

    expect(document.activeElement).toBe(trigger);
    fireEvent.transitionEnd(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('the in-panel close button closes it the same way', () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open modal' });
    trigger.focus(); // see the Esc test's comment on why this is explicit
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(document.activeElement).toBe(trigger);
    fireEvent.transitionEnd(dialog);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Tab from the last focusable wraps forward to the first (the trap boundary)', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    const dialog = screen.getByRole('dialog');
    const focusables = dialog.querySelectorAll('a[href], button:not([disabled])');
    const first = focusables[0] as HTMLElement;
    const last = focusables[focusables.length - 1] as HTMLElement;
    expect(focusables.length).toBeGreaterThan(1);

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
  });

  it('Shift+Tab from the first focusable wraps backward to the last', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    const dialog = screen.getByRole('dialog');
    const focusables = dialog.querySelectorAll('a[href], button:not([disabled])');
    const first = focusables[0] as HTMLElement;
    const last = focusables[focusables.length - 1] as HTMLElement;

    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('scroll lock is released once the close transition ends', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
    expect(document.body.style.overflow).toBe('hidden');
    const dialog = screen.getByRole('dialog');

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.transitionEnd(dialog);
    expect(document.body.style.overflow).toBe('');
  });

  it('scroll lock is released even when the component unmounts outright without ever closing first', () => {
    function AlwaysOpen() {
      return (
        <Modal open onClose={() => {}} title="Confirm">
          <p>Body</p>
        </Modal>
      );
    }
    const { unmount } = render(<AlwaysOpen />);
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

// Regression: the trap used to act only when focus sat exactly on the first or
// last focusable. Focus can legitimately be OUTSIDE an open dialog — returning
// from browser chrome lands on the document's first focusable, which is the
// skip link, not the panel. Neither boundary branch fired there, so Tab walked
// the whole background. `aria-modal` hides that content from screen readers but
// does nothing for keyboard order, so the JS trap is the only thing holding it.
describe('Modal focus trap, when focus starts outside the panel', () => {
  it('pulls focus back into the dialog on Tab', () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);

    const { getByRole } = render(
      <Modal open onClose={() => {}} title="Trap">
        <button type="button">inside</button>
      </Modal>,
    );

    outside.focus();
    expect(document.activeElement).toBe(outside);

    fireEvent.keyDown(document, { key: 'Tab' });

    const dialog = getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);

    outside.remove();
  });

  it('pulls focus back on Shift+Tab too', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    const { getByRole } = render(
      <Modal open onClose={() => {}} title="Trap">
        <button type="button">inside</button>
      </Modal>,
    );

    outside.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    expect(getByRole('dialog').contains(document.activeElement)).toBe(true);
    outside.remove();
  });
});
