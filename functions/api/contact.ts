interface Env {
  CONTACT_DB: D1Database;
}

const CONTACT_TYPES = new Set([
  'correction',
  'addition',
  'idea',
  'solicitation',
  'bug',
  'complaint',
  'advertising',
  'review-source',
  'legal-privacy',
  'other',
]);

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  contact_type?: unknown;
  message?: unknown;
  company_website?: unknown;
}

function json(body: unknown, init: ResponseInit = {}): Response {
  return Response.json(body, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init.headers ?? {}),
    },
  });
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.CONTACT_DB) {
    return json({ error: 'contact_database_not_configured' }, { status: 503 });
  }

  const payload = (await request.json().catch(() => null)) as ContactPayload | null;
  if (!payload) return json({ error: 'invalid_json' }, { status: 400 });

  // Honeypot: real users never see this field.
  if (str(payload.company_website)) return json({ ok: true });

  const name = str(payload.name);
  const email = str(payload.email).toLowerCase();
  const phone = str(payload.phone);
  const contactType = str(payload.contact_type);
  const message = str(payload.message);

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 120) errors.name = 'Enter a name between 2 and 120 characters.';
  if (!isEmail(email) || email.length > 254) errors.email = 'Enter a valid email address.';
  if (phone.length < 7 || phone.length > 40) errors.phone = 'Enter a phone number between 7 and 40 characters.';
  if (!CONTACT_TYPES.has(contactType)) errors.contact_type = 'Choose a valid contact type.';
  if (message.length < 10 || message.length > 6000) errors.message = 'Enter a message between 10 and 6000 characters.';

  if (Object.keys(errors).length > 0) {
    return json({ error: 'validation_failed', fields: errors }, { status: 400 });
  }

  try {
    await env.CONTACT_DB
      .prepare(
        `INSERT INTO contact_requests
          (created_at, name, email, phone, contact_type, message, status)
         VALUES (?, ?, ?, ?, ?, ?, 'new')`
      )
      .bind(Date.now(), name, email, phone, contactType, message)
      .run();
  } catch {
    return json({ error: 'database_write_failed' }, { status: 500 });
  }

  return json({ ok: true }, { status: 201 });
};

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
