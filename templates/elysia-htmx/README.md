# Elysia + htmx

Server-rendered pages on [Elysia](https://elysiajs.com) and Bun, made interactive with
[htmx](https://htmx.org). Every route answers with HTML: a whole page for a visit, a fragment for an htmx
request. There's no client-side framework; the browser loads htmx, about 16 KB gzipped, and nothing else.

The example is a task list: add, tick, delete and search, each a small request that swaps one piece of the
page.

## How it fits together

- Components are JSX, rendered to strings by [`@elysia/html`](https://elysiajs.com/plugins/html). Text from
  users goes through the `safe` attribute, so it's escaped; `bun run typecheck` runs Kita's XSS scan to catch
  any that isn't.
- `POST /tasks` answers with the new row, and the task count rides along with `hx-swap-oob`.
- A form that fails validation answers 422 with itself and the error, and `HX-Retarget` puts it back in place.
- `public/` is served at `/public`; htmx comes from `node_modules`, so updating it is a version bump.

## Run it locally

```sh
bun install
bun dev        # http://localhost:3000
bun test
```

## Layout

```
src/
  index.ts              starts the server
  app.tsx               the routes
  tasks.ts              the tasks, in memory
  components/
    layout.tsx          the HTML around every page
    tasks.tsx           the list, a row, the form, the count
public/styles.css
test/app.test.ts
```

Tasks are kept in memory and reset on every deploy. The Elysia API template shows the same store backed by
Postgres with Bun's built-in client.
