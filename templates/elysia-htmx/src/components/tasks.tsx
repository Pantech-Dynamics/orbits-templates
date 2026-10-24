import { Html } from "@elysia/html";
import type { Task } from "../tasks";

/** `fresh` marks a task that was just added, so it slides in; a toggled row swaps in place without moving. */
export function TaskItem({ task, fresh = false }: { task: Task; fresh?: boolean }) {
  return (
    <li id={`task-${task.id}`} class={task.done ? "done" : fresh ? "fresh" : ""}>
      <label>
        <input
          class="check"
          type="checkbox"
          checked={task.done}
          hx-patch={`/tasks/${task.id}/toggle`}
          hx-target={`#task-${task.id}`}
          hx-swap="outerHTML"
        />
        <span safe>{task.title}</span>
      </label>
      <button
        type="button"
        class="btn btn-sm remove"
        aria-label="Delete"
        hx-delete={`/tasks/${task.id}`}
        hx-target={`#task-${task.id}`}
        hx-swap="outerHTML swap:150ms"
      >
        ×
      </button>
    </li>
  );
}

export function TaskList({ tasks, q = "" }: { tasks: Task[]; q?: string }) {
  if (!tasks.length) return <li class="empty hatch">{q ? "No tasks match that search." : "Nothing to do. Add a task above."}</li>;
  return (
    <>
      {tasks.map((task) => (
        <TaskItem task={task} />
      ))}
    </>
  );
}

/** Sent alongside other swaps (hx-swap-oob) so the count stays right after every change. */
export function Remaining({ count, oob = false }: { count: number; oob?: boolean }) {
  return (
    <p id="remaining" class={count ? "badge accent" : "badge green"} hx-swap-oob={oob ? "true" : undefined} safe>
      {count === 1 ? "1 task left" : `${count} tasks left`}
    </p>
  );
}

export function AddForm({ error, value = "" }: { error?: string; value?: string }) {
  return (
    <form
      id="add"
      class="add"
      hx-post="/tasks"
      hx-target="#tasks"
      hx-swap="afterbegin"
      {...{ "hx-on::after-request": "if (event.detail.successful) { this.reset(); this.querySelector('.error')?.remove() }" }}
    >
      <input class="input" name="title" placeholder="What needs doing?" autocomplete="off" required maxlength="200" value={value} aria-label="New task" />
      <button class="btn btn-primary" type="submit">
        Add task
      </button>
      {error ? (
        <p class="error" role="alert" safe>
          {error}
        </p>
      ) : (
        ""
      )}
    </form>
  );
}
