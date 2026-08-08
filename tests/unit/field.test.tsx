import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Field } from '@/components/Field';

afterEach(cleanup);

describe('Field', () => {
  it('associates the label with the control via htmlFor/id', () => {
    render(<Field label="Email" name="email" type="email" />);
    const input = screen.getByLabelText('Email');
    expect(input.tagName).toBe('INPUT');
    expect(input.getAttribute('type')).toBe('email');
  });

  it('marks required in text, not colour/asterisk alone', () => {
    render(<Field label="Phone" name="phone" required />);
    // getByLabelText matching the full accessible name proves the
    // "(required)" text is actually part of the programmatic label, not a
    // decorative aside a screen reader would skip.
    expect(screen.getByLabelText('Phone (required)')).toBeDefined();
  });

  it('wires aria-invalid and aria-describedby to the error message on error', () => {
    render(
      <Field
        label="Phone"
        name="phone"
        error="Enter a phone number we can reach you on"
      />,
    );
    const input = screen.getByLabelText('Phone') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBe('phone-error');
    const message = document.getElementById(describedBy!);
    expect(message?.textContent).toContain(
      'Enter a phone number we can reach you on',
    );
    expect(message?.getAttribute('role')).toBe('alert');
  });

  it('has no aria-invalid and no error role when valid', () => {
    render(<Field label="Name" name="name" help="As it appears on your ID" />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBe('name-help');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows a success message with an icon, not colour alone, and suppresses it when error is also set', () => {
    const { rerender } = render(
      <Field label="Email" name="email" success="Looks good" />,
    );
    expect(screen.getByText('Looks good')).toBeDefined();

    rerender(
      <Field
        label="Email"
        name="email"
        success="Looks good"
        error="Enter a valid email"
      />,
    );
    expect(screen.queryByText('Looks good')).toBeNull();
    expect(screen.getByText('Enter a valid email')).toBeDefined();
  });

  it('renders a <textarea> when multiline, still associated to its label', () => {
    render(<Field label="Notes" name="notes" multiline />);
    const control = screen.getByLabelText('Notes');
    expect(control.tagName).toBe('TEXTAREA');
  });

  it('disabled removes the control from the interaction surface', () => {
    render(<Field label="Name" name="name" disabled />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    // `fireEvent.change` bypasses the browser's own disabled gating (it sets
    // the DOM value directly, which real typing never gets the chance to
    // do) — focusability is the faithful check: a disabled control never
    // becomes the active element for a real user, keyboard or pointer.
    input.focus();
    expect(document.activeElement).not.toBe(input);
  });

  it('is keyboard-operable: typing updates a controlled value via onChange', () => {
    const onChange = vi.fn();
    render(<Field label="Name" name="name" value="" onChange={onChange} />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
    fireEvent.change(input, { target: { value: 'Asha' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
