import "server-only";

// Paystack's API, called from the server with the secret key. The key never reaches the browser.
const API = process.env.PAYSTACK_API_URL ?? "https://api.paystack.co";

async function paystack<T>(path: string, init?: { method: "POST"; body: unknown }): Promise<T> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY isn't set.");
  const res = await fetch(API + path, {
    method: init?.method ?? "GET",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: init ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json().catch(() => null)) as { status: boolean; message: string; data: T } | null;
  if (!res.ok || !json?.status) throw new Error(`Paystack: ${json?.message ?? res.status}`);
  return json.data;
}

/** Starts a payment; the buyer pays on Paystack's page at `authorization_url`, then comes back to `callback_url`. */
export const initialize = (body: { email: string; amount: number; callback_url: string; metadata: unknown }) =>
  paystack<{ authorization_url: string; reference: string }>("/transaction/initialize", { method: "POST", body: { ...body, currency: "NGN" } });

/** What actually happened to a payment. Trust this, never the redirect alone. */
export const verify = (reference: string) =>
  paystack<{ status: string; amount: number; currency: string; reference: string; customer: { email: string }; metadata: { lines?: { slug: string; quantity: number }[] } | null }>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
