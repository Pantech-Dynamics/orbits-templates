import { createServer } from "node:http";
import { db, migrate } from "./db.js";
import { HttpError, Reply } from "./errors.js";
import { route } from "./router.js";
import * as items from "./items.js";

const PORT = Number(process.env.PORT ?? 3000);

const routes = [
  route("GET", "/", () => ({
    name: "api",
    endpoints: ["GET /health", "GET /items", "POST /items", "GET /items/:id", "PATCH /items/:id", "DELETE /items/:id"],
  })),
  route("GET", "/health", async () => {
    if (!db) return { status: "ok", database: "not configured" };
    await db.query("select 1");
    return { status: "ok", database: "connected" };
  }),
  route("GET", "/items", items.list),
  route("POST", "/items", items.create),
  route("GET", "/items/:id", items.get),
  route("PATCH", "/items/:id", items.update),
  route("DELETE", "/items/:id", items.remove),
];

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1_000_000) throw new HttpError(413, "The body is larger than 1 MB.");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "The body isn't valid JSON.");
  }
}

function send(res, status, body) {
  if (body === undefined) {
    res.writeHead(status).end();
    return;
  }
  const json = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "content-length": Buffer.byteLength(json) });
  res.end(json);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const started = performance.now();
  try {
    const match = routes.map((r) => r.match(req.method, url.pathname)).find(Boolean);
    if (!match) {
      const known = routes.some((r) => r.match(undefined, url.pathname));
      throw new HttpError(known ? 405 : 404, known ? "Method not allowed." : "Not found.");
    }
    const body = ["POST", "PATCH", "PUT"].includes(req.method) ? await readJson(req) : undefined;
    const result = await match.handler({ params: match.params, query: url.searchParams, body });
    if (result instanceof Reply) send(res, result.status, result.body);
    else send(res, 200, result);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error(error);
    send(res, status, { error: status === 500 ? "Something went wrong." : error.message });
  } finally {
    console.log(`${req.method} ${url.pathname} ${res.statusCode} ${Math.round(performance.now() - started)}ms`);
  }
});

await migrate();
server.listen(PORT, () => console.log(`Listening on :${PORT}`));

// Finish in-flight requests before a redeploy stops the container.
process.on("SIGTERM", () => {
  server.close(() => db?.end().finally(() => process.exit(0)) ?? process.exit(0));
});
