import { RSVP_WEBHOOK_URL } from "$app/env/private";

export type Rsvp = { name: string; email: string; at: string };

// In memory: they reset on every deploy. Set RSVP_WEBHOOK_URL to also send each one somewhere that keeps
// it (a Slack channel, a Zapier zap that adds a sheet row, your own API).
const rsvps = new Map<string, Rsvp>();
export const CAPACITY = 200;

export function count() {
  return rsvps.size;
}

export async function add(name: string, email: string): Promise<"added" | "already" | "full"> {
  const key = email.toLowerCase();
  if (rsvps.has(key)) return "already";
  if (rsvps.size >= CAPACITY) return "full";
  const rsvp = { name, email: key, at: new Date().toISOString() };
  rsvps.set(key, rsvp);
  if (RSVP_WEBHOOK_URL) {
    await fetch(RSVP_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: `New RSVP: ${name} <${key}>`, ...rsvp }),
      signal: AbortSignal.timeout(5000),
    }).catch((error) => console.error("Couldn't reach RSVP_WEBHOOK_URL:", error.message));
  }
  return "added";
}
