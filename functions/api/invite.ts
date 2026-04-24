import { Resend } from 'resend';

interface Env {
  RESEND_API_KEY: string;
}

interface InvitePayload {
  to: string;
  inviteUrl: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: InvitePayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { to, inviteUrl } = payload;
  if (!to || !inviteUrl) {
    return Response.json({ error: 'Missing "to" or "inviteUrl"' }, { status: 400 });
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: 'Kefiw <invites@kefiw.com>',
    to,
    subject: "You're invited to Kefiw",
    html: `<p>Click <a href="${inviteUrl}">here</a> to join.</p>`,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ id: data?.id });
};
