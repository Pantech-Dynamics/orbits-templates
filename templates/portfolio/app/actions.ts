"use server";

export type ContactState = { ok: boolean; message: string; fields?: { name?: string; email?: string; message?: string } } | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sends a message to CONTACT_WEBHOOK_URL (Slack, Zapier, your inbox's API), or logs it when that isn't set. */
export async function sendMessage(_: ContactState, form: FormData): Promise<ContactState> {
  const fields = {
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    message: String(form.get("message") ?? "").trim(),
  };
  // A field people can't see: bots fill it in. Tell them it worked.
  if (form.get("company")) return { ok: true, message: "Thanks, I'll reply soon." };
  if (!fields.name) return { ok: false, message: "Tell me your name.", fields };
  if (!EMAIL.test(fields.email)) return { ok: false, message: "That email address doesn't look right.", fields };
  if (fields.message.length < 10) return { ok: false, message: "Say a little more about what you need.", fields };
  if (fields.message.length > 5000) return { ok: false, message: "That's a long message; keep it under 5,000 characters.", fields };

  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) {
    console.log(`New message from ${fields.name} <${fields.email}>:\n${fields.message}`);
    return { ok: true, message: "Thanks, I'll reply soon." };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: `New message from ${fields.name} <${fields.email}>:\n${fields.message}`, ...fields }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`The webhook answered ${res.status}`);
  } catch (error) {
    console.error("Couldn't deliver a contact message:", error);
    return { ok: false, message: "That didn't send. Try again, or email me directly.", fields };
  }
  return { ok: true, message: "Thanks, I'll reply soon." };
}
