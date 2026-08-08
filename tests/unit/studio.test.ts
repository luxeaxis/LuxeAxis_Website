import { describe, expect, it } from 'vitest';
import {
  CIN_PATTERN,
  GSTIN_PATTERN,
  STUDIO,
  addressOneLine,
  formatWindow,
  mailtoHref,
  telHref,
  whatsappHref,
} from '@/lib/content/studio';
import { localBusinessJsonLd } from '@/lib/seo/jsonLd';

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
      expect(phone.display.replace(/\D/g, '')).toBe(
        phone.e164.replace(/\D/g, ''),
      );
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

describe('the statutory identifiers', () => {
  it('matches the CIN structure the MCA register issues', () => {
    // Not a checksum — the MCA number has none. This catches the realistic
    // failure: a character transposed or dropped while copying from a
    // certificate. Both numbers go on every invoice the studio raises, so a
    // typo is a compliance problem rather than a display bug.
    expect(STUDIO.cin).toMatch(CIN_PATTERN);
  });

  it('matches the GSTIN structure', () => {
    expect(STUDIO.gst).toMatch(GSTIN_PATTERN);
  });

  it('agrees with itself about the state', () => {
    // GST state code 33 is Tamil Nadu; the CIN carries TN in the same role.
    // Two independently transcribed numbers disagreeing is the single most
    // likely sign one of them was mistyped.
    expect(STUDIO.gst?.slice(0, 2)).toBe('33');
    expect(STUDIO.cin?.slice(6, 8)).toBe('TN');
  });

  it('agrees with itself about the entity type', () => {
    // The CIN says PTC (private limited company). The PAN embedded in the
    // GSTIN — characters 2..12 — carries the entity code in its 4th position,
    // and C there also means company. A mismatch would mean one of the two
    // numbers belongs to a different entity.
    //
    // CIN layout: U | 74102 | TN | 2026 | PTC | 194776
    //             0 | 1-5   | 6-7| 8-11 |12-14| 15-20
    expect(STUDIO.cin?.slice(12, 15)).toBe('PTC');
    expect(STUDIO.gst?.slice(2, 12).charAt(3)).toBe('C');
  });

  it('rejects a malformed identifier, so the patterns are not vacuous', () => {
    // Guards the guard: a pattern that matched anything would make every
    // assertion above pass regardless of what was configured.
    expect('U74102TN2026PTC19477').not.toMatch(CIN_PATTERN); // one digit short
    expect('X74102TN2026PTC194776').not.toMatch(CIN_PATTERN); // bad listing flag
    expect('33AAGCL9614E1ZMX').not.toMatch(GSTIN_PATTERN); // one character over
    expect('33AAGCL9614E1YM').not.toMatch(GSTIN_PATTERN); // Z is fixed
  });
});

describe('the response window', () => {
  it('publishes when a message gets answered', () => {
    expect(STUDIO.responseWindow).toEqual({
      start: '07:00',
      end: '22:00',
      days: 'every day',
    });
  });

  it('reads as a sentence rather than a timetable', () => {
    expect(formatWindow(STUDIO.responseWindow!)).toBe('7am to 10pm, every day');
    // Midnight and noon are where a naive modulo produces "0am" and "0pm".
    expect(
      formatWindow({ start: '00:00', end: '12:30', days: 'weekdays' }),
    ).toBe('12am to 12.30pm, weekdays');
  });

  it('is never published as opening hours', () => {
    // The distinction is the whole point of the field existing separately.
    // schema.org `openingHours` asserts that a member of the public can arrive
    // at the address and be admitted; this studio is a serviced floor that
    // takes no drop-ins. Copying the window across would put "Open now" on a
    // Google listing above a reception that has never heard of the visitor —
    // and it is a one-line change that would look like tidying up.
    expect(STUDIO.openingHours).toBeNull();

    const business = localBusinessJsonLd();
    expect(business).not.toHaveProperty('openingHours');
    expect(business).not.toHaveProperty('openingHoursSpecification');
    expect(JSON.stringify(business)).not.toContain('07:00');
  });
});
