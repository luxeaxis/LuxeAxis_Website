'use client';

/**
 * The Fee Calculator (Build Backlog T-15, Spec §5.7).
 *
 * DOM-first and deliberately plain. Landing Blueprint §3.6 gives the clearest
 * "3D hurts" verdict on the whole site for this content: a price-anxious
 * visitor wants fast, scannable, honest numbers, and spectacle around a price
 * signals that something is being hidden — which would undercut the exact
 * transparency claim the calculator exists to prove. The gold bead travelling
 * the Axis (§5.7) is a later, optional accent; nothing here waits on it.
 *
 * ## Why a number field and radios, not a slider
 *
 * §5.7 sketches a slider bead, and a slider is the obvious choice — but its
 * accessible behaviour is bad for this specific job. Dragging a range input
 * fires a change per pixel, and the result lives in a polite live region, so a
 * screen-reader user would be read a new six-figure estimate dozens of times
 * per drag. A number input changes discretely, is keyboard-complete with no
 * extra handlers, allows a visitor to type the area they actually know, and
 * announces once per committed value.
 *
 * ## Why there is no submit button
 *
 * There is nothing to submit. The estimate is derived from two inputs with no
 * network call, so it is live, and a button would only add a step between the
 * visitor and the number they came for. `<output>` carries an implicit
 * `role="status"`, which announces the result politely without stealing focus —
 * the behaviour T-15 asks for, from the element built for it rather than a
 * hand-rolled live region.
 *
 * ## No React Hook Form or Zod
 *
 * T-15 names both. Neither earns its weight here: there are two inputs, no
 * submission, no server round trip and no cross-field rules. The only invalid
 * state a `type="number"` field can reach is empty or non-numeric, which
 * `estimate()` already returns `null` for. Adding a form library and a schema
 * validator to this would be ~15 kB on a route whose entire proposition is
 * being fast. They become the right call at T-19's booking form, which really
 * does submit somewhere.
 */

import { useId, useState } from 'react';
import { Button } from './Button';
import { Stack } from './layout';
import { InlineAlert } from './InlineAlert';
import { estimate, formatEstimate, type EstimateInput } from '@/lib/pricing/estimate';
import type { CalculatorConfig, Tier } from '@/lib/content/types';
import { BOOK_AUDIT } from '@/lib/nav';

const TIER_NAMES: readonly Tier['name'][] = ['Essential', 'Signature', 'Elite'];

export function FeeCalculator({
  config,
  defaultTier = 'Signature',
}: {
  config: CalculatorConfig;
  /** Defaults to the recommended tier so the first number a visitor sees is
   *  the one most of them will actually buy. */
  defaultTier?: Tier['name'];
}) {
  const areaId = useId();
  const tierLegendId = useId();
  const resultId = useId();

  // Starts at the bottom of the accepted range rather than at a "typical"
  // flat: any seeded default is a suggestion about the visitor's home that the
  // calculator has no basis for making.
  const [area, setArea] = useState<string>(String(config.area.min));
  const [tier, setTier] = useState<Tier['name']>(defaultTier);

  const input: EstimateInput = { areaSqFt: Number.parseFloat(area), tier };
  const result = estimate(config, input);

  return (
    <div className="rounded-lg border border-border-subtle bg-surface-raised p-6">
      <Stack gap={6}>
        {/* Not a <form>: there is nothing to submit, and a form element here
            would invite an Enter keypress to reload the page. */}
        <Stack gap={5}>
          <div>
            <label htmlFor={areaId} className="mb-2 block text-small text-on-surface-2">
              Carpet area (square feet)
            </label>
            <input
              id={areaId}
              type="number"
              inputMode="numeric"
              value={area}
              min={config.area.min}
              max={config.area.max}
              step={config.area.step}
              onChange={(event) => setArea(event.target.value)}
              aria-describedby={resultId}
              className="h-control-lg w-full rounded-md border-hairline border-border bg-field-bg px-4 font-mono tabular-nums text-on-surface transition-colors duration-micro ease-standard focus:border-[length:var(--border-width-focus)] focus:border-field-border-focus focus:outline-none"
            />
            <p className="mt-2 text-small text-on-surface-muted">
              Between {config.area.min.toLocaleString('en-IN')} and{' '}
              {config.area.max.toLocaleString('en-IN')} sq ft.
            </p>
          </div>

          {/* A real fieldset/legend rather than a labelled div: the tier choice
              is a single question with three answers, and that grouping is what
              a screen reader announces when focus enters the first radio. */}
          <fieldset>
            <legend id={tierLegendId} className="mb-2 text-small text-on-surface-2">
              Finish tier
            </legend>
            <div className="flex flex-wrap gap-2">
              {TIER_NAMES.map((name) => (
                <label
                  key={name}
                  className="relative inline-flex cursor-pointer items-center rounded-pill border-hairline border-border-subtle px-4 py-2 text-small text-on-surface-2 transition-colors duration-micro ease-standard has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-contrast has-[:focus-visible]:outline has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-offset-focus has-[:focus-visible]:outline-focus-ring"
                >
                  {/* `sr-only`, not `hidden` or `appearance-none`: the control
                      has to stay in the accessibility tree and the tab order —
                      the pill around it is only paint. Arrow-key navigation
                      within the group comes free from native radios. */}
                  <input
                    type="radio"
                    name="tier"
                    value={name}
                    checked={tier === name}
                    onChange={() => setTier(name)}
                    className="sr-only"
                  />
                  {name}
                </label>
              ))}
            </div>
          </fieldset>
        </Stack>

        {/* `<output>` is implicitly role="status" / aria-live="polite", so the
            estimate is announced without moving focus. `htmlFor` names the
            inputs it was computed from, which is what makes the relationship
            programmatic rather than merely visual. */}
        <output
          id={resultId}
          htmlFor={`${areaId} ${tierLegendId}`}
          className="block border-t-hairline border-border-subtle pt-5"
        >
          {result ? (
            <Stack gap={2}>
              <span className="text-small text-on-surface-2">Estimated project cost</span>
              <span className="font-mono text-[length:var(--typography-price-font-size)] tabular-nums text-on-surface">
                {formatEstimate(result)}
              </span>
              {result.clamped && (
                <span className="text-small text-on-surface-muted">
                  Shown for {result.areaUsed.toLocaleString('en-IN')} sq ft, the largest this
                  calculator covers. Talk to us about anything bigger.
                </span>
              )}
            </Stack>
          ) : (
            <span className="text-small text-on-surface-muted">
              Enter a carpet area to see an estimate.
            </span>
          )}
        </output>

        {/* An estimate is not a quote, and saying so is part of the
            transparency claim rather than a hedge against it. `info`, not
            `warning`: nothing has gone wrong. */}
        <InlineAlert tone="info" title="This is an estimate, not a quote">
          Final cost depends on your plan, site condition and material choices. A designer confirms
          it at the audit.
        </InlineAlert>

        <div>
          <Button as="a" href={BOOK_AUDIT.href}>
            {BOOK_AUDIT.label}
          </Button>
        </div>
      </Stack>
    </div>
  );
}
