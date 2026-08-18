import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  sendEmail,
  sendLeadNotificationEmail,
  sendLeadConfirmationEmail,
  getResendApiKey,
  getSenderEmail,
  getLeadsRecipientEmail,
  getCareersRecipientEmail,
} from '@/lib/email/resend';

describe('Resend Email Integration (lib/email/resend.ts)', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('reads environment variables correctly', () => {
    vi.stubEnv('RESEND_API_KEY', 're_test_key_123');
    vi.stubEnv('RESEND_FROM_EMAIL', 'Luxe Axis <test@luxeaxis.in>');
    vi.stubEnv('LEADS_RECIPIENT_EMAIL', 'leads@luxeaxis.in');
    vi.stubEnv('CAREERS_RECIPIENT_EMAIL', 'careers@luxeaxis.in');

    expect(getResendApiKey()).toBe('re_test_key_123');
    expect(getSenderEmail()).toBe('Luxe Axis <test@luxeaxis.in>');
    expect(getLeadsRecipientEmail()).toBe('leads@luxeaxis.in');
    expect(getCareersRecipientEmail()).toBe('careers@luxeaxis.in');
  });

  it('simulates dispatch when RESEND_API_KEY is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const result = await sendEmail({
      to: 'client@example.com',
      subject: 'Test Subject',
      html: '<p>Hello</p>',
    });

    expect(result.ok).toBe(true);
    expect(result.id).toBe('simulated_dev_id');
  });

  it('calls Resend API when RESEND_API_KEY is configured', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_valid_key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'email_resend_12345' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendEmail({
      to: 'client@example.com',
      subject: 'Welcome to Luxe Axis',
      html: '<h1>Design Audit</h1>',
    });

    expect(result.ok).toBe(true);
    expect(result.id).toBe('email_resend_12345');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer re_valid_key',
        }),
      }),
    );
  });

  it('dispatches lead notification email with lead details', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_valid_key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'email_lead_notif_999' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendLeadNotificationEmail({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 98400 12345',
      propertyType: 'apartment',
      areaSqFt: 2400,
      tier: 'Elite',
      city: 'Chennai',
    });

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const payload = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(payload.subject).toContain('John Doe');
    expect(payload.html).toContain('John Doe');
    expect(payload.html).toContain('2,400 sq.ft');
    expect(payload.html).toContain('Elite');
  });

  it('dispatches lead confirmation email to applicant', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_valid_key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'email_confirm_888' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendLeadConfirmationEmail({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 98400 54321',
      city: 'Chennai',
    });

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const payload = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(payload.to).toEqual(['jane@example.com']);
    expect(payload.html).toContain('Jane Smith');
    expect(payload.html).toContain('Free 60-Minute Luxury Design');
  });
});
