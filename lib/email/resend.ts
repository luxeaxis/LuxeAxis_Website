/**
 * Luxe Axis — Centralized Resend Email Service
 *
 * Provides transactional email dispatch for:
 * 1. Design Audits & Lead Notifications (/api/lead)
 * 2. Client Welcome & SLA Confirmation Emails
 * 3. Job Application & Resume Delivery (/api/careers)
 * 4. General Studio Inquiries
 */

export interface LeadEmailPayload {
  name: string;
  email: string;
  phone: string;
  propertyType?: string;
  areaSqFt?: number;
  tier?: string;
  city?: string;
  preferredTime?: string;
  contactMethod?: string;
  receivedAt?: string;
  firstTouchDueAt?: string;
  notes?: string;
}

export interface CareerEmailPayload {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  experience?: string;
  portfolio?: string;
  message?: string;
  attachments?: Array<{ filename: string; content: string }>;
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  preferredStudio?: string;
}

const RESEND_API_URL = 'https://api.resend.com/emails';

export function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY;
}

export function getSenderEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    'Luxe Axis Studio <onboarding@resend.dev>'
  );
}

export function getLeadsRecipientEmail(): string {
  return process.env.LEADS_RECIPIENT_EMAIL || 'info@luxeaxis.in';
}

export function getCareersRecipientEmail(): string {
  return process.env.CAREERS_RECIPIENT_EMAIL || 'careers@luxeaxis.in';
}

/**
 * Generic Resend dispatch helper.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string }>;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    console.warn(
      `[resend] RESEND_API_KEY not configured. Email to "${Array.isArray(to) ? to.join(', ') : to}" was not sent (Dev mode).`,
    );
    return { ok: true, id: 'simulated_dev_id' };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getSenderEmail(),
        to: Array.isArray(to) ? to : [to],
        reply_to: replyTo,
        subject,
        html,
        attachments: attachments && attachments.length > 0 ? attachments : undefined,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const data = (await res.json()) as { id?: string; message?: string; name?: string };

    if (!res.ok) {
      console.error('[resend] API error:', data);
      return { ok: false, error: data.message || 'Resend API dispatch failed' };
    }

    return { ok: true, id: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown network error';
    console.error('[resend] Network error:', msg);
    return { ok: false, error: msg };
  }
}

/**
 * 1. Send Internal Lead Notification to Studio Team (info@luxeaxis.in)
 */
export async function sendLeadNotificationEmail(lead: LeadEmailPayload) {
  const subject = `[New Lead] ${lead.name} — ${lead.propertyType ? lead.propertyType.toUpperCase() : 'RESIDENCE'} (${lead.tier || 'Signature'})`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0d12; color: #e5e7eb; margin: 0; padding: 24px; }
          .card { max-width: 620px; margin: 0 auto; background-color: #121620; border: 1px solid #d4af37; border-radius: 12px; padding: 28px; }
          .badge { display: inline-block; background-color: rgba(212,175,55,0.15); color: #ffd700; border: 1px solid rgba(212,175,55,0.4); border-radius: 999px; padding: 4px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          h1 { font-size: 20px; color: #ffffff; margin: 12px 0 4px 0; }
          .sla { background-color: #1c2333; border-left: 4px solid #ffd700; padding: 10px 14px; margin: 16px 0; font-size: 13px; color: #f3f4f6; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 18px 0; }
          .field { background-color: #0b0d12; border: 1px solid #1f293d; padding: 10px 14px; border-radius: 8px; }
          .label { font-size: 10px; text-transform: uppercase; color: #ffd700; font-weight: bold; margin-bottom: 2px; }
          .value { font-size: 14px; color: #ffffff; font-weight: 500; }
          .footer { margin-top: 24px; padding-top: 14px; border-top: 1px solid #2a3040; font-size: 11px; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Design Audit Lead</span>
          <h1>${lead.name}</h1>
          
          <div class="sla">
            ⏱️ <strong>First-Touch SLA Deadline:</strong> ${lead.firstTouchDueAt ? new Date(lead.firstTouchDueAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST' : 'Within 30 minutes'}
          </div>

          <div class="grid">
            <div class="field">
              <div class="label">Phone / WhatsApp</div>
              <div class="value">${lead.phone}</div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${lead.email}" style="color: #60a5fa; text-decoration: none;">${lead.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Property Type</div>
              <div class="value">${lead.propertyType || 'Apartment / Villa'}</div>
            </div>
            <div class="field">
              <div class="label">Area (Sq.Ft)</div>
              <div class="value">${lead.areaSqFt ? `${lead.areaSqFt.toLocaleString()} sq.ft` : 'Not specified'}</div>
            </div>
            <div class="field">
              <div class="label">Budget Tier</div>
              <div class="value">${lead.tier || 'Signature Tier'}</div>
            </div>
            <div class="field">
              <div class="label">City / Micro-Market</div>
              <div class="value">${lead.city || 'Chennai'}</div>
            </div>
            <div class="field">
              <div class="label">Preferred Contact</div>
              <div class="value">${lead.contactMethod || 'WhatsApp'} (${lead.preferredTime || 'Anytime'})</div>
            </div>
            <div class="field">
              <div class="label">Submission Time</div>
              <div class="value">${lead.receivedAt ? new Date(lead.receivedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Just now'}</div>
            </div>
          </div>

          <div class="footer">
            Luxe Axis Lead Dispatch • Notification to ${getLeadsRecipientEmail()}
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: getLeadsRecipientEmail(),
    replyTo: lead.email,
    subject,
    html,
  });
}

/**
 * 2. Send Client Confirmation / Welcome Email
 */
export async function sendLeadConfirmationEmail(lead: LeadEmailPayload) {
  const subject = `Your Design Audit Confirmation — Luxe Axis Chennai`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0d12; color: #e5e7eb; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background-color: #121620; border: 1px solid #d4af37; border-radius: 12px; padding: 32px; }
          .logo { font-size: 20px; font-weight: bold; color: #ffd700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
          h1 { font-size: 22px; color: #ffffff; margin: 0 0 12px 0; }
          p { font-size: 14px; line-height: 1.6; color: #d1d5db; margin: 0 0 16px 0; }
          .box { background-color: #0b0d12; border: 1px solid #1f293d; border-radius: 8px; padding: 18px; margin: 20px 0; }
          .box-title { color: #ffd700; font-size: 13px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
          .cta-btn { display: inline-block; background-color: #d4af37; color: #0b0d12; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; margin-top: 12px; }
          .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #2a3040; font-size: 12px; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">LUXE AXIS</div>
          <h1>Thank you, ${lead.name}.</h1>
          <p>We have received your request for a <strong>Free 60-Minute Luxury Design & Vastu Audit</strong> for your residence in ${lead.city || 'Chennai'}.</p>
          
          <div class="box">
            <div class="box-title">What Happens Next?</div>
            <p style="margin-bottom: 8px;">1. <strong>Senior Architect Assignment:</strong> A dedicated interior architect is reviewing your property details.</p>
            <p style="margin-bottom: 8px;">2. <strong>First-Touch SLA:</strong> Our team will reach out via ${lead.contactMethod || 'WhatsApp'} within 30 minutes during business hours (9 AM – 6 PM IST).</p>
            <p style="margin-bottom: 0;">3. <strong>Itemized BOQ & CAD Audit:</strong> We will prepare your preliminary space layout and transparent cost breakdown.</p>
          </div>

          <p>Need immediate architectural assistance or want to share your floor plans directly?</p>
          
          <a href="https://wa.me/918124600321?text=Hi%20Luxe%20Axis,%20I%20just%20booked%20a%20design%20audit%20for%20my%20residence." class="cta-btn">
            Connect on WhatsApp (+91 81246 00321) →
          </a>

          <div class="footer">
            Luxe Axis Studio • Khader Nawaz Khan Road, Nungambakkam, Chennai 600006<br/>
            Phone: +91 81246 00321 • Email: info@luxeaxis.in
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: lead.email,
    replyTo: getLeadsRecipientEmail(),
    subject,
    html,
  });
}
