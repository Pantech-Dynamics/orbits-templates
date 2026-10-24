import { Elysia, file, t } from "elysia";
import { html, Html } from "@elysia/html";
import { staticPlugin } from "@elysia/static";
import { Layout } from "./components/layout";
import { AddForm, Remaining, TaskItem, TaskList } from "./components/tasks";
import type { TaskStore } from "./tasks";

const id = t.Object({ id: t.Number({ minimum: 1 }) });

/** The site's address for link previews: SITE_URL when it's set, else the one this request came to. */
const origin = (request: Request) =>
  process.env.SITE_URL?.replace(/\/$/, "") ||
  `${request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "http"}://${request.headers.get("host") ?? new URL(request.url).host}`;

/** Every route answers with HTML: a whole page for a visit, a fragment for an htmx request. */
export const createApp = (store: TaskStore) =>
  new Elysia()
    .use(html())
    .use(staticPlugin({ assets: "public", prefix: "/public" }))
    .get("/htmx.min.js", () => file("node_modules/htmx.org/dist/htmx.min.js"))
    .get("/health", () => ({ status: "ok" }))

    .get("/", ({ request }) => (
      <Layout title="Tasks" origin={origin(request)}>
        <header class="bar">
          <span class="brand">
            <span class="tile solid">T</span>
            Tasks
          </span>
          <span class="badge plain mono">Elysia · htmx</span>
        </header>
        <main>
          <section class="panel reveal">
            <div class="panel-head">
              <h1>To do</h1>
              <Remaining count={store.remaining()} />
            </div>
            <AddForm />
          </section>
          <section class="panel reveal" style="--delay: 60ms">
            <div class="panel-head">
              <input
                class="input search"
                type="search"
                name="q"
                placeholder="Search"
                aria-label="Search tasks"
                hx-get="/tasks"
                hx-trigger="input changed delay:250ms, search"
                hx-target="#tasks"
                hx-indicator="#tasks"
              />
            </div>
            <ul id="tasks">
              <TaskList tasks={store.list()} />
            </ul>
          </section>
          <footer class="reveal" style="--delay: 120ms">
            Server-rendered with Elysia and JSX; htmx swaps in each change. No client-side framework, about 16 KB of
            JavaScript.
          </footer>
        </main>
      </Layout>
    ))

    .get("/tasks", ({ query }) => <TaskList tasks={store.list(query.q)} q={query.q} />, {
      query: t.Object({ q: t.Optional(t.String()) }),
    })

    .post(
      "/tasks",
      ({ body, set, status }) => {
        const title = body.title.trim();
        if (!title || title.length > 200) {
          // Swap the form itself, with the error under it, instead of adding to the list.
          set.headers["hx-retarget"] = "#add";
          set.headers["hx-reswap"] = "outerHTML";
          return status(422, <AddForm error="A task needs a title of up to 200 characters." value={body.title} />);
        }
        const task = store.add(title);
        return (
          <>
            <TaskItem task={task} fresh />
            <Remaining count={store.remaining()} oob />
          </>
        );
      },
      { body: t.Object({ title: t.String() }) },
    )

    .patch(
      "/tasks/:id/toggle",
      ({ params, status }) => {
        const task = store.toggle(params.id);
        if (!task) return status(404, "");
        return (
          <>
            <TaskItem task={task} />
            <Remaining count={store.remaining()} oob />
          </>
        );
      },
      { params: id },
    )

    .delete(
      "/tasks/:id",
      ({ params }) => {
        store.remove(params.id);
        // An empty body swapped outerHTML removes the row.
        return <Remaining count={store.remaining()} oob />;
      },
      { params: id },
    );
