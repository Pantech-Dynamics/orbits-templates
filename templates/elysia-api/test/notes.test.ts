import { describe, expect, it } from "bun:test";
import { treaty } from "@elysia/eden";
import { createApp } from "../src/app";
import { memoryStore } from "../src/modules/notes/store";

// Eden calls the app in-process, typed from its routes: no server, no port.
const api = () => treaty(createApp({ store: memoryStore(), database: "memory" }));

describe("notes", () => {
  it("creates, reads, updates and deletes a note", async () => {
    const client = api();

    const created = await client.notes.post({ title: "First", body: "Hello" });
    expect(created.status).toBe(201);
    const id = created.data!.id;

    const read = await client.notes({ id }).get();
    expect(read.data?.title).toBe("First");

    const updated = await client.notes({ id }).patch({ title: "Renamed" });
    expect(updated.data?.title).toBe("Renamed");
    expect(updated.data?.body).toBe("Hello");

    const list = await client.notes.get({ query: { limit: 10 } });
    expect(list.data?.items).toHaveLength(1);

    expect((await client.notes({ id }).delete()).status).toBe(204);
    expect((await client.notes({ id }).get()).status).toBe(404);
  });

  it("refuses a note without a title", async () => {
    const { status, error } = await api().notes.post({ title: "", body: "" });
    expect(status).toBe(422);
    expect(error?.value).toMatchObject({ fields: [{ field: "title", message: "title must be 1 to 200 characters" }] });
  });
});

describe("health", () => {
  it("answers on / and /health", async () => {
    const app = createApp({ store: memoryStore(), database: "memory" });
    expect((await app.handle(new Request("http://localhost/"))).status).toBe(200);
    const health = await app.handle(new Request("http://localhost/health")).then((r) => r.json());
    expect(health).toMatchObject({ status: "ok", database: "memory" });
  });

  it("serves the OpenAPI document", async () => {
    const app = createApp({ store: memoryStore(), database: "memory" });
    const spec = await app.handle(new Request("http://localhost/openapi/json")).then((r) => r.json());
    expect(Object.keys(spec.paths)).toContain("/notes/{id}");
  });
});
