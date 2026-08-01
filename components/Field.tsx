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
// Height itself is deliberately NOT here — the single-line `<input>` and the
// growable `<textarea>` need different height semantics (see below), so
// each element applies its own `h-control-lg` / `min-h-control-lg`.
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
  // Resting size is the `typography.body` token, not Tailwind's `text-base`.
  // Same numeric value (1rem) today, but `text-base` is Tailwind's own default
  // scale — it would keep saying 1rem if the token ever moved, silently
  // decoupling the label from the body text it is supposed to match. Same
  // reasoning as the floated size below and the help/error/success sizes.
  'text-[length:var(--typography-body-font-size)]',
  // Floated size reads `text-overline` (tailwind.config.ts `fontSize.overline`
  // -> `--typography-overline-font-size`, 0.75rem) instead of Tailwind's
  // default `text-xs` (same 0.75rem value today, but not sourced from the
  // token) — same reasoning as help/error/success below.
  'peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-overline',
  'peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-overline',
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
        // `min-h-control-lg` (not `h-control-lg`): a floor, not a fixed
        // height — `rows` is what actually sizes a textarea, and a fixed
        // height would clip a multi-row control down to one row's worth of
        // space. The floor still guarantees the same ≥44px target (§5) a
        // fixed height would.
        <textarea
          id={id}
          name={name}
          rows={props.rows ?? 4}
          placeholder=" "
          className={cx(controlClassName, 'min-h-control-lg pt-6')}
          {...commonA11y}
          {...(nativeRest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        // `h-control-lg` pins the single-line control to the spec's
        // `control-lg` (52px) exactly, rather than approximating it from
        // `pt-5 pb-2` padding plus ambient line-height — nothing pinned that
        // combination before, so it could drift silently if font metrics
        // ever changed (the ≥44px floor from §5 has to hold, not just
        // happen to hold today).
        <input
          id={id}
          name={name}
          type={props.type ?? 'text'}
          placeholder=" "
          className={cx(controlClassName, 'h-control-lg')}
          {...commonA11y}
          {...(nativeRest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      <label htmlFor={id} className={LABEL_BASE}>
        {label}
        {/* `on-surface-2`, not `on-surface-muted`. "(required)" is small
            meaningful text, and the muted role is documented as
            "placeholder/disabled/large only; use secondary for small
            meaningful text". Muted also renders here over the COMPOSITED
            field background (surface + a translucent overlay), which is
            slightly darker than surface itself — on light that dropped it to
            4.27:1, below AA. Caught by axe on /style. */}
        {required && <span className="text-on-surface-2"> (required)</span>}
      </label>
      {/* `text-small` (tailwind.config.ts `fontSize.small` ->
          `--typography-small-font-size`, 0.875rem) instead of Tailwind's
          default `text-sm` — same numeric value today, but now actually
          reads the `typography.small` token instead of coinciding with it
          by accident. */}
      <div className="mt-2 space-y-1">
        {help && (
          <p id={helpId} className="text-small text-on-surface-muted">
            {help}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="flex items-center gap-2 text-small text-error">
            <Icon name="alert-circle" size="sm" decorative />
            <span>{error}</span>
          </p>
        )}
        {success && (
          <p id={successId} className="flex items-center gap-2 text-small text-success">
            <Icon name="check" size="sm" decorative />
            <span>{success}</span>
          </p>
        )}
      </div>
    </div>
  );
}
