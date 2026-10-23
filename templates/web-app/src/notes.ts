import { useSyncExternalStore } from "react";

export type Note = { id: string; title: string; body: string; updatedAt: number };

const KEY = "notes";
const listeners = new Set<() => void>();

function load(): Note[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Note[];
  } catch {
    // Storage can be unavailable (private windows) or hold something else: start fresh.
  }
  return [
    {
      id: crypto.randomUUID(),
      title: "Welcome",
      body: "This is a single-page app: every page after the first loads without a trip to the server.\n\nNotes are saved in this browser. Swap src/notes.ts for calls to your API to keep them anywhere.",
      updatedAt: Date.now(),
    },
  ];
}

let notes = load();

function save(next: Note[]) {
  notes = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(notes));
  } catch {
    // Keep working in memory.
  }
  listeners.forEach((l) => l());
}

// Another tab changed them.
window.addEventListener("storage", (e) => {
  if (e.key === KEY) {
    notes = load();
    listeners.forEach((l) => l());
  }
});

export function useNotes() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => notes,
  );
}

export function createNote(): Note {
  const note = { id: crypto.randomUUID(), title: "", body: "", updatedAt: Date.now() };
  save([note, ...notes]);
  return note;
}

export function updateNote(id: string, patch: Partial<Pick<Note, "title" | "body">>) {
  save(notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)));
}

export function deleteNote(id: string) {
  save(notes.filter((n) => n.id !== id));
}
