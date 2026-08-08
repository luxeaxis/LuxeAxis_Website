import { describe, expect, it } from 'vitest';
import { auditEmailHref, auditWhatsappHref } from '@/lib/lead/fallback';
import type { Lead } from '@/lib/lead/schema';

/**
 * The rescue path for a failed submission.
 *
 * Everything here is about a lead not being lost. The endpoint has no
 * destination configured, so today EVERY submission fails — which makes this
 * the only route by which a Book-Audit enquiry reaches the studio at all.
 */

const LEAD: Lead = {
  propertyType: 'apartment',
  areaSqFt: 1200,
  tier: 'Signature',
  city: 'Chennai',
  name: 'A Visitor',
  email: 'visitor@example.com',
  phone: '+91 98400 00000',
  preferredTime: 'morning',
  contactMethod: 'whatsapp',
  consent: true,
};

describe('the email fallback', () => {
  it('addresses the enquiries inbox, not support', () => {
    // An enquiry in the support inbox is an enquiry that waits behind existing
    // clients' problems.
    expect(auditEmailHref(LEAD)!.startsWith('mailto:info@luxeaxis.in')).toBe(
      true,
    );
  });

  it('carries everything the studio needs to reply', () => {
    const decoded = decodeURIComponent(auditEmailHref(LEAD)!);
    for (const fragment of [
      'A Visitor',
      'visitor@example.com',
      '+91 98400 00000',
      '1200 sq ft',
      'Chennai',
      'Signature',
    ]) {
      expect(decoded, fragment).toContain(fragment);
    }
  });

  it('percent-encodes the body, so a newline cannot truncate the link', () => {
    // A raw newline or ampersand in a mailto ends the parameter early, and the
    // rest of the enquiry silently disappears.
    const href = auditEmailHref({
      ...LEAD,
      notes: 'Line one\nLine two & more',
    })!;
    expect(href).not.toContain('\n');
    expect(decodeURIComponent(href)).toContain('Line two & more');
  });

  it('trims very long notes rather than letting the URL truncate silently', () => {
    // mailto has a practical length ceiling of roughly 2000 characters across
    // the browser, OS and mail client. Over it, nothing errors — the link is
    // just cut, and whatever fell off the end is gone. Better to trim the one
    // free-text field deliberately and keep the contact details intact.
    const href = auditEmailHref({ ...LEAD, notes: 'x'.repeat(5000) })!;
    const decoded = decodeURIComponent(href);
    expect(decoded).toContain('…');
    // The fields that matter for a reply survive the trim.
    expect(decoded).toContain('visitor@example.com');
    expect(decoded).toContain('+91 98400 00000');
    expect(href.length).toBeLessThan(2000);
  });

  it('names the request in the subject, so it is findable in an inbox', () => {
    expect(decodeURIComponent(auditEmailHref(LEAD)!)).toContain(
      'subject=Design audit request — A Visitor',
    );
  });
});

describe('the WhatsApp fallback', () => {
  it('uses a digits-only wa.me link with the message prefilled', () => {
    const href = auditWhatsappHref(LEAD)!;
    expect(href.startsWith('https://wa.me/918124600321?text=')).toBe(true);
    // The `+` must not survive into the path — wa.me rejects it.
    expect(href.split('?')[0]).not.toContain('+');
  });

  it('carries the visitor’s own details, not a template', () => {
    const decoded = decodeURIComponent(auditWhatsappHref(LEAD)!);
    expect(decoded).toContain('A Visitor');
    expect(decoded).toContain('Chennai');
  });
});

describe('both fallbacks', () => {
  it('are links only — nothing here transmits anything', () => {
    // The visitor's own mail client or WhatsApp opens with the text prepared
    // and THEY press send. Quietly forwarding a failed submission elsewhere
    // would move personal data to a destination they did not choose, on the one
    // path where the site has just told them delivery failed.
    for (const href of [auditEmailHref(LEAD)!, auditWhatsappHref(LEAD)!]) {
      expect(
        href.startsWith('mailto:') || href.startsWith('https://wa.me/'),
      ).toBe(true);
    }
  });
});
