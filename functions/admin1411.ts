interface Env {
  CONTACT_DB: D1Database;
}

interface ContactRequestRow {
  id: number;
  created_at: number;
  name: string;
  email: string;
  phone: string;
  contact_type: string;
  message: string;
  status: string;
}

const TYPE_LABELS: Record<string, string> = {
  correction: 'Correction',
  addition: 'Addition / new tool',
  idea: 'Idea',
  solicitation: 'Solicitation / sales pitch',
  bug: 'Bug',
  complaint: 'Complaint',
  advertising: 'Advertising / partnership',
  'review-source': 'Review or source note',
  'legal-privacy': 'Legal / privacy',
  other: 'Other',
};

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function dateLabel(epochMs: number): string {
  if (!Number.isFinite(epochMs)) return '';
  return new Date(epochMs).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

function noStoreHeaders(contentType: string): HeadersInit {
  return {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
  };
}

function html(rows: ContactRequestRow[]): string {
  const cards = rows.length
    ? rows.map((row) => {
      const type = TYPE_LABELS[row.contact_type] ?? row.contact_type;
      return `
        <article class="card">
          <div class="top">
            <div>
              <div class="type">${escapeHtml(type)}</div>
              <h2>${escapeHtml(row.name)}</h2>
            </div>
            <div class="meta">
              <div>${escapeHtml(dateLabel(row.created_at))}</div>
              <div class="mono">#${escapeHtml(row.id)} · ${escapeHtml(row.status || 'new')}</div>
            </div>
          </div>
          <div class="contact">
            <div><strong>Email:</strong> ${escapeHtml(row.email)}</div>
            <div><strong>Phone:</strong> ${escapeHtml(row.phone)}</div>
          </div>
          <pre>${escapeHtml(row.message)}</pre>
        </article>
      `;
    }).join('')
    : '<p class="empty">No contact requests yet.</p>';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Admin 1411 - Contact Requests</title>
    <style>
      :root { color-scheme: light; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      body { margin: 0; background: #f8fafc; color: #0f172a; }
      main { width: min(1080px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 48px; }
      header { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
      h1 { margin: 0; font-size: clamp(28px, 5vw, 42px); letter-spacing: 0; }
      h2 { margin: 4px 0 0; font-size: 18px; letter-spacing: 0; }
      .kicker { color: #1d4ed8; font-size: 12px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
      .summary { color: #475569; margin: 0; }
      .toolbar { display: flex; gap: 10px; align-items: center; justify-content: space-between; margin: 18px 0; }
      .button { border: 0; border-radius: 8px; background: #2563eb; color: white; padding: 10px 14px; font-weight: 700; text-decoration: none; }
      .count { color: #64748b; font-size: 14px; }
      .grid { display: grid; gap: 14px; }
      .card, .empty { border: 1px solid #e2e8f0; border-radius: 8px; background: white; padding: 16px; box-shadow: 0 1px 2px rgb(15 23 42 / .04); }
      .top { display: flex; flex-direction: column; gap: 10px; }
      .type { color: #1d4ed8; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
      .meta { color: #64748b; font-size: 13px; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; margin-top: 4px; }
      .contact { display: grid; gap: 6px; margin-top: 12px; color: #334155; font-size: 14px; }
      pre { white-space: pre-wrap; overflow-wrap: anywhere; margin: 14px 0 0; padding: 12px; border-radius: 6px; background: #f1f5f9; color: #1e293b; font-family: inherit; font-size: 14px; line-height: 1.5; }
      @media (min-width: 720px) {
        header, .top, .toolbar { flex-direction: row; align-items: start; justify-content: space-between; }
        .contact { grid-template-columns: 1fr 1fr; }
        .meta { text-align: right; }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <div class="kicker">Private admin</div>
          <h1>Contact Requests</h1>
          <p class="summary">URL-gated request list. No login form is displayed.</p>
        </div>
      </header>
      <div class="toolbar">
        <div class="count">${rows.length} latest request${rows.length === 1 ? '' : 's'}</div>
        <a class="button" href="/admin1411/">Refresh</a>
      </div>
      <section class="grid">${cards}</section>
    </main>
  </body>
</html>`;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.CONTACT_DB) {
    return new Response('CONTACT_DB binding is not configured.', {
      status: 503,
      headers: noStoreHeaders('text/plain; charset=utf-8'),
    });
  }

  const url = new URL(request.url);
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') ?? '100') || 100));
  const result = await env.CONTACT_DB
    .prepare(
      `SELECT id, created_at, name, email, phone, contact_type, message, status
       FROM contact_requests
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .bind(limit)
    .all<ContactRequestRow>();

  const rows = result.results ?? [];
  if (url.searchParams.get('format') === 'json') {
    return Response.json(
      { ok: true, requests: rows },
      { headers: noStoreHeaders('application/json; charset=utf-8') },
    );
  }

  return new Response(html(rows), { headers: noStoreHeaders('text/html; charset=utf-8') });
};
