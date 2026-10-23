import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { timingSafeEqual } from "node:crypto";

const PORT = Number(process.env.PORT ?? 3000);
const WEBHOOK = process.env.WAITLIST_WEBHOOK_URL;
const ADMIN_TOKEN = process.env.WAITLIST_ADMIN_TOKEN;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const page = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const styles = await readFile(new URL("../public/styles.css", import.meta.url));

// In memory: gone after a redeploy. WAITLIST_WEBHOOK_URL sends each sign-up somewhere that keeps it.
const signups = new Map();

async function readForm(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 10_000) return null;
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if ((req.headers["content-type"] ?? "").includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
  return Object.fromEntries(new URLSearchParams(text));
}

async function forward(signup) {
  if (!WEBHOOK) return;
  try {
    // Slack's incoming webhooks read `text`; most other tools take the fields as they are.
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: `New sign-up: ${signup.email}`, ...signup }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`The webhook answered ${res.status}`);
  } catch (error) {
    console.error("Couldn't reach the webhook:", error.message);
  }
}

async function join(req, res) {
  const wantsJson = (req.headers.accept ?? "").includes("application/json");
  const form = await readForm(req);
  const email = typeof form?.email === "string" ? form.email.trim().toLowerCase() : "";
  // A field people can't see: bots fill it in.
  if (form?.website) return reply(res, wantsJson, 200, "You're on the list.");
  if (!EMAIL.test(email) || email.length > 254) return reply(res, wantsJson, 422, "That doesn't look like an email address.");

  if (!signups.has(email)) {
    const signup = { email, joined_at: new Date().toISOString() };
    signups.set(email, signup);
    console.log(`Sign-up #${signups.size}`);
    await forward(signup);
  }
  reply(res, wantsJson, 200, "You're on the list. We'll email you when it's ready.");
}

function reply(res, json, status, message) {
  if (json) {
    const body = JSON.stringify({ ok: status < 400, message });
    res.writeHead(status, { "content-type": "application/json; charset=utf-8" }).end(body);
    return;
  }
  // Without JavaScript the form posts here; send the visitor back with the outcome.
  res.writeHead(303, { location: `/?${status < 400 ? "joined" : "error"}=1` }).end();
}

function authorized(req) {
  const token = /^Bearer (.+)$/.exec(req.headers.authorization ?? "")?.[1] ?? "";
  if (!ADMIN_TOKEN || !token) return false;
  const [a, b] = [Buffer.from(token), Buffer.from(ADMIN_TOKEN)];
  return a.length === b.length && timingSafeEqual(a, b);
}

function exportCsv(res) {
  const rows = ["email,joined_at", ...[...signups.values()].map((s) => `${s.email},${s.joined_at}`)];
  res.writeHead(200, { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="waitlist.csv"' });
  res.end(rows.join("\n") + "\n");
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  try {
    if (pathname === "/" && req.method === "GET") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page.replace("{{count}}", String(signups.size)));
    } else if (pathname === "/styles.css") {
      res.writeHead(200, { "content-type": "text/css; charset=utf-8", "cache-control": "public, max-age=3600" }).end(styles);
    } else if (pathname === "/join" && req.method === "POST") {
      await join(req, res);
    } else if (pathname === "/export.csv" && req.method === "GET") {
      if (!authorized(req)) res.writeHead(401, { "content-type": "text/plain" }).end("Send WAITLIST_ADMIN_TOKEN as a bearer token.\n");
      else exportCsv(res);
    } else {
      res.writeHead(404, { "content-type": "text/plain" }).end("Not found.\n");
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500, { "content-type": "text/plain" }).end("Something went wrong.\n");
  }
});

server.listen(PORT, () => console.log(`Listening on :${PORT}`));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
