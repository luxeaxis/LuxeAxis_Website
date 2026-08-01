/**
 * The studio's own facts.
 *
 * Separate from `source.ts` because these are not content in the CMS sense —
 * they are the company's identity, they appear in the footer of every page and
 * in structured data, and several of them are legally significant (Spec §2.3
 * requires CIN, GST and a DPDPA/privacy line in the footer trust row).
 *
 * `null` means "not supplied yet" and is rendered as a visible "To be
 * published" marker rather than omitted, so an outstanding company fact is
 * obvious on the page rather than silently missing.
 */

export type PostalAddress = {
  /** Exactly as supplied by the studio, for display. Not re-punctuated or
   *  re-ordered: an address is a fact, and tidying one is how a suite number
   *  quietly becomes wrong. */
  lines: readonly string[];
  /** Split out for schema.org, which wants the parts separately. The split is
   *  conservative — anything ambiguous stays in `street` rather than being
   *  reinterpreted. "New 2, No. 145" is left as written for that reason: it is
   *  most likely a new/old door-number pair, but guessing which is which would
   *  be inventing precision the studio did not give. */
  street: string;
  locality: string;
  region: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
};

/**
 * A phone number in two forms.
 *
 * `e164` is the canonical one, digits only with a leading `+`, and it is what
 * `tel:` and `wa.me` links are built from — both break on spaces. `display` is
 * the same digits grouped for reading. They are stored rather than derived
 * because deriving one from the other means encoding assumptions about Indian
 * mobile grouping that would be wrong for a landline or an overseas number, and
 * `tests/unit/studio.test.ts` asserts the digits match so the pair cannot drift.
 */
export type Phone = {
  e164: string;
  display: string;
};

/** Two addresses with different jobs: `general` for new enquiries, `support`
 *  for people who are already clients. Kept apart so a page can point at the
 *  right one — sending an existing client's problem to a sales inbox is how it
 *  waits three days. */
export type StudioEmails = {
  general: string;
  support: string;
};

export type Studio = {
  name: string;
  legalName: string;
  address: PostalAddress | null;
  telephone: Phone | null;
  whatsapp: Phone | null;
  email: StudioEmails | null;
  openingHours: string | null;
  cin: string | null;
  gst: string | null;
};

export const STUDIO: Studio = {
  name: 'Luxe Axis',
  // Used in the footer copyright line, which already carried this wording.
  legalName: 'Luxe Axis Private Limited',
  address: {
    lines: [
      'Awfis, Rajkamal Pinnacle, 8th Floor',
      'New 2, No. 145, Nungambakkam High Rd',
      'Thousand Lights West, Nungambakkam',
      'Chennai, Tamil Nadu 600006',
    ],
    street: 'Awfis, Rajkamal Pinnacle, 8th Floor, New 2, No. 145, Nungambakkam High Rd, Thousand Lights West, Nungambakkam',
    locality: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600006',
    country: 'IN',
  },
  telephone: { e164: '+918124600321', display: '+91 81246 00321' },
  // The same number. Stored as its own field rather than aliased, because the
  // two are genuinely separable — a studio can move WhatsApp to a business line
  // without changing the number people call — and a caller reading
  // `STUDIO.whatsapp` should not have to know they happen to coincide today.
  whatsapp: { e164: '+918124600321', display: '+91 81246 00321' },
  email: { general: 'info@luxeaxis.in', support: 'support@luxeaxis.in' },
  openingHours: null,
  cin: null,
  gst: null,
};

/** `tel:` href. Strips nothing — `e164` is already dial-safe. */
export function telHref(phone: Phone): string {
  return `tel:${phone.e164}`;
}

/**
 * A wa.me link. The path is digits only, with no `+` — wa.me rejects the plus
 * sign, which is the single most common way this link ends up broken.
 *
 * No prefilled message: a message the visitor did not write, arriving under
 * their name, is a small dishonesty, and it is also the thing people delete
 * before sending anyway.
 */
export function whatsappHref(phone: Phone): string {
  return `https://wa.me/${phone.e164.replace(/\D/g, '')}`;
}

/** `mailto:` href. */
export function mailtoHref(address: string): string {
  return `mailto:${address}`;
}

/** The address as one line, for `aria-label`s and metadata descriptions. */
export function addressOneLine(address: PostalAddress): string {
  return address.lines.join(', ');
}
