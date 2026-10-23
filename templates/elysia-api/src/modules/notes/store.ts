import { SQL } from "bun";
import type { NoteModel } from "./model";

type Note = NoteModel["note"];

/** Where notes live. Postgres when DATABASE_URL is set; memory otherwise, and in tests. */
export interface NoteStore {
  list(limit: number): Promise<Note[]>;
  get(id: number): Promise<Note | null>;
  create(input: NoteModel["create"]): Promise<Note>;
  update(id: number, patch: NoteModel["update"]): Promise<Note | null>;
  remove(id: number): Promise<boolean>;
}

export function memoryStore(): NoteStore {
  const notes = new Map<number, Note>();
  let next = 1;
  return {
    async list(limit) {
      return [...notes.values()].sort((a, b) => b.id - a.id).slice(0, limit);
    },
    async get(id) {
      return notes.get(id) ?? null;
    },
    async create({ title, body }) {
      const now = new Date().toISOString();
      const note = { id: next++, title, body: body ?? "", created_at: now, updated_at: now };
      notes.set(note.id, note);
      return note;
    },
    async update(id, patch) {
      const note = notes.get(id);
      if (!note) return null;
      const updated = { ...note, ...patch, updated_at: new Date().toISOString() };
      notes.set(id, updated);
      return updated;
    },
    async remove(id) {
      return notes.delete(id);
    },
  };
}

const iso = (row: Record<string, unknown>) =>
  ({ ...row, created_at: (row.created_at as Date).toISOString(), updated_at: (row.updated_at as Date).toISOString() }) as Note;

/** Bun's built-in Postgres client: no driver to install. Creates its table on first use. */
export async function postgresStore(url: string): Promise<NoteStore & { close(): Promise<void> }> {
  const db = new SQL(url);
  await db`
    create table if not exists notes (
      id integer generated always as identity primary key,
      title text not null,
      body text not null default '',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )`;
  const store: NoteStore & { close(): Promise<void> } = {
    async list(limit) {
      return (await db`select * from notes order by id desc limit ${limit}`).map(iso);
    },
    async get(id) {
      const [row] = await db`select * from notes where id = ${id}`;
      return row ? iso(row) : null;
    },
    async create({ title, body }) {
      const [row] = await db`insert into notes (title, body) values (${title}, ${body ?? ""}) returning *`;
      return iso(row);
    },
    async update(id, patch) {
      if (!Object.keys(patch).length) return store.get(id);
      const [row] = await db`update notes set ${db(patch)}, updated_at = now() where id = ${id} returning *`;
      return row ? iso(row) : null;
    },
    async remove(id) {
      return (await db`delete from notes where id = ${id}`).count > 0;
    },
    close: () => db.close(),
  };
  return store;
}
