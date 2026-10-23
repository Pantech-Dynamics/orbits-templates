export type Task = { id: number; title: string; done: boolean; created_at: string };

/**
 * Tasks in memory: they reset on every deploy. The Elysia API template shows the same idea backed by
 * Postgres through Bun's built-in client.
 */
export function taskStore(seed: string[] = []) {
  const tasks = new Map<number, Task>();
  let next = 1;
  const add = (title: string) => {
    const task = { id: next++, title, done: false, created_at: new Date().toISOString() };
    tasks.set(task.id, task);
    return task;
  };
  seed.forEach(add);

  return {
    add,
    list(q = "") {
      const needle = q.trim().toLowerCase();
      return [...tasks.values()].filter((t) => t.title.toLowerCase().includes(needle)).sort((a, b) => b.id - a.id);
    },
    toggle(id: number) {
      const task = tasks.get(id);
      if (task) task.done = !task.done;
      return task ?? null;
    },
    remove(id: number) {
      return tasks.delete(id);
    },
    remaining() {
      return [...tasks.values()].filter((t) => !t.done).length;
    },
  };
}

export type TaskStore = ReturnType<typeof taskStore>;
