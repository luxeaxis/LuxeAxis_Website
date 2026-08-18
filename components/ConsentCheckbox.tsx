'use client';

import { forwardRef } from 'react';
import { Icon } from './Icon';
import { Link } from './Link';

/**
 * The DPDPA consent checkbox (Build Backlog T-19).
 *
 * Three rules, all of them compliance rather than style:
 *
 * 1. **Never pre-ticked.** Consent that was not actively given is not consent
 *    under the DPDP Act. The schema enforces the same thing from the other
 *    side — `z.literal(true)`, so an unchecked box fails validation rather than
 *    submitting `false`.
 * 2. **The purpose is stated in the label**, not behind a link. A visitor has
 *    to be able to read what they are agreeing to without navigating away from
 *    a half-filled form.
 * 3. **It is a real `<input type="checkbox">`.** Styled with `peer`, never
 *    replaced by a div with a click handler — the native control brings space-
 *    key toggling, the checked state in the accessibility tree, and form
 *    semantics that no amount of ARIA reproduces faithfully.
 *
 * The privacy policy link points at `/privacy`, which does not exist yet
 * (`components/Footer.tsx` lists it in the same not-built-yet state). That is a
 * genuine gap rather than a styling decision: this form cannot lawfully go live
 * until that page does, which is recorded in the delivery notes.
 */
export const ConsentCheckbox = forwardRef<
  HTMLInputElement,
  {
    id: string;
    describedBy?: string;
    invalid?: boolean;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(function ConsentCheckbox({ id, describedBy, invalid, error, ...rest }, ref) {
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          {...rest}
          ref={ref}
          id={id}
          type="checkbox"
          aria-invalid={invalid || undefined}
          aria-describedby={
            [describedBy, error ? errorId : undefined]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className="peer mt-1 h-icon-md w-icon-md shrink-0 cursor-pointer rounded-sm border-regular border-border-strong bg-field-bg accent-accent focus-visible:outline focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring"
        />
        <label
          htmlFor={id}
          className="cursor-pointer text-small text-on-surface-2"
        >
          I agree that Luxe Axis may process my personal data to contact me about this enquiry as per the DPDP Act 2023. You can withdraw this consent at any time. See our{' '}
          <Link href="/privacy" variant="inline" className="text-small">
            DPDPA privacy statement
          </Link>
          .
        </label>
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-center gap-2 text-small text-error"
        >
          <Icon name="alert-circle" size="sm" decorative />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});
