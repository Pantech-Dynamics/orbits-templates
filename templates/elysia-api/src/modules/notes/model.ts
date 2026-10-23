import { t, type UnwrapSchema } from "elysia";

// One schema per shape: Elysia validates requests and responses against them, types the handlers from
// them, and writes the OpenAPI document from them.
export const NoteModel = {
  note: t.Object({
    id: t.Number(),
    title: t.String(),
    body: t.String(),
    created_at: t.String({ format: "date-time" }),
    updated_at: t.String({ format: "date-time" }),
  }),
  create: t.Object({
    title: t.String({ minLength: 1, maxLength: 200, error: "title must be 1 to 200 characters" }),
    body: t.String({ maxLength: 10_000, default: "" }),
  }),
  update: t.Partial(
    t.Object({
      title: t.String({ minLength: 1, maxLength: 200, error: "title must be 1 to 200 characters" }),
      body: t.String({ maxLength: 10_000 }),
    }),
  ),
  params: t.Object({ id: t.Number({ minimum: 1 }) }),
  query: t.Object({ limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })) }),
  list: t.Object({ items: t.Array(t.Unknown()) }),
  notFound: t.Object({ error: t.Literal("Note not found") }),
} as const;

export type NoteModel = { [K in keyof typeof NoteModel]: UnwrapSchema<(typeof NoteModel)[K]> };
