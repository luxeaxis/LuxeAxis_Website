import { z } from 'zod';

/**
 * The Book-Audit lead schema (Build Backlog T-19), shared verbatim by the form
 * and by `app/api/lead/route.ts`.
 *
 * ONE schema, not two. A client-side copy that drifts from the server's is how
 * a form ends up accepting something the API rejects — and worse here, how a
 * lead the studio has promised a 30-minute first-touch on is silently dropped
 * at the boundary. The server re-validates rather than trusting the client,
 * because anything can POST to a public endpoint.
 *
 * This is also the point where Zod genuinely earns its weight, which
 * `components/FeeCalculator.tsx` deliberately does not: there the data never
 * left the browser and TypeScript already knew its shape. Here it crosses the
 * wire, so the server has no compile-time knowledge of what arrives.
 *
 * ## Error copy
 *
 * Every message is written to the brand voice rule (Spec §10.6.7, Design System
 * §3.4): say what to do, never blame. "Enter a phone number we can reach you
 * on", not "Invalid input". No superlatives — the Brand Voice Guide forbids
 * them outright, and error text is where they creep in as reassurance.
 */

/** Step 1 — project basics. Nothing here identifies anybody, which is why it
 *  comes first: the visitor commits to describing the project before being
 *  asked who they are. */
export const projectBasicsSchema = z.object({
  propertyType: z.enum(['apartment', 'villa', 'commercial', 'other'], {
    message: 'Choose the option closest to your space.',
  }),
  areaSqFt: z
    .number({ message: 'Enter the approximate area in square feet.' })
    .int('Round to the nearest square foot.')
    .positive('Enter the approximate area in square feet.')
    .max(1_000_000, 'That is larger than we can plan for here — talk to us directly.'),
  tier: z.enum(['Essential', 'Signature', 'Elite', 'undecided'], {
    message: 'Pick a tier, or choose "Still deciding".',
  }),
  city: z
    // The message is set on the TYPE too, not only on `.min()`. A field that is
    // absent rather than empty fails the type check first, and Zod's default
    // there is "Invalid input" — which breaks the brand-voice rule (Spec
    // §10.6.7) in the one place a visitor is already frustrated. This is not
    // hypothetical: it is exactly what /book-audit showed when Field was
    // silently dropping react-hook-form's ref.
    .string({ message: 'Tell us where the property is.' })
    .trim()
    .min(1, 'Tell us where the property is.')
    .max(120, 'Shorten this to under 120 characters.'),
});

/** Step 2 — who to reach, and how. */
export const contactSchema = z.object({
  name: z
    .string({ message: 'Tell us what to call you.' })
    .trim()
    .min(1, 'Tell us what to call you.')
    .max(120, 'Shorten this to under 120 characters.'),
  email: z
    .string({ message: 'Enter an email address we can reach you on.' })
    .trim()
    .min(1, 'Enter an email address we can reach you on.')
    // `z.email()` rather than a hand-rolled pattern: address syntax is far
    // stranger than any regex written in a hurry, and over-strict validation
    // rejects real people — a lead lost to a false negative is invisible.
    .pipe(z.email('Enter an email address we can reach you on.')),
  phone: z
    .string({ message: 'Enter a phone number we can reach you on.' })
    .trim()
    .min(1, 'Enter a phone number we can reach you on.')
    // Deliberately permissive: +91, spaces, hyphens and international formats
    // all pass. The NRI persona (Spec §2.1) is a primary audience, so anything
    // that assumes a ten-digit Indian mobile would reject exactly the
    // highest-value visitor.
    .regex(/^[+\d][\d\s\-()]{6,}$/, 'Enter a phone number we can reach you on.'),
  preferredTime: z.enum(['morning', 'afternoon', 'evening', 'any'], {
    message: 'Pick a time of day that suits you.',
  }),
  /** WhatsApp and Zoom are surfaced for the NRI persona (Spec §5.9, §2.1). */
  contactMethod: z.enum(['call', 'whatsapp', 'zoom'], {
    message: 'Choose how you would like us to reach you.',
  }),
  notes: z
    .string({ message: 'Shorten this to under 2000 characters.' })
    .trim()
    .max(2000, 'Shorten this to under 2000 characters.')
    .optional(),
  /**
   * DPDPA consent. `z.literal(true)` rather than `z.boolean()` — an unchecked
   * box must fail validation, not submit `false`. The checkbox is never
   * pre-ticked (T-19), because consent that was not actively given is not
   * consent under the DPDP Act.
   */
  consent: z.literal(true, {
    message: 'We need your permission to contact you about this enquiry.',
  }),
});

export const leadSchema = projectBasicsSchema.extend(contactSchema.shape);

export type ProjectBasics = z.infer<typeof projectBasicsSchema>;
export type LeadContact = z.infer<typeof contactSchema>;
export type Lead = z.infer<typeof leadSchema>;

/**
 * Attribution the server adds — never the client. UTM values arrive from the
 * page URL, but the timestamp and SLA deadline are computed server-side so a
 * forged payload cannot backdate a lead out of its first-touch window.
 */
export const leadSourceSchema = z.object({
  source: z.string().max(200).optional(),
  medium: z.string().max(200).optional(),
  campaign: z.string().max(200).optional(),
  /** The page the visitor submitted from. */
  path: z.string().max(500).optional(),
});

export type LeadSource = z.infer<typeof leadSourceSchema>;

/** The full request body `/api/lead` accepts. */
export const leadRequestSchema = leadSchema.extend({ attribution: leadSourceSchema.optional() });

export type LeadRequest = z.infer<typeof leadRequestSchema>;

/** Spec §10.7: "forms post to the Space OS lead queue with source/UTM
 *  attribution for the 30-minute first-touch SLA." */
export const FIRST_TOUCH_SLA_MINUTES = 30;
