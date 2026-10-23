import { Elysia, t } from "elysia";

export const health = (database: "postgres" | "memory") =>
  new Elysia({ tags: ["Health"] })
    .get("/", () => ({ name: "elysia-api", docs: "/openapi" }), {
      detail: { summary: "What this API is" },
    })
    .get("/health", () => ({ status: "ok" as const, database, uptime: Math.round(process.uptime()) }), {
      response: t.Object({ status: t.Literal("ok"), database: t.String(), uptime: t.Number() }),
      detail: { summary: "Health check" },
    });
