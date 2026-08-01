'use client';

/**
 * The two-step Book-Audit form (Build Backlog T-19, Spec §5.9).
 *
 * Step 1 is the project; step 2 is the person. That order is deliberate and
 * comes from the conversion argument in Landing Blueprint §2: a visitor who has
 * already described their flat has invested something, and asking for a phone
 * number first is where high-intent forms lose people. Nothing in step 1
 * identifies anybody.
 *
 * ## Data is never lost going back
 *
 * One `useForm` spanning both steps, with the step index as ordinary state —
 * not a form per step. Going back re-renders fields that were never unregistered,
 * so their values are simply still there. T-19 lists "never lose data on back"
 * under Responsive, but it is really an anti-rage requirement: losing a
 * half-typed form is the single most reliable way to lose the lead entirely.
 *
 * ## Validation and focus
 *
 * `mode: 'onBlur'` — a field is checked when the visitor leaves it, never while
 * they are still typing it. Validating mid-keystroke tells someone their email
 * is wrong when they have typed three characters of it, which reads as the form
 * arguing with them.
 *
 * Advancing from step 1 validates only step 1's fields, so step 2's untouched
 * fields cannot fire errors for content the visitor has not reached.
 *
 * On a failed submit an error summary appears at the top of the form, takes
 * focus, and lists each problem as a link to the field. That is the pattern
 * assistive-technology users actually rely on: an `aria-live` announcement
 * alone says something is wrong without saying where, and moving focus straight
 * to the first bad field hides the fact that there were four others.
 */

import { useEffect, useRef, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './Button';
import { Field } from './Field';
import { Icon } from './Icon';
import { InlineAlert } from './InlineAlert';
import { ConsentCheckbox } from './ConsentCheckbox';
import { Stack } from './layout';
import { leadSchema, type Lead } from '@/lib/lead/schema';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

const STEP_ONE_FIELDS = ['propertyType', 'areaSqFt', 'tier', 'city'] as const;

/** Human names for the error summary. The field's own label, so the summary and
 *  the field agree — a summary that says "areaSqFt" is a developer's error
 *  message wearing a visitor's hat. */
const FIELD_LABEL: Record<keyof Lead, string> = {
  propertyType: 'Type of space',
  areaSqFt: 'Approximate area',
  tier: 'Tier',
  city: 'Where the property is',
  name: 'Your name',
  email: 'Email',
  phone: 'Phone',
  preferredTime: 'Preferred time',
  contactMethod: 'How we should reach you',
  notes: 'Anything else',
  consent: 'Permission to contact you',
};

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; reason: 'not_configured' | 'unreachable' | 'invalid' };

function RadioRow<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset>
      <legend className="mb-2 text-small text-on-surface-2">{legend}</legend>
      <div className="flex flex-wrap gap-2" aria-describedby={error ? errorId : undefined}>
        {options.map((option) => (
          <label
            key={option.value}
            className="relative inline-flex cursor-pointer items-center rounded-pill border-hairline border-border-subtle px-4 py-2 text-small text-on-surface-2 transition-colors duration-micro ease-standard has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-contrast has-[:focus-visible]:outline has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-offset-focus has-[:focus-visible]:outline-focus-ring"
          >
            {/* sr-only, never display:none — the radio must stay in the tab
                order and the accessibility tree; the pill is only paint. */}
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 flex items-center gap-2 text-small text-error">
          <Icon name="alert-circle" size="sm" decorative />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}

export function BookAuditForm() {
  const [step, setStep] = useState<0 | 1>(0);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });
  const summaryRef = useRef<HTMLDivElement>(null);
  const [showSummary, setShowSummary] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Lead>({
    resolver: zodResolver(leadSchema) as Resolver<Lead>,
    mode: 'onBlur',
    defaultValues: {
      preferredTime: 'any',
      contactMethod: 'call',
      tier: 'undecided',
    },
  });

  // Focus the summary once it appears, not on every render — otherwise fixing
  // one field would yank focus back out of the field being corrected.
  useEffect(() => {
    if (showSummary) summaryRef.current?.focus();
  }, [showSummary]);

  const errorEntries = (Object.keys(errors) as (keyof Lead)[]).filter((key) => errors[key]);

  async function goToStepTwo() {
    // Only step 1's fields — step 2 is untouched and must not report errors for
    // content the visitor has not reached.
    const valid = await trigger([...STEP_ONE_FIELDS]);
    if (!valid) {
      setShowSummary(true);
      return;
    }
    setShowSummary(false);
    setStep(1);
  }

  async function onSubmit(values: Lead) {
    setShowSummary(false);
    setSubmitState({ status: 'submitting' });

    const params = new URLSearchParams(window.location.search);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          attribution: {
            source: params.get('utm_source') ?? undefined,
            medium: params.get('utm_medium') ?? undefined,
            campaign: params.get('utm_campaign') ?? undefined,
            path: window.location.pathname,
          },
        }),
      });

      if (response.ok) {
        setSubmitState({ status: 'success' });
        return;
      }
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setSubmitState({
        status: 'error',
        reason:
          payload?.error === 'not_configured'
            ? 'not_configured'
            : payload?.error === 'invalid_lead'
              ? 'invalid'
              : 'unreachable',
      });
    } catch {
      setSubmitState({ status: 'error', reason: 'unreachable' });
    }
  }

  function onInvalid() {
    setShowSummary(true);
  }

  if (submitState.status === 'success') {
    return (
      <div role="status">
        <InlineAlert tone="success" title="Your audit request is in">
          A designer will be in touch shortly to agree a time. Nothing is booked until you have
          confirmed it with them.
        </InlineAlert>
      </div>
    );
  }

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
      <Stack gap={6}>
        {/* Step indicator. Real text, not just a filled bar — "Step 1 of 2" is
            the whole message, and a progress bar alone conveys it only to
            people who can see it. */}
        <p className="text-small text-on-surface-muted">
          Step {step + 1} of 2 — {step === 0 ? 'about the space' : 'how to reach you'}
        </p>

        {showSummary && errorEntries.length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-md border-hairline border-error bg-surface-raised p-4"
          >
            <p className="font-ui font-semibold text-on-surface">
              There {errorEntries.length === 1 ? 'is one thing' : `are ${errorEntries.length} things`} to
              fix before we can send this
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {errorEntries.map((key) => (
                <li key={key}>
                  {/* A link, not just text: it moves focus to the field, which
                      is what makes a summary usable rather than merely
                      informative. */}
                  <a href={`#${key}`} className="text-small text-error underline underline-offset-4">
                    {FIELD_LABEL[key]}: {errors[key]?.message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Both steps stay mounted; the inactive one is hidden. This is what
            makes "never lose data on back" structural rather than something
            state-restoration has to remember — the inputs are never
            unregistered, so their values cannot be dropped. `hidden` also takes
            them out of the tab order and the accessibility tree, so the
            inactive step is not reachable. */}
        <div hidden={step !== 0}>
          <Stack gap={5}>
            <RadioRow
              name="propertyType"
              legend="What kind of space is it?"
              options={[
                { value: 'apartment', label: 'Apartment' },
                { value: 'villa', label: 'Villa or independent house' },
                { value: 'commercial', label: 'Commercial' },
                { value: 'other', label: 'Something else' },
              ]}
              value={values.propertyType}
              onChange={(value) => setValue('propertyType', value, { shouldValidate: true })}
              error={errors.propertyType?.message}
            />
            <Field
              label="Approximate area (sq ft)"
              type="number"
              required
              error={errors.areaSqFt?.message}
              {...register('areaSqFt', { valueAsNumber: true })}
            />
            <RadioRow
              name="tier"
              legend="Which tier are you considering?"
              options={[
                { value: 'Essential', label: 'Essential' },
                { value: 'Signature', label: 'Signature' },
                { value: 'Elite', label: 'Elite' },
                { value: 'undecided', label: 'Still deciding' },
              ]}
              value={values.tier}
              onChange={(value) => setValue('tier', value, { shouldValidate: true })}
              error={errors.tier?.message}
            />
            <Field
              label="Where is the property?"
              required
              error={errors.city?.message}
              {...register('city')}
            />
            <div>
              {/* type="button": inside a form, an unqualified button submits. */}
              <Button type="button" onClick={goToStepTwo} iconTrailing="arrow-right">
                Next
              </Button>
            </div>
          </Stack>
        </div>

        <div hidden={step !== 1}>
          <Stack gap={5}>
            <Field label="Your name" required error={errors.name?.message} {...register('name')} />
            <Field
              label="Email"
              type="email"
              required
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Field
              label="Phone"
              type="tel"
              required
              autoComplete="tel"
              help="Include your country code if you are calling from outside India."
              error={errors.phone?.message}
              {...register('phone')}
            />
            <RadioRow
              name="contactMethod"
              legend="How should we reach you?"
              options={[
                { value: 'call', label: 'Phone call' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'zoom', label: 'Video call' },
              ]}
              value={values.contactMethod}
              onChange={(value) => setValue('contactMethod', value, { shouldValidate: true })}
              error={errors.contactMethod?.message}
            />
            <RadioRow
              name="preferredTime"
              legend="When suits you?"
              options={[
                { value: 'morning', label: 'Morning' },
                { value: 'afternoon', label: 'Afternoon' },
                { value: 'evening', label: 'Evening' },
                { value: 'any', label: 'Any time' },
              ]}
              value={values.preferredTime}
              onChange={(value) => setValue('preferredTime', value, { shouldValidate: true })}
              error={errors.preferredTime?.message}
            />
            <Field
              label="Anything else we should know?"
              multiline
              rows={4}
              error={errors.notes?.message}
              {...register('notes')}
            />

            <ConsentCheckbox
              id="consent"
              invalid={Boolean(errors.consent)}
              error={errors.consent?.message}
              {...register('consent')}
            />

            {submitState.status === 'error' && (
              <InlineAlert
                tone="error"
                title={
                  submitState.reason === 'not_configured'
                    ? 'We cannot take bookings through this form yet'
                    : 'We could not send that just now'
                }
              >
                {submitState.reason === 'not_configured'
                  ? 'This form is not connected to the studio yet, so your request would not reach anyone. Nothing you typed has been sent. Please use the contact details in the footer instead.'
                  : 'Your details have not been sent. Please try once more — if it still fails, use the contact details in the footer.'}
              </InlineAlert>
            )}

            <div className={cx('flex flex-wrap gap-3')}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(0)}
                iconLeading="chevron-left"
              >
                Back
              </Button>
              <Button type="submit" loading={submitState.status === 'submitting'}>
                Request my audit
              </Button>
            </div>
          </Stack>
        </div>
      </Stack>
    </form>
  );
}
