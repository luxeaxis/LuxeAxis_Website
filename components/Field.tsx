'use client';

/**
 * Field — label, control, help text, error, success (spec §3.4). A leaf
 * control meant to be dropped straight into a Server Component page while
 * still taking `value`/`onChange` from whatever client boundary owns the
 * form state, the same reasoning Button has for `"use client"`.
 *
 * Validation copy is the CALLER's responsibility — this component renders
 * whatever `error`/`success`/`help` string it's given verbatim. The spec's
 * tone rule ("Enter a phone number we can reach you on," never "Invalid
 * input," never blaming the user) is a copy-review concern, not something a
 * generic Field component can enforce structurally.
 */

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Icon } from './Icon';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

type FieldType = 'text' | 'email' | 'tel' | 'password' | 'number' | 'search' | 'url';

type FieldBaseProps = {
  label: string;
  name: string;
  help?: string;
  /** Presence, not the truthiness of a boolean, is the error state — this
   *  is the actual message shown, wired to `aria-invalid` + `aria-describedby`. */
  error?: string;
  /** Same shape as `error`: a message, shown with a check icon. Suppressed
   *  automatically whenever `error` is also set (error takes priority). */
  success?: string;
  required?: boolean;
  className?: string;
};

type FieldSingleLineProps = FieldBaseProps & {
  multiline?: false;
  type?: FieldType;
} & Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'id' | 'name' | 'type' | 'className' | 'aria-invalid' | 'aria-describedby' | 'aria-required' | 'placeholder'
  >;

type FieldMultilineProps = FieldBaseProps & {
  multiline: true;
  rows?: number;
} & Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'id' | 'name' | 'className' | 'aria-invalid' | 'aria-describedby' | 'aria-required' | 'placeholder'
  >;

export type FieldProps = FieldSingleLineProps | FieldMultilineProps;

/** Strips every prop this component models off a copy of `props`, leaving
 *  only genuine native `<input>`/`<textarea>` attributes (value, onChange,
 *  autoComplete, defaultValue…) to forward. See Button.tsx's
 *  `omitKnownProps` for why this is a delete-loop rather than a destructure
 *  of unused locals (`@typescript-eslint/no-unused-vars`, `--max-warnings 0`). */
function omitKnownProps(props: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...props };
  for (const key of ['label', 'name', 'help', 'error', 'success', 'required', 'className', 'multiline', 'type', 'rows']) {
    delete rest[key];
  }
  return rest;
}

// Shared visual treatment for both the <input> and <textarea> control —
// kept as one string so the two branches below can't drift from each other.
const CONTROL_BASE = cx(
  'peer w-full rounded-md bg-field-bg px-4 pb-2 pt-5 text-on-surface',
  'border-hairline placeholder-transparent',
  'transition-colors duration-micro ease-standard',
  'focus:outline-none',
  'disabled:opacity-disabled disabled:pointer-events-none',
);

// Float-label: a peer-driven CSS transform, not JS state — works with no
// JS at all. `placeholder=" "` (a single space, not empty) is what lets
// `:placeholder-shown` tell "empty and unfocused" apart from "has a value";
// the label stays programmatically tied to the control via `htmlFor`
// regardless of where it's drawn, so its floated position is purely visual.
const LABEL_BASE = cx(
  'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-2',
  'transition-all duration-micro ease-standard motion-reduce:transition-none',
  'text-base',
  'peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs',
  'peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs',
);

export function Field(props: FieldProps) {
  const { label, name, help, error, required, className } = props;
  // Error and success are mutually exclusive so the control never shows two
  // contradictory validation colours at once — the global states table
  // (§4) lists them as separate rows, but a field can't be both at the same
  // time in practice, and error always wins if a caller passes both.
  const success = error ? undefined : props.success;

  const id = name;
  const helpId = `${name}-help`;
  const errorId = `${name}-error`;
  const successId = `${name}-success`;
  const describedBy =
    [help && helpId, error && errorId, success && successId].filter(Boolean).join(' ') || undefined;

  const borderClass = error
    ? 'border-error'
    : success
      ? 'border-success'
      : 'border-border focus:border-[length:var(--border-width-focus)] focus:border-field-border-focus';

  const controlClassName = cx(CONTROL_BASE, borderClass, className);
  const nativeRest = omitKnownProps(props as unknown as Record<string, unknown>);
  const commonA11y = {
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy,
    'aria-required': required || undefined,
  };

  return (
    <div className="relative">
      {props.multiline ? (
        <textarea
          id={id}
          name={name}
          rows={props.rows ?? 4}
          placeholder=" "
          className={cx(controlClassName, 'pt-6')}
          {...commonA11y}
          {...(nativeRest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={props.type ?? 'text'}
          placeholder=" "
          className={controlClassName}
          {...commonA11y}
          {...(nativeRest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <label htmlFor={id} className={LABEL_BASE}>
        {label}
        {required && <span className="text-on-surface-muted"> (required)</span>}
      </label>
      <div className="mt-2 space-y-1">
        {help && (
          <p id={helpId} className="text-sm text-on-surface-muted">
            {help}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="flex items-center gap-2 text-sm text-error">
            <Icon name="alert-circle" size="sm" decorative />
            <span>{error}</span>
          </p>
        )}
        {success && (
          <p id={successId} className="flex items-center gap-2 text-sm text-success">
            <Icon name="check" size="sm" decorative />
            <span>{success}</span>
          </p>
        )}
      </div>
    </div>
  );
}
