'use client';

import { useState } from 'react';
import { Icon, type IconName } from './Icon';

/**
 * TrustMarquee — smooth-scrolling gold marquee floating at the top of the viewport,
 * with pause-on-hover and close/dismiss button.
 */
export function TrustMarquee() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const items: Array<{ icon: IconName; text: string }> = [
    { icon: 'check', text: 'Flat Post-Handover Warranty' },
    // Not "60-Day Handover Guarantee". 60 days is SIGNATURE's commitment;
    // Essential's is 45 and Elite's is milestone-based, so a flat figure on a
    // bar that renders on every route overstates it for one tier and
    // misdescribes another. `lib/content/source.ts` states the guarantee per
    // tier for exactly this reason, and a strip with no tier context is the
    // one place a number like this cannot be qualified.
    { icon: 'check', text: 'Committed Handover Date, Per Tier' },
    { icon: 'info', text: 'Fixed Price Guarantee — No Hidden Fees' },
    { icon: 'compass', text: 'Vastu-Tech Automated Layout Verification' },
    { icon: 'layers', text: 'Space OS Live Client Progress Portal' },
    { icon: 'device', text: '25+ Neighborhoods Across Chennai' },
  ];

  return (
    <aside
      className="relative w-full overflow-hidden bg-surface-deep/95 backdrop-blur-md py-0.5 sm:py-1 border-b border-border-subtle shadow-sm"
      aria-label="Studio trust commitments"
    >
      <div className="flex items-center justify-between px-3 sm:px-4">
        <div className="flex-1 overflow-hidden pr-3 sm:pr-4">
          <div className="flex w-max animate-marquee space-x-6 sm:space-x-8 font-ui text-overline uppercase tracking-wider text-accent font-semibold">
            {[...items, ...items, ...items].map((item, index) => (
              <div key={index} className="flex items-center space-x-2 shrink-0">
                <Icon name={item.icon} size="sm" decorative className="text-accent h-3 w-3 shrink-0" />
                <span>{item.text}</span>
                <span className="text-border-subtle pl-3 sm:pl-4" aria-hidden="true">•</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 p-0.5 text-on-surface-muted hover:text-accent focus-visible:outline focus-visible:outline-focus rounded-full transition-colors bg-surface-raised/40 hover:bg-surface-raised"
          aria-label="Close top announcement bar"
        >
          <Icon name="close" size="sm" decorative className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
}
