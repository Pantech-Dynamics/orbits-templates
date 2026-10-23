// Sends a signed test event: npm run send -- https://your-app.orbit.space
import { sign } from "../src/signature.js";

const target = new URL("/webhooks", process.argv[2] ?? "http://localhost:3000");
const secret = process.env.WEBHOOK_SECRET;
if (!secret) throw new Error("Set WEBHOOK_SECRET, in .env or the environment.");

const body = JSON.stringify({ type: "test.ping", sent_at: new Date().toISOString() });
const res = await fetch(target, {
  method: "POST",
  headers: { "content-type": "application/json", "x-signature-256": sign(body, secret), "x-delivery-id": crypto.randomUUID() },
  body,
});
console.log(res.status, await res.text());
