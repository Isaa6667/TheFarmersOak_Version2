// Cloudflare Pages Function: POST /api/contact -> emails TheFarmersOak@outlook.com via Resend.
// Needs a secret named RESEND_API_KEY (Cloudflare Pages > Settings > Variables and Secrets).
const reply = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const clean = (v, max) => String(v || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  if (origin && !/(^|\.)thefarmersoak\.co\.uk$|\.pages\.dev$/.test(new URL(origin).hostname)) {
    return reply({ ok: false }, 403);
  }
  let d;
  try { d = await request.json(); } catch { return reply({ ok: false }, 400); }
  if (d.website) return reply({ ok: true });              // honeypot: bots fill this in
  const name = clean(d.name, 100), email = clean(d.email, 200);
  const phone = clean(d.phone, 40), topic = clean(d.topic, 60);
  const message = String(d.message || "").trim().slice(0, 3000);
  if (!name || message.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return reply({ ok: false, error: "invalid" }, 400);
  }
  if (!env.RESEND_API_KEY) return reply({ ok: false, error: "not configured" }, 500);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM || "The Farmers Oak Website <website@thefarmersoak.co.uk>",
      to: [env.CONTACT_TO || "TheFarmersOak@outlook.com"],
      reply_to: email,
      subject: `Website enquiry: ${topic || "General"} (${name})`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nTopic: ${topic || "-"}\n\n${message}`,
    }),
  });
  return res.ok ? reply({ ok: true }) : reply({ ok: false }, 502);
}
