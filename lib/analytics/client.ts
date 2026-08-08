'use client';

import { readConsent } from './consent';

/**
 * The analytics client (Build Backlog T-20, Spec §10.7).
 *
 * ## It is inert twice over, and both gates matter
 *
 * 1. **No consent, no call.** Every `track()` reads the consent cookie at call
 *    time rather than trusting a cached flag, so a visitor who declines stops
 *    being measured immediately rather than at the next page load.
 * 2. **No provider configured, no call.** `NEXT_PUBLIC_GA4_ID` and
 *    `NEXT_PUBLIC_POSTHOG_KEY` are both unset, so nothing is loaded at all
 *    today and `tests/e2e/consent.spec.ts` can assert zero analytics requests.
 *
 * The second gate is not redundant with the first. It means the consent banner
 * can ship and be tested now, and wiring a real provider later is an
 * environment change rather than a code change — with the consent plumbing
 * already proven rather than written in a hurry alongside a vendor SDK.
 *
 * ## No PII, enforced rather than intended
 *
 * §10.7 is explicit: "no PII in event payloads". `EventProps` allows only
 * primitives, and `track` strips anything that looks like an email or a phone
 * number before it leaves. That is deliberately paranoid — the events this site
 * fires sit next to a lead form, and the realistic failure is somebody passing
 * a whole form object into `audit_submit` because it was convenient.
 */

/** Spec §9.1's explicit event list. A closed union, not `string`: autocapture is
 *  off by design, and an open event name is how an analytics property turns
 *  into a landfill nobody can query. */
export type AnalyticsEvent =
  | 'page_view'
  | 'scroll_75'
  | 'audit_start'
  | 'audit_submit'
  | 'calc_complete'
  | 'lookbook_dl'
  /** Hero hotspot expanded. Added to the union rather than passed as a free
   *  string: the union is what stops one event acquiring six spellings. */
  | 'hero_hotspot';

export type EventProps = Record<string, string | number | boolean | undefined>;

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/** True only when a provider is actually configured. */
export function isAnalyticsConfigured(): boolean {
  return Boolean(GA4_ID || POSTHOG_KEY);
}

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE = /(?:\+?\d[\d\s\-()]{7,})/;

/**
 * Drops any property whose value looks like a contact detail.
 *
 * Silently, and that is the right call for this specific job: the alternative
 * is throwing, which would turn a privacy slip into a crash on a conversion
 * page. The property vanishing is the failure mode that costs the visitor
 * nothing.
 */
export function stripPii(props: EventProps): EventProps {
  const safe: EventProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && (EMAIL.test(value) || PHONE.test(value)))
      continue;
    safe[key] = value;
  }
  return safe;
}

export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (typeof document === 'undefined') return;
  if (readConsent(document.cookie) !== 'granted') return;
  if (!isAnalyticsConfigured()) return;

  const payload = stripPii(props);

  // The provider calls go here. Deliberately left as the single seam rather
  // than stubbed with a vendor SDK nobody can test without keys: everything
  // above this line — the consent gate, the event union, the PII strip — is
  // real, tested, and the part that is easy to get wrong.
  void payload;
}

/**
 * User properties, per §10.7: "Track `motion_tier` and `reduced_motion` as user
 * properties to correlate experience with conversion."
 *
 * These are the one measurement this site genuinely needs before any other:
 * the whole 3D programme rests on tiering, and without knowing which tier a
 * converting visitor actually saw, there is no way to tell whether the scenes
 * help or hurt. Same two gates as `track`.
 */
export function identifyExperience(props: {
  motionTier: string;
  reducedMotion: boolean;
}): void {
  if (typeof document === 'undefined') return;
  if (readConsent(document.cookie) !== 'granted') return;
  if (!isAnalyticsConfigured()) return;
  void props;
}
