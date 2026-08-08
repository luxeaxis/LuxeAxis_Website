'use client';

/**
 * The Fee Calculator (Build Backlog T-15, Spec §5.7).
 *
 * DOM-first and deliberately plain. Landing Blueprint §3.6 gives the clearest
 * "3D hurts" verdict on the site for this content: a price-anxious visitor
 * wants fast, scannable, honest numbers, and spectacle around a price signals
 * that something is being hidden — which would undercut the exact transparency
 * claim this exists to prove.
 *
 * ## It asks what kind of home, not how many square feet
 *
 * The obvious design — area in, rate multiplied out — is not how the studio
 * prices. The published list bands total project cost by property type, and a
 * per-square-foot rate cannot honestly be derived from it (see
 * `lib/pricing/estimate.ts`). Asking directly for the row is both truer to the
 * price list and a far easier question to answer: everyone knows whether they
 * live in a 2BHK; few know their carpet area to the square foot.
 *
 * The typical area is shown against each option, so anyone unsure can place
 * themselves.
 *
 * ## Both numbers, always
 *
 * Total project cost AND the design fee inside it. Publishing only the total is
 * what makes a visitor suspect the fee is buried in it; publishing only the fee
 * hides the number they actually need to budget. §5.7 calls this "the
 * published-pricing trust signal", and the trust comes from showing both.
 *
 * ## No submit button
 *
 * There is nothing to submit — the answer is a lookup with no network call, so
 * it is live. `<output>` carries an implicit `role="status"`, announcing the
 * result politely without stealing focus.
 */

import { useId, useState } from 'react';
import { Button } from './Button';
import { Stack } from './layout';
import { InlineAlert } from './InlineAlert';
import { estimate, formatArea, formatBand } from '@/lib/pricing/estimate';
import type { CalculatorConfig } from '@/lib/content/types';
import { BOOK_AUDIT } from '@/lib/nav';

export function FeeCalculator({ config }: { config: CalculatorConfig }) {
  const legendId = useId();
  const resultId = useId();

  // Starts on nothing chosen rather than a default row: any seeded default is a
  // guess about the visitor's home, and the first number they see would be for
  // somebody else's.
  const [bracketId, setBracketId] = useState<string | null>(null);
  const result = bracketId ? estimate(config, bracketId) : null;

  return (
    <div className="rounded-2xl border border-accent/40 lx-liquid-glass p-6 sm:p-8 shadow-2xl">
      <Stack gap={6}>
        <fieldset>
          <legend
            id={legendId}
            className="mb-3 font-ui text-small uppercase tracking-wider font-semibold text-accent"
          >
            What kind of home is it?
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {config.brackets.map((bracket) => {
              const area = formatArea(bracket);
              return (
                <label
                  key={bracket.id}
                  className="relative inline-flex cursor-pointer flex-col gap-0.5 rounded-xl border border-accent/30 lx-liquid-glass-card px-4 py-3 text-small text-on-surface-2 transition-all duration-200 has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-surface-deep has-[:checked]:font-bold"
                >
                  {/* sr-only, never display:none — the radio has to stay in the
                      tab order and the accessibility tree; the card around it is
                      only paint. Arrow-key navigation comes free from a native
                      radio group. */}
                  <input
                    type="radio"
                    name="property"
                    value={bracket.id}
                    checked={bracketId === bracket.id}
                    onChange={() => setBracketId(bracket.id)}
                    className="sr-only"
                  />
                  <span className="font-medium">{bracket.label}</span>
                  {/* No `opacity-80` here. Dimming the secondary role took it
                      to 3.96:1 on this card, and opacity cannot be checked by
                      the token tests — it is applied at the call site, after
                      every contrast assertion has already passed. The size
                      difference carries the hierarchy on its own. */}
                  {area && <span className="text-overline">{area}</span>}
                </label>
              );
            })}
          </div>
        </fieldset>

        <output
          id={resultId}
          htmlFor={legendId}
          className="block border-t border-border-subtle/50 pt-5"
        >
          {result ? (
            <Stack gap={4}>
              <Stack gap={1}>
                <span className="text-small text-on-surface-2 font-medium">
                  Whole project
                </span>
                <span className="font-mono text-[length:var(--typography-price-font-size)] font-bold tabular-nums text-accent">
                  {formatBand(result.projectCost)}
                </span>
              </Stack>
              <Stack gap={1}>
                <span className="text-small text-on-surface-2 font-medium">
                  Our design fee, within that
                </span>
                <span className="font-mono text-[length:var(--typography-h3-font-size)] font-semibold tabular-nums text-on-surface">
                  {formatBand(result.designFee)}
                </span>
              </Stack>
              <span className="text-small text-on-surface-muted">
                {result.bracket.tiers.length === 1
                  ? `Served by our ${result.bracket.tiers[0]} tier.`
                  : `Served by ${result.bracket.tiers.join(' or ')}, depending on finish.`}
              </span>
            </Stack>
          ) : (
            <span className="text-small text-on-surface-muted">
              Pick a property type to see the published range.
            </span>
          )}
        </output>

        {/* Saying so is part of the transparency claim rather than a hedge
            against it. `info`, not `warning`: nothing has gone wrong. */}
        <InlineAlert
          tone="info"
          title="These are published ranges, not a quote"
        >
          Where you land inside a range depends on your plan, the condition of
          the site and the materials you choose. A designer confirms it at the
          audit.
        </InlineAlert>

        <div>
          <Button
            as="a"
            href={BOOK_AUDIT.href}
            className="lx-liquid-btn justify-center font-bold text-surface-deep"
          >
            {BOOK_AUDIT.label}
          </Button>
        </div>
      </Stack>
    </div>
  );
}
