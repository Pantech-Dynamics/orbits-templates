import { db } from "./db.js";
import { HttpError, reply } from "./errors.js";

const COLUMNS = "id, name, done, created_at, updated_at";

function database() {
  if (!db) throw new HttpError(503, "The database isn't configured. Set DATABASE_URL.");
  return db;
}

function id(params) {
  const n = Number(params.id);
  if (!Number.isSafeInteger(n) || n < 1) throw new HttpError(404, "Not found.");
  return n;
}

function name(value, required) {
  if (value === undefined && !required) return undefined;
  if (typeof value !== "string" || !value.trim()) throw new HttpError(422, "name must be a non-empty string.");
  if (value.trim().length > 200) throw new HttpError(422, "name must be at most 200 characters.");
  return value.trim();
}

function done(value) {
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") throw new HttpError(422, "done must be true or false.");
  return value;
}

export async function list({ query }) {
  const limit = Math.min(Math.max(Number(query.get("limit")) || 50, 1), 100);
  const { rows } = await database().query(`select ${COLUMNS} from items order by id desc limit $1`, [limit]);
  return { items: rows };
}

export async function create({ body }) {
  const { rows } = await database().query(`insert into items (name, done) values ($1, $2) returning ${COLUMNS}`, [
    name(body.name, true),
    done(body.done) ?? false,
  ]);
  return reply(201, rows[0]);
}

export async function get({ params }) {
  const { rows } = await database().query(`select ${COLUMNS} from items where id = $1`, [id(params)]);
  if (!rows[0]) throw new HttpError(404, "Not found.");
  return rows[0];
}

export async function update({ params, body }) {
  const { rows } = await database().query(
    `update items set name = coalesce($2, name), done = coalesce($3, done), updated_at = now()
     where id = $1 returning ${COLUMNS}`,
    [id(params), name(body.name, false) ?? null, done(body.done) ?? null],
  );
  if (!rows[0]) throw new HttpError(404, "Not found.");
  return rows[0];
}

export async function remove({ params }) {
  const { rowCount } = await database().query("delete from items where id = $1", [id(params)]);
  if (!rowCount) throw new HttpError(404, "Not found.");
  return reply(204);
}
