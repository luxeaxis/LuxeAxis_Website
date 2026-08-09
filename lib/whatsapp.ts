/**
 * Helper utilities for formatting WhatsApp phone numbers and building wa.me links.
 */

export function cleanPhoneNumber(phone: string): string {
  // Remove non-digit characters except leading +
  const digitsOnly = phone.replace(/[^\d]/g, '');
  return digitsOnly;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const sanitizedPhone = cleanPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`;
}

export const DEFAULT_WHATSAPP_CHANNELS = {
  sales: {
    label: 'Sales & Consultations',
    description: 'Design inquiries, pricing, & estimates',
    message: "Hi LuxeAxis, I would like to inquire about interior design for my home.",
  },
  audit: {
    label: 'Book Free Audit',
    description: '45-minute audit with a real designer',
    message: "Hi LuxeAxis, I would like to book a free 45-minute design audit.",
  },
  support: {
    label: 'Project Support & Space OS',
    description: 'Existing client updates & ongoing projects',
    message: "Hi LuxeAxis, I need support regarding my ongoing project.",
  },
} as const;
