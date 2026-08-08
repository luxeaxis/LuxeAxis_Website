import { STUDIO, mailtoHref, whatsappHref } from '@/lib/content/studio';
import type { Lead } from './schema';

/**
 * Turns a failed submission into something the visitor can still send.
 *
 * When `/api/lead` cannot deliver — no destination configured, or the
 * destination is down — the enquiry is lost. Everything the visitor typed is
 * still sitting in the form in front of them, and the studio now has a real
 * phone number, WhatsApp and inbox, so telling them "try again later" throws
 * away a lead for no reason.
 *
 * This composes what they wrote into a `mailto:` and a WhatsApp message so the
 * next click sends it through a channel that works.
 *
 * ## Nothing is transmitted from here
 *
 * These are links. The visitor's own mail client or WhatsApp opens with the
 * text prepared, and THEY press send — the site never posts their details
 * anywhere. That distinction matters: the alternative (quietly forwarding a
 * failed submission somewhere else) would move personal data to a destination
 * they did not choose, on the one path where the site has just told them it
 * could not be delivered.
 *
 * ## Why the body is trimmed
 *
 * `mailto:` and `wa.me` URLs go through the browser, the OS and the target app,
 * and the shortest link in that chain is the practical limit — historically
 * around 2000 characters for `mailto`. An over-long URL does not error, it
 * silently truncates, so the notes field is capped and the essential fields are
 * ordered first. A visitor who wrote an essay still gets their name, contact
 * details and project basics through intact.
 */

const MAX_NOTES = 600;

function lines(lead: Lead): string[] {
  const out = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Property: ${lead.propertyType}, about ${lead.areaSqFt} sq ft, in ${lead.city}`,
    `Tier: ${lead.tier}`,
    `Prefers: ${lead.contactMethod}, ${lead.preferredTime}`,
  ];
  if (lead.notes) {
    const notes =
      lead.notes.length > MAX_NOTES
        ? `${lead.notes.slice(0, MAX_NOTES)}…`
        : lead.notes;
    out.push(`Notes: ${notes}`);
  }
  return out;
}

export function auditEmailHref(lead: Lead): string | null {
  if (!STUDIO.email) return null;
  const subject = `Design audit request — ${lead.name}`;
  const body = [
    'I would like to book a design audit.',
    '',
    ...lines(lead),
  ].join('\n');
  return `${mailtoHref(STUDIO.email.general)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function auditWhatsappHref(lead: Lead): string | null {
  if (!STUDIO.whatsapp) return null;
  const text = ['I would like to book a design audit.', ...lines(lead)].join(
    '\n',
  );
  return `${whatsappHref(STUDIO.whatsapp)}?text=${encodeURIComponent(text)}`;
}
