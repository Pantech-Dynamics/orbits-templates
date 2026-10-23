import { createServer } from "node:http";
import { verify } from "./signature.js";
import { events } from "./store.js";

const PORT = Number(process.env.PORT ?? 3000);
const SECRET = process.env.WEBHOOK_SECRET ?? "";
const MAX_BODY = 5_000_000;

if (!SECRET) console.warn("WEBHOOK_SECRET isn't set: every event will be refused until it is.");

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "content-length": Buffer.byteLength(json) });
  res.end(json);
}

async function rawBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) return null;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/** Reading events back needs the same secret, as a bearer token. */
function authorized(req) {
  const token = /^Bearer (.+)$/.exec(req.headers.authorization ?? "")?.[1];
  return Boolean(SECRET && token && verify.equal(token, SECRET));
}

async function receive(req, res) {
  if (!SECRET) return send(res, 503, { error: "WEBHOOK_SECRET isn't set." });
  const body = await rawBody(req);
  if (!body) return send(res, 413, { error: "The body is larger than 5 MB." });

  // GitHub's header, and a generic one for any other sender: both "sha256=<hex HMAC of the raw body>".
  const signature = req.headers["x-hub-signature-256"] ?? req.headers["x-signature-256"];
  if (!verify(body, signature, SECRET)) return send(res, 401, { error: "The signature doesn't match." });

  let payload;
  try {
    payload = JSON.parse(body.toString("utf8"));
  } catch {
    payload = body.toString("utf8");
  }
  const delivery = req.headers["x-github-delivery"] ?? req.headers["x-delivery-id"] ?? null;
  const type = req.headers["x-github-event"] ?? req.headers["x-event-type"] ?? payload?.type ?? "event";
  const { event, duplicate } = events.add({ delivery, type, payload });

  // Answer fast: senders retry slow responses. Long work belongs in a queue or a background job.
  if (!duplicate) await handle(event);
  send(res, duplicate ? 200 : 202, { id: event.id, duplicate });
}

/** Where your logic goes: react to each verified event. */
async function handle(event) {
  console.log(`Received ${event.type} (${event.id})`);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  try {
    if (url.pathname === "/" && req.method === "GET") {
      return send(res, 200, { name: "webhook-receiver", receive: "POST /webhooks", read: "GET /events", stored: events.size });
    }
    if (url.pathname === "/webhooks") {
      if (req.method !== "POST") return send(res, 405, { error: "Send events with POST." });
      return await receive(req, res);
    }
    if (url.pathname === "/events" && req.method === "GET") {
      if (!authorized(req)) return send(res, 401, { error: "Send the secret as a bearer token." });
      return send(res, 200, { items: events.list(Number(url.searchParams.get("limit")) || 20) });
    }
    send(res, 404, { error: "Not found." });
  } catch (error) {
    console.error(error);
    send(res, 500, { error: "Something went wrong." });
  }
});

server.listen(PORT, () => console.log(`Listening on :${PORT}`));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
