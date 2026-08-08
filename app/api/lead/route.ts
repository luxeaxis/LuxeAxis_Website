import { NextResponse, type NextRequest } from 'next/server';
import { FIRST_TOUCH_SLA_MINUTES, leadRequestSchema } from '@/lib/lead/schema';

/**
 * `POST /api/lead` — the Book-Audit lead endpoint (Build Backlog T-19).
 *
 * ## It forwards nowhere until you configure a destination
 *
 * `LEAD_WEBHOOK_URL` is unset, and this route answers 503 rather than 200 when
 * it is. That is a deliberate choice between two bad options, and the reasoning
 * matters more than the code:
 *
 * - Accepting the submission and returning success would show a visitor
 *   "we'll call you within 30 minutes" for a lead that reached nobody. They
 *   would wait. The studio would never know the enquiry existed. A silently
 *   dropped lead is worse than a visible failure, because nobody can act on it.
 * - Answering 503 means the visitor sees an honest error and can try another
 *   route — which is why the form surfaces a real alternative rather than
 *   telling them to try again later.
 *
 * So this endpoint is inert-by-default on purpose. Set `LEAD_WEBHOOK_URL` (the
 * Space OS lead queue, or any HTTPS endpoint that accepts JSON) and it starts
 * working with no code change.
 *
 * ## What it never does
 *
 * No logging of the payload. The body carries a name, an email, a phone number
 * and free text about someone's home — writing that to stdout scatters personal
 * data into every log sink the platform has, which is exactly what DPDPA data
 * minimisation is about. Failures log the FAILURE, never the lead.
 */

export const runtime = 'nodejs';
/** Never prerendered, never cached — it is a mutation. */
export const dynamic = 'force-dynamic';

const WEBHOOK_URL = process.env.LEAD_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  // Re-validated server-side rather than trusted. The form validates with this
  // same schema, but anything can POST here.
  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_lead',
        // Field paths only — never the submitted values, which would echo
        // personal data straight back out of the error channel.
        fields: parsed.error.issues.map((issue) => issue.path.join('.')),
      },
      { status: 422 },
    );
  }

  // Consent is re-checked explicitly even though the schema requires `true`.
  // It is the one field where a future schema loosening would be a compliance
  // failure rather than a bug, so it gets its own guard.
  if (parsed.data.consent !== true) {
    return NextResponse.json(
      { ok: false, error: 'consent_required' },
      { status: 422 },
    );
  }

  const receivedAt = new Date();
  const lead = {
    ...parsed.data,
    receivedAt: receivedAt.toISOString(),
    // Computed here, not accepted from the client, so a forged payload cannot
    // backdate a lead out of its first-touch window (Spec §10.7).
    firstTouchDueAt: new Date(
      receivedAt.getTime() + FIRST_TOUCH_SLA_MINUTES * 60_000,
    ).toISOString(),
  };

  if (!WEBHOOK_URL) {
    // Not an error in the code — a deployment that has not been finished. Said
    // plainly so it is obvious in staging rather than looking like a bug.
    console.warn(
      '[lead] LEAD_WEBHOOK_URL is not set; refusing to accept a lead that would be lost.',
    );
    return NextResponse.json(
      { ok: false, error: 'not_configured' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
      // A visitor is watching a spinner. Better to fail in 10 seconds and let
      // them use the fallback than to hang until the platform kills the
      // function.
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`[lead] destination responded ${response.status}`);
      return NextResponse.json(
        { ok: false, error: 'destination_failed' },
        { status: 502 },
      );
    }
  } catch (cause) {
    // The message only — never the lead body.
    console.error(
      '[lead] could not reach destination:',
      cause instanceof Error ? cause.message : 'unknown',
    );
    return NextResponse.json(
      { ok: false, error: 'destination_unreachable' },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { ok: true, firstTouchDueAt: lead.firstTouchDueAt },
    { status: 201 },
  );
}

/** Anything other than POST. Explicit so a stray GET gets a clear 405 rather
 *  than Next's generic 404, which would look like the endpoint is missing. */
export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'method_not_allowed' },
    { status: 405 },
  );
}
