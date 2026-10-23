import { describe, expect, it } from "bun:test";
import { createApp } from "../src/app";
import { taskStore } from "../src/tasks";

const setup = () => createApp(taskStore(["First"]));
const form = (body: Record<string, string>) => ({
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded", "hx-request": "true" },
  body: new URLSearchParams(body),
});
const text = (res: Response) => res.text();

describe("tasks", () => {
  it("renders the page with its tasks", async () => {
    const page = await setup().handle(new Request("http://localhost/")).then(text);
    expect(page).toStartWith("<!doctype html>");
    expect(page).toContain("First");
    expect(page).toContain("1 task left");
  });

  it("adds a task and updates the count out of band", async () => {
    const app = setup();
    const res = await app.handle(new Request("http://localhost/tasks", form({ title: "Second" })));
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain("Second");
    expect(html).toContain('hx-swap-oob="true"');
    expect(html).toContain("2 tasks left");
  });

  it("escapes what people type", async () => {
    const html = await setup().handle(new Request("http://localhost/tasks", form({ title: "<script>x</script>" }))).then(text);
    expect(html).not.toContain("<script>x</script>");
    expect(html).toContain("&lt;script&gt;x&lt;/script&gt;");
  });

  it("puts the form back with an error for an empty title", async () => {
    const res = await setup().handle(new Request("http://localhost/tasks", form({ title: "   " })));
    expect(res.status).toBe(422);
    expect(res.headers.get("hx-retarget")).toBe("#add");
    expect(await res.text()).toContain("A task needs a title");
  });

  it("toggles, searches and deletes", async () => {
    const app = setup();
    expect(await app.handle(new Request("http://localhost/tasks/1/toggle", { method: "PATCH" })).then(text)).toContain('class="done"');
    expect(await app.handle(new Request("http://localhost/tasks?q=nothing")).then(text)).toContain("No tasks match");
    expect(await app.handle(new Request("http://localhost/tasks/1", { method: "DELETE" })).then(text)).toContain("0 tasks left");
  });
});
