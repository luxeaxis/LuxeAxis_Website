import { describe, expect, it } from 'vitest';
import { STUDIO, addressOneLine, mailtoHref, telHref, whatsappHref } from '@/lib/content/studio';

/**
 * The studio's own facts.
 *
 * These are the details a visitor acts on — dials, messages, writes to, or puts
 * into a maps app — so the assertions here are about them being usable rather
 * than merely present. A phone number that renders beautifully and does not
 * dial is worse than no number.
 */

describe('the phone number', () => {
  it('keeps the dial-safe and readable forms in sync', () => {
    // Stored as a pair rather than derived, so this is what stops them drifting:
    // the digits must be identical, whatever the grouping.
    for (const phone of [STUDIO.telephone, STUDIO.whatsapp]) {
      if (!phone) continue;
      expect(phone.display.replace(/\D/g, '')).toBe(phone.e164.replace(/\D/g, ''));
    }
  });

  it('stores E.164, which is what tel: needs', () => {
    expect(STUDIO.telephone?.e164).toMatch(/^\+\d{8,15}$/);
    expect(telHref(STUDIO.telephone!)).toBe('tel:+918124600321');
  });

  it('builds a wa.me link with no plus sign', () => {
    // wa.me rejects the `+`, which is the single most common way this link ends
    // up silently broken.
    const href = whatsappHref(STUDIO.whatsapp!);
    expect(href).toBe('https://wa.me/918124600321');
    expect(href).not.toContain('+');
    expect(href).not.toContain(' ');
  });
});

describe('the email addresses', () => {
  it('separates new enquiries from existing projects', () => {
    // Sending an existing client's problem to a sales inbox is how it waits
    // three days.
    expect(STUDIO.email?.general).toBe('info@luxeaxis.in');
    expect(STUDIO.email?.support).toBe('support@luxeaxis.in');
    expect(STUDIO.email?.general).not.toBe(STUDIO.email?.support);
  });

  it('sits on the site\u2019s own domain', () => {
    // A contact address on a different domain from the canonical site is a
    // phishing signal to spam filters and to people.
    for (const address of Object.values(STUDIO.email ?? {})) {
      expect(address.endsWith('@luxeaxis.in'), address).toBe(true);
      expect(address).toBe(address.toLowerCase());
    }
  });

  it('builds a mailto', () => {
    expect(mailtoHref('info@luxeaxis.in')).toBe('mailto:info@luxeaxis.in');
  });
});

describe('the address', () => {
  it('renders as supplied, without being tidied', () => {
    // "New 2, No. 145" is left exactly as the studio wrote it. It is most likely
    // a new/old door-number pair, but guessing which is which would invent
    // precision nobody gave — and a wrong door number is a courier at the wrong
    // building.
    expect(addressOneLine(STUDIO.address!)).toContain('New 2, No. 145');
    expect(addressOneLine(STUDIO.address!)).toContain('Awfis');
    expect(addressOneLine(STUDIO.address!)).toContain('8th Floor');
  });

  it('splits into the parts schema.org wants', () => {
    expect(STUDIO.address?.postalCode).toBe('600006');
    expect(STUDIO.address?.locality).toBe('Chennai');
    expect(STUDIO.address?.region).toBe('Tamil Nadu');
    // ISO 3166-1 alpha-2, not "India" — schema.org wants the code.
    expect(STUDIO.address?.country).toBe('IN');
  });

  it('keeps the floor and building in the street line, where a courier reads them', () => {
    expect(STUDIO.address?.street).toContain('8th Floor');
    expect(STUDIO.address?.street).toContain('Nungambakkam High Rd');
  });
});

describe('what is still outstanding', () => {
  it('publishes no CIN or GST it has not been given', () => {
    // Both are quoted on invoices and checked against a government register. A
    // plausible-looking one is not a placeholder, it is a false company record.
    expect(STUDIO.cin).toBeNull();
    expect(STUDIO.gst).toBeNull();
  });

  it('publishes no opening hours', () => {
    expect(STUDIO.openingHours).toBeNull();
  });
});
