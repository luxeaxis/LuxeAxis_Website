import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { leadSchema, type Lead } from '@/lib/lead/schema';

/**
 * The `/api/lead` contract (Build Backlog T-19 "API contract test").
 *
 * The route module is imported fresh inside each test because it reads
 * `LEAD_WEBHOOK_URL` at module scope — the configured and unconfigured paths
 * are genuinely different modules-in-memory, and a single import would pin
 * whichever ran first.
 */

const VALID: Lead = {
  propertyType: 'apartment',
  areaSqFt: 1200,
  tier: 'Signature',
  city: 'Chennai',
  name: 'A Visitor',
  email: 'visitor@example.com',
  phone: '+91 98400 00000',
  preferredTime: 'morning',
  contactMethod: 'whatsapp',
  consent: true,
};

async function loadRoute() {
  vi.resetModules();
  return import('@/app/api/lead/route');
}

function post(body: unknown): Request {
  return new Request('http://localhost/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('the lead schema', () => {
  it('accepts a complete submission', () => {
    expect(leadSchema.safeParse(VALID).success).toBe(true);
  });

  it('refuses an unticked consent box rather than recording false', () => {
    // The compliance case: consent that was not actively given is not consent,
    // so an unchecked box must FAIL validation, never submit as `false`.
    const result = leadSchema.safeParse({ ...VALID, consent: false });
    expect(result.success).toBe(false);
  });

  it('accepts international phone numbers, for the NRI persona', () => {
    // Spec §2.1 makes the overseas diaspora a primary audience. A ten-digit
    // Indian-mobile rule would reject exactly the highest-value visitor, and a
    // lead lost to a false negative is invisible.
    for (const phone of ['+44 7700 900123', '+1 (415) 555-0123', '+65 8123 4567', '9840000000']) {
      expect(leadSchema.safeParse({ ...VALID, phone }).success, phone).toBe(true);
    }
  });

  it('rejects a phone number that is not one', () => {
    for (const phone of ['', 'call me', '123']) {
      expect(leadSchema.safeParse({ ...VALID, phone }).success, phone).toBe(false);
    }
  });

  it('writes error copy that says what to do, never blaming the visitor', () => {
    // Spec §10.6.7 / Design System §3.4. Checked mechanically because this is
    // exactly the kind of rule that erodes one message at a time.
    const messages = leadSchema
      .safeParse({ ...VALID, name: '', email: 'nope', phone: '', city: '' })
      .error!.issues.map((issue) => issue.message);

    expect(messages.length).toBeGreaterThan(0);
    for (const message of messages) {
      expect(message, message).not.toMatch(/invalid|incorrect|wrong|failed|error/i);
      // No forbidden superlatives anywhere in the product's copy.
      expect(message, message).not.toMatch(/world-class|best-in-class|unbeatable|cheapest/i);
    }
  });
});

describe('POST /api/lead', () => {
  it('rejects a body that is not JSON', async () => {
    const { POST } = await loadRoute();
    const response = await POST(
      new Request('http://localhost/api/lead', { method: 'POST', body: 'not json' }) as never,
    );
    expect(response.status).toBe(400);
  });

  it('rejects an incomplete lead with the field paths, never the values', async () => {
    const { POST } = await loadRoute();
    const response = await POST(post({ ...VALID, email: 'nope', name: '' }) as never);
    expect(response.status).toBe(422);

    const payload = await response.json();
    expect(payload.fields).toContain('email');
    expect(payload.fields).toContain('name');
    // The failure channel must not echo personal data back out.
    expect(JSON.stringify(payload)).not.toContain('visitor@example.com');
    expect(JSON.stringify(payload)).not.toContain('98400');
  });

  it('refuses to accept a lead it cannot deliver', async () => {
    // No LEAD_WEBHOOK_URL. Answering 200 here would show a visitor "we'll call
    // you in 30 minutes" for an enquiry that reached nobody — they wait, and
    // the studio never learns it existed. A visible failure beats a silent
    // drop, because only one of them can be acted on.
    vi.stubEnv('LEAD_WEBHOOK_URL', '');
    const { POST } = await loadRoute();
    const response = await POST(post(VALID) as never);

    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe('not_configured');
  });

  it('forwards a valid lead once a destination is configured', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', 'https://leads.example.com/hook');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await loadRoute();
    const response = await POST(post(VALID) as never);

    expect(response.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledOnce();

    const forwarded = JSON.parse(fetchMock.mock.calls[0]![1].body);
    expect(forwarded.email).toBe(VALID.email);
    expect(forwarded.receivedAt).toBeTruthy();
  });

  it('computes the first-touch deadline server-side, so a forged payload cannot backdate it', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', 'https://leads.example.com/hook');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await loadRoute();
    // A client claiming the lead arrived last year, to dodge the SLA clock.
    const response = await POST(
      post({ ...VALID, receivedAt: '2020-01-01T00:00:00.000Z', firstTouchDueAt: '2020-01-01T00:00:00.000Z' }) as never,
    );
    expect(response.status).toBe(201);

    const forwarded = JSON.parse(fetchMock.mock.calls[0]![1].body);
    const due = new Date(forwarded.firstTouchDueAt).getTime();
    expect(due).toBeGreaterThan(Date.now());
    // Spec §10.7's 30-minute first-touch SLA, with slack for test runtime.
    expect(due - Date.now()).toBeLessThanOrEqual(30 * 60_000 + 5_000);
  });

  it('reports a failure rather than claiming success when the destination is down', async () => {
    vi.stubEnv('LEAD_WEBHOOK_URL', 'https://leads.example.com/hook');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));

    const { POST } = await loadRoute();
    const response = await POST(post(VALID) as never);
    expect(response.status).toBe(502);
  });

  it('answers 405 to a GET, so a stray request does not look like a missing route', async () => {
    const { GET } = await loadRoute();
    expect((await GET()).status).toBe(405);
  });
});

describe('error copy when a value is missing entirely', () => {
  it('never falls back to Zod default text, which breaks the brand voice rule', () => {
    // Regression guard. `.min(1, '...')` only fires for a present-but-empty
    // string; an ABSENT field fails the type check first, where Zod's default
    // is "Invalid input". That is exactly what /book-audit surfaced while
    // components/Field.tsx was dropping react-hook-form's ref — the earlier
    // copy test passed because it always supplied a value.
    const messages = leadSchema.safeParse({}).error!.issues.map((issue) => issue.message);
    expect(messages.length).toBeGreaterThan(0);
    for (const message of messages) {
      expect(message, message).not.toMatch(/invalid|required|expected|received/i);
    }
  });
});
