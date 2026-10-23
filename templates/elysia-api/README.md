# Elysia API

A REST API on [Elysia](https://elysiajs.com) and Bun, laid out the way Elysia's docs recommend. One schema
per shape does three jobs: it validates each request, types the handlers, and writes the OpenAPI document.

- Interactive docs at `/openapi`, the spec at `/openapi/json`.
- Validation errors as JSON, naming every field that failed.
- Postgres through Bun's built-in client, so there's no driver to install. Without `DATABASE_URL`, notes are
  kept in memory so the first deploy works with nothing to set up.
- Tests with `bun test` and [Eden](https://elysiajs.com/eden/overview), calling the app in-process.

## Endpoints

| Method | Path | |
| --- | --- | --- |
| GET | `/health` | Health check, and which store is in use |
| GET | `/notes?limit=20` | Newest first |
| POST | `/notes` | `{ "title": "…", "body": "…" }` |
| GET | `/notes/:id` | |
| PATCH | `/notes/:id` | Any of `title`, `body` |
| DELETE | `/notes/:id` | |

## Run it locally

```sh
bun install
bun dev          # http://localhost:3000/openapi
bun test
```

## Layout

```
src/
  index.ts              starts the server and stops it cleanly on redeploy
  app.ts                the API, built from its modules; exports `App` for Eden
  modules/
    health/index.ts     / and /health
    notes/
      index.ts          the controller: routes and their schemas
      model.ts          the schemas
      store.ts          Postgres and in-memory storage behind one interface
test/notes.test.ts
```

Add a feature by adding a folder under `src/modules` and `.use()`-ing it in `app.ts`.

## Typed client

Any TypeScript front end can call this API with full types, without generating anything:

```ts
import { treaty } from "@elysia/eden";
import type { App } from "../api/src/app";

const api = treaty<App>("https://your-api.orbit.space");
const { data } = await api.notes.post({ title: "Hello" });
```

## How Orbit runs it

`bun run build` bundles `src/index.ts` into `dist/index.js`, and `bun dist/index.js` serves it on port 3000.
Orbit health-checks `/health`.
