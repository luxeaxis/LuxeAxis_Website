/**
 * DPDPA consent state (Build Backlog T-20, Spec §10.7).
 *
 * Shared by the banner that asks and the client that obeys, so "has this
 * visitor agreed?" is answered in exactly one place. A second implementation of
 * this question is how a site ends up loading a tracker for someone who
 * declined.
 *
 * ## Why a cookie and not localStorage
 *
 * The answer has to be readable on the server eventually — the moment analytics
 * moves server-side, or a script needs to be omitted from the HTML rather than
 * merely not executed, `localStorage` is invisible and a cookie is not. Storing
 * it as a cookie now means that change does not require re-asking every visitor
 * who already answered.
 */

export const CONSENT_COOKIE = 'lx-consent';

/** One year, matching the language cookie. Consent is a decision, not a
 *  session, and re-asking every fortnight is how banners become noise people
 *  click through without reading — which is the opposite of informed consent. */
export const CONSENT_MAX_AGE_SECONDS = 31_536_000;

/**
 * Three states, and the third is the important one.
 *
 * `'unknown'` is NOT the same as `'denied'` in what it permits — both block
 * analytics — but it is different in what it means: nobody has been asked yet,
 * so the banner should show. Collapsing them into a boolean would either
 * re-ask someone who already declined, or treat silence as a decision.
 */
export type ConsentState = 'granted' | 'denied' | 'unknown';

export function readConsent(cookieString: string | undefined): ConsentState {
  if (!cookieString) return 'unknown';
  const match = cookieString.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]+)`),
  );
  const value = match?.[1];
  return value === 'granted' || value === 'denied' ? value : 'unknown';
}

export function writeConsent(state: Exclude<ConsentState, 'unknown'>) {
  // `SameSite=Lax`, no `Secure`: same reasoning as lib/i18n/cookie.ts once
  // carried — it must survive a top-level navigation in from a search result,
  // and `Secure` would drop it on plain-HTTP localhost and silently disable
  // this path in development. The value is one of two literal words, not a
  // credential.
  document.cookie = `${CONSENT_COOKIE}=${state}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}
