import { useEffect } from "react";
import { deleteNote, updateNote, useNotes } from "../notes";
import { Link } from "../link";
import { navigate } from "../router";
import { NotFound } from "./NotFound";

export function NotePage({ id }: { id: string }) {
  const note = useNotes().find((n) => n.id === id);

  useEffect(() => {
    document.title = `${note?.title || "Untitled"} · Notes`;
    return () => {
      document.title = "Notes";
    };
  }, [note?.title]);

  if (!note) return <NotFound />;

  return (
    <article className="editor">
      <div className="toolbar">
        <Link href="/">← All notes</Link>
        <button
          className="danger"
          onClick={() => {
            if (confirm("Delete this note?")) {
              deleteNote(id);
              navigate("/");
            }
          }}
        >
          Delete
        </button>
      </div>
      <input
        className="title"
        value={note.title}
        placeholder="Untitled"
        onChange={(e) => updateNote(id, { title: e.target.value })}
        aria-label="Title"
        autoFocus={!note.title}
      />
      <textarea value={note.body} placeholder="Write something…" onChange={(e) => updateNote(id, { body: e.target.value })} aria-label="Note" />
      <p className="hint">Saved as you type.</p>
    </article>
  );
}
