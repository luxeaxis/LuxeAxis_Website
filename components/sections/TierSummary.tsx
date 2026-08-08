import { Icon } from '../Icon';
import { PriceTag } from '../PriceTag';
import { Button } from '../Button';
import { Stack } from '../layout';
import { ToBePublished } from '../ToBePublished';
import { BOOK_AUDIT } from '@/lib/nav';
import type { Tier } from '@/lib/content/types';

/**
 * `InclusionList` and `TierSummary` (Build Backlog T-15).
 *
 * `TierSummary` is the sticky rail beside a tier page's scrolling detail — the
 * "sticky tier summary + scrolling detail layout" T-15 asks for. It repeats the
 * name, the price band and the primary action so the visitor never has to
 * scroll back up to act on what they have just read.
 */

/** The check-marked inclusions list, shared by the tier cards and tier pages so
 *  the same content cannot be presented two different ways. The check is
 *  decorative: "included" is already carried by the list's own heading, so
 *  announcing a tick before every item would be noise. */
export function InclusionList({
  inclusions,
}: {
  inclusions: readonly string[];
}) {
  return (
    <ul className="flex flex-col gap-3">
      {inclusions.map((item) => (
        <li key={item} className="flex items-start gap-3 text-on-surface-2">
          <Icon
            name="check"
            size="sm"
            decorative
            className="mt-1 shrink-0 text-accent"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function TierSummary({ tier }: { tier: Tier }) {
  return (
    // `lg:sticky` only: a sticky panel needs a tall viewport to be useful, and
    // on mobile it would sit on top of the very detail it summarises. T-15's
    // "collapses to a top sheet on mobile" is satisfied by it simply flowing
    // above the detail there — a genuine sheet would be a modal layer over
    // content the visitor is actively reading.
    <div className="lg:sticky lg:top-[calc(var(--component-nav-height)+var(--space-6))]">
      <div className="rounded-2xl border border-accent/40 lx-liquid-glass p-6 shadow-2xl">
        <Stack gap={5}>
          <Stack gap={2}>
            {/* A styled `<p>`, not a heading. The tier name is already the
                page's `h1`; adding an `h2` with identical text puts the same
                word twice into the heading outline a screen-reader user
                navigates by, for a panel that is a summary of the page rather
                than a section of it. The visual repetition is the point — it is
                what makes the sticky panel readable on its own — but it does
                not need to be structural to achieve that. */}
            <p className="font-display text-[length:var(--typography-h2-font-size)] font-bold text-on-surface">
              {tier.name}
            </p>
            <p className="text-small text-on-surface-2">{tier.summary}</p>
          </Stack>

          {tier.priceFrom === null ? (
            // Names the gap in the place the price will go. The studio's
            // proposition is that it publishes its prices; a plausible figure
            // here would discredit exactly that, so the marker stays until real
            // rates land.
            <p className="text-small">
              <ToBePublished label="Fee band" />
            </p>
          ) : (
            <PriceTag amount={tier.priceFrom} period="onwards" />
          )}

          <Button
            as="a"
            href={BOOK_AUDIT.href}
            className="w-full lx-liquid-btn justify-center font-bold text-surface-deep"
          >
            {BOOK_AUDIT.label}
          </Button>
        </Stack>
      </div>
    </div>
  );
}
