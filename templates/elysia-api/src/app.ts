import { Elysia } from "elysia";
import { cors } from "@elysia/cors";
import { openapi } from "@elysia/openapi";
import { health } from "./modules/health";
import { notes } from "./modules/notes";
import type { NoteStore } from "./modules/notes/store";

/** The whole API, built from its parts. index.ts serves it; the tests call it directly. */
export const createApp = ({ store, database }: { store: NoteStore; database: "postgres" | "memory" }) =>
  new Elysia()
    .use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }))
    .use(
      openapi({
        documentation: { info: { title: "Elysia API", version: "1.0.0", description: "Notes, with validation and types end to end." } },
      }),
    )
    .onError(({ code, error, status }) => {
      if (code === "NOT_FOUND") return status(404, { error: "Not found" });
      // Every field that failed, with the schema's own message where it has one.
      if (code === "VALIDATION")
        return status(422, {
          error: "Validation failed",
          fields: error.all.map((e) => ({
            field: "path" in e ? e.path.slice(1).replaceAll("/", ".") : "",
            message: ("schema" in e && typeof e.schema.error === "string" && e.schema.error) || e.summary,
          })),
        });
    })
    .use(health(database))
    .use(notes(store));

/** For Eden Treaty on the client: `treaty<App>("https://your-api.orbit.space")`. */
export type App = ReturnType<typeof createApp>;
