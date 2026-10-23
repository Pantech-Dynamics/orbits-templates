# API

A REST API on Node.js with a health check and one resource, `items`, stored in Postgres. No framework:
`node:http`, a twenty-line router and [`pg`](https://node-postgres.com).

## Endpoints

| Method | Path | |
| --- | --- | --- |
| GET | `/` | What the API serves |
| GET | `/health` | `ok`, and whether the database answers |
| GET | `/items?limit=50` | Newest first, up to 100 |
| POST | `/items` | `{ "name": "…", "done": false }` |
| GET | `/items/:id` | |
| PATCH | `/items/:id` | Any of `name`, `done` |
| DELETE | `/items/:id` | |

Errors are JSON: `{ "error": "…" }` with a 4xx or 5xx status.

## Environment

| Variable | |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Without it the API starts, and `/items` answers 503. |
| `PORT` | Defaults to 3000, which Orbit expects. |

The `items` table is created on first start. Once the schema grows, move to a migration tool such as
`node-pg-migrate`.

## Run it locally

```sh
cp .env.example .env   # then point DATABASE_URL at your database
npm install
npm run dev
```

## Adding a resource

Copy `src/items.js`, change the queries, and add its routes to the list in `src/server.js`.
