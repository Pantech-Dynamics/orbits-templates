import { Elysia } from "elysia";
import { NoteModel } from "./model";
import type { NoteStore } from "./store";

/** The notes controller. The store comes in from outside, so tests can hand it one of their own. */
export const notes = (store: NoteStore) =>
  new Elysia({ prefix: "/notes", tags: ["Notes"] })
    .get("/", ({ query }) => store.list(query.limit ?? 20).then((items) => ({ items })), {
      query: NoteModel.query,
      detail: { summary: "List notes, newest first" },
    })
    .post("/", ({ body, status }) => store.create(body).then((note) => status(201, note)), {
      body: NoteModel.create,
      response: { 201: NoteModel.note },
      detail: { summary: "Create a note" },
    })
    .get(
      "/:id",
      async ({ params, status }) => (await store.get(params.id)) ?? status(404, { error: "Note not found" as const }),
      {
        params: NoteModel.params,
        response: { 200: NoteModel.note, 404: NoteModel.notFound },
        detail: { summary: "Get a note" },
      },
    )
    .patch(
      "/:id",
      async ({ params, body, status }) => (await store.update(params.id, body)) ?? status(404, { error: "Note not found" as const }),
      {
        params: NoteModel.params,
        body: NoteModel.update,
        response: { 200: NoteModel.note, 404: NoteModel.notFound },
        detail: { summary: "Change a note's title or body" },
      },
    )
    .delete(
      "/:id",
      async ({ params, status }) => ((await store.remove(params.id)) ? status(204) : status(404, { error: "Note not found" as const })),
      {
        params: NoteModel.params,
        detail: { summary: "Delete a note" },
      },
    );
