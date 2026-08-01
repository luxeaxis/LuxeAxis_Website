'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Link } from './Link';
import { Container } from './layout';
import { readConsent, writeConsent } from '@/lib/analytics/consent';

/**
 * The DPDPA consent banner (Build Backlog T-20, Spec §10.7).
 *
 * ## What makes this one honest
 *
 * "Accept" and "Decline" are the same size, the same shape and the same visual
 * weight. That is not a styling preference — a banner whose refusal is a grey
 * link beside a gold button is a dark pattern, and under the DPDP Act consent
 * has to be freely given to be consent at all. If declining is visibly harder
 * than accepting, the resulting "consent" is worth nothing legally and less
 * than nothing ethically.
 *
 * There is no "manage preferences" maze either. One question, two answers.
 *
 * ## Not a focus trap, and not a modal
 *
 * T-20 asks for "keyboard-accessible, not a focus trap, dismissible". So this
 * is a `<section>` with `role="region"`, not a dialog: it does not steal focus
 * on mount, does not trap Tab, and leaves the page fully usable behind it.
 * Analytics is blocked until the visitor answers, so there is nothing to
 * protect by forcing an answer — a banner that holds the page hostage is
 * coercion dressed as compliance.
 *
 * It renders at the END of the DOM but is positioned at the bottom of the
 * viewport, so a keyboard user reaches the page's real content first and the
 * banner last, which is the order of importance.
 *
 * ## Why it mounts after paint
 *
 * `useState('unknown')` plus an effect, rather than reading the cookie during
 * render: the server has no access to `document.cookie`, so rendering the
 * banner during SSR would flash it to visitors who already answered. It appears
 * a frame later for the people who need it, and never for the people who do
 * not.
 */
export function ConsentBanner() {
  const [state, setState] = useState<'hidden' | 'shown'>('hidden');

  useEffect(() => {
    if (readConsent(document.cookie) === 'unknown') setState('shown');
  }, []);

  if (state === 'hidden') return null;

  function answer(decision: 'granted' | 'denied') {
    writeConsent(decision);
    setState('hidden');
  }

  return (
    // No explicit `role="region"`: a `<section>` with an accessible name
    // already has it, and stating it again is the redundancy jsx-a11y flags.
    // The `aria-label` is what promotes this from a generic section to a named
    // landmark, so it is doing real work rather than decorating.
    <section
      aria-label="Cookies and analytics"
      className="fixed inset-x-0 bottom-0 z-toast border-t-hairline border-border-subtle bg-surface-raised"
    >
      <Container className="py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-measure text-small text-on-surface-2">
            We would like to measure how this site is used, so we can make it better. Nothing is
            measured unless you agree, and we never put your personal details into analytics. See
            our{' '}
            <Link href="/privacy" variant="inline" className="text-small">
              privacy notes
            </Link>
            .
          </p>
          {/* Equal weight, deliberately. See the file comment. */}
          <div className="flex shrink-0 gap-3">
            <Button variant="secondary" onClick={() => answer('denied')}>
              No thanks
            </Button>
            <Button variant="secondary" onClick={() => answer('granted')}>
              That&rsquo;s fine
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
