import { NextResponse, type NextRequest } from 'next/server';

/**
 * `POST /api/careers` — Resend email integration for Luxe Axis Careers applications.
 *
 * Receives multipart/form-data containing applicant details + attached Resume (PDF/DOCX).
 * Sends formatted email with attachment to careers@luxeaxis.in via Resend.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TARGET_EMAIL = process.env.CAREERS_RECIPIENT_EMAIL || 'careers@luxeaxis.in';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Luxe Axis Careers <onboarding@resend.dev>';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim() || 'Not provided';
    const role = (formData.get('role') as string)?.trim() || 'General Application';
    const experience = (formData.get('experience') as string)?.trim() || 'Not specified';
    const portfolio = (formData.get('portfolio') as string)?.trim() || 'Not provided';
    const message = (formData.get('message') as string)?.trim() || 'No additional note provided.';
    const resumeFile = formData.get('resume') as File | null;

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: 'missing_required_fields', message: 'Name and email are required.' },
        { status: 400 },
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'invalid_email', message: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    // Prepare attachment array if a resume file was uploaded
    const attachments: Array<{ filename: string; content: string }> = [];
    if (resumeFile && resumeFile.size > 0) {
      // Enforce 10MB limit
      if (resumeFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { ok: false, error: 'file_too_large', message: 'Resume file size must be less than 10MB.' },
          { status: 400 },
        );
      }

      const bytes = await resumeFile.arrayBuffer();
      const base64Content = Buffer.from(bytes).toString('base64');
      attachments.push({
        filename: resumeFile.name,
        content: base64Content,
      });
    }

    // Build rich HTML email body
    const emailSubject = `[Career Application] ${role} — ${name}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0d12; color: #e5e7eb; margin: 0; padding: 24px; }
            .card { max-width: 640px; margin: 0 auto; background-color: #121620; border: 1px solid #d4af37; border-radius: 12px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { border-bottom: 1px solid #2a3040; padding-bottom: 20px; margin-bottom: 24px; }
            .badge { display: inline-block; background-color: rgba(212,175,55,0.15); color: #ffd700; border: 1px solid rgba(212,175,55,0.4); border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            h1 { font-size: 22px; color: #ffffff; margin: 12px 0 4px 0; }
            .meta { color: #9ca3af; font-size: 14px; margin: 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
            .field { background-color: #0b0d12; border: 1px solid #1f293d; padding: 12px 16px; border-radius: 8px; }
            .label { font-size: 11px; text-transform: uppercase; color: #ffd700; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 4px; }
            .value { font-size: 14px; color: #ffffff; font-weight: 500; word-break: break-word; }
            .section-title { font-size: 14px; color: #ffd700; font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #1f293d; padding-bottom: 4px; }
            .message-box { background-color: #0b0d12; border: 1px solid #1f293d; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #d1d5db; white-space: pre-wrap; }
            .footer { margin-top: 32px; pt: 16px; border-top: 1px solid #2a3040; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">New Candidate Application</span>
              <h1>${name}</h1>
              <p class="meta">Target Position: <strong>${role}</strong></p>
            </div>

            <div class="grid">
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Phone / WhatsApp</div>
                <div class="value">${phone}</div>
              </div>
              <div class="field">
                <div class="label">Years of Experience</div>
                <div class="value">${experience}</div>
              </div>
              <div class="field">
                <div class="label">Portfolio / LinkedIn</div>
                <div class="value">${portfolio !== 'Not provided' ? `<a href="${portfolio}" target="_blank" style="color: #60a5fa; text-decoration: underline;">View Profile</a>` : 'Not provided'}</div>
              </div>
            </div>

            <div class="section-title">Attached Resume</div>
            <div class="field">
              <div class="value">${resumeFile ? `📎 ${resumeFile.name} (Attached to email)` : 'No file attached'}</div>
            </div>

            <div class="section-title">Cover Note / Introduction</div>
            <div class="message-box">${message}</div>

            <div class="footer">
              Luxe Axis Studio Careers System • Sent via Resend API • Recipient: ${TARGET_EMAIL}
            </div>
          </div>
        </body>
      </html>
    `;

    // Handle dev / simulation mode if RESEND_API_KEY is not configured
    if (!RESEND_API_KEY) {
      console.warn(
        `[careers] RESEND_API_KEY is not set. Application from "${name}" (${email}) for "${role}" processed in Dev Simulation Mode.`,
      );
      return NextResponse.json(
        {
          ok: true,
          simulated: true,
          message: 'Application received in simulation mode (RESEND_API_KEY missing).',
        },
        { status: 200 },
      );
    }

    // Call Resend REST API
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TARGET_EMAIL],
        reply_to: email,
        subject: emailSubject,
        html: emailHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    const resendData = (await resendRes.json()) as { id?: string; message?: string; name?: string };

    if (!resendRes.ok) {
      console.error('[careers] Resend API error:', resendData);
      return NextResponse.json(
        {
          ok: false,
          error: 'resend_error',
          message: resendData.message || 'Failed to dispatch email via Resend.',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id: resendData.id,
        message: 'Application sent successfully via Resend.',
      },
      { status: 200 },
    );
  } catch (cause) {
    console.error('[careers] Internal error processing application:', cause);
    return NextResponse.json(
      {
        ok: false,
        error: 'internal_error',
        message: 'An unexpected server error occurred. Please try again.',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
