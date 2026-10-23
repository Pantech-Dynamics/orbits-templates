import pg from "pg";

// Without DATABASE_URL the API still starts, so the health check passes; /items answers 503 until it's set.
export const db = process.env.DATABASE_URL ? new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 10_000 }) : null;

if (!db) console.warn("DATABASE_URL isn't set: /items will answer 503 until it is.");

/** Creates the items table on first start. Add a migration tool once the schema grows. */
export async function migrate() {
  if (!db) return;
  await db.query(`
    create table if not exists items (
      id integer generated always as identity primary key,
      name text not null check (length(name) between 1 and 200),
      done boolean not null default false,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
}
