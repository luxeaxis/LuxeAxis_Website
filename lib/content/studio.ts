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
  /**
   * Premises hours, in schema.org's sense: when a member of the public may
   * turn up at the address and be let in. Deliberately null and expected to
   * stay that way — the studio works from a serviced floor and does not take
   * drop-ins, so any value here would put "Open now" on a Google listing above
   * a door that will not open. See `responseWindow` for the thing people
   * actually want to know.
   */
  openingHours: string | null;
  /**
   * When a message gets an answer. This is not the same claim as being open,
   * which is exactly why it is a separate field and never reaches the
   * LocalBusiness markup.
   */
  responseWindow: ResponseWindow | null;
  cin: string | null;
  gst: string | null;
};

/** A daily window, in 24-hour local time. `days` describes which days it
 *  covers, in words, because "daily" and "Mon-Fri" are read by a person here
 *  rather than parsed by anything. */
export type ResponseWindow = {
  start: string;
  end: string;
  days: string;
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
    street:
      'Awfis, Rajkamal Pinnacle, 8th Floor, New 2, No. 145, Nungambakkam High Rd, Thousand Lights West, Nungambakkam',
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
  // Every day, including weekends — an NRI client in a US time zone is the
  // reason this starts at 07:00 and runs to 22:00 rather than tracking an
  // office day. Published as a response commitment, not as opening hours.
  responseWindow: { start: '07:00', end: '22:00', days: 'every day' },
  // Corporate Identification Number, from the MCA register. The structure is
  // load-bearing rather than decorative: U (unlisted) | 74102 (industry) | TN
  // (state) | 2026 (incorporation year) | PTC (private limited company) |
  // 194776 (registration number). tests/unit/studio.test.ts checks that shape,
  // and that its state and entity type agree with the GST number below —
  // a transposed character here appears on every invoice the studio raises.
  cin: 'U74102TN2026PTC194776',
  // GSTIN: 33 (Tamil Nadu) | AAGCL9614E (PAN) | 1 (entity number) | Z | M
  // (checksum character). The embedded PAN's fourth character, C, marks a
  // company, which matches the CIN's PTC.
  gst: '33AAGCL9614E1ZM',
};

/**
 * The response window in prose: "7am to 10pm, every day".
 *
 * Twelve-hour time with am/pm, because the audience reads it that way and this
 * is a sentence rather than a machine-readable field. The one place a
 * 24-hour string would be correct is schema.org `openingHours`, which this
 * value must never be used for — see `Studio.openingHours`.
 */
export function formatWindow(window: ResponseWindow): string {
  const twelveHour = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const suffix = hours! < 12 ? 'am' : 'pm';
    const hour = hours! % 12 === 0 ? 12 : hours! % 12;
    return minutes
      ? `${hour}.${String(minutes).padStart(2, '0')}${suffix}`
      : `${hour}${suffix}`;
  };
  return `${twelveHour(window.start)} to ${twelveHour(window.end)}, ${window.days}`;
}

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

/**
 * Structural checks for the two statutory identifiers.
 *
 * Not a checksum — the GSTIN check digit needs a modulus routine this site has
 * no business carrying, and the MCA number has none at all. What this catches
 * is the realistic failure: a character transposed or dropped while copying
 * from a certificate into a config file. Both numbers appear on invoices and
 * are checked against a government register, so a typo is a compliance problem
 * rather than a display bug.
 */
export const CIN_PATTERN = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;
export const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/;

/** `mailto:` href. */
export function mailtoHref(address: string): string {
  return `mailto:${address}`;
}

/** The address as one line, for `aria-label`s and metadata descriptions. */
export function addressOneLine(address: PostalAddress): string {
  return address.lines.join(', ');
}
