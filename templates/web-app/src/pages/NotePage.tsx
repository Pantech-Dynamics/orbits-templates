import { useEffect } from "react";
import { deleteNote, updateNote, useNotes } from "../notes";
import { Link } from "../link";
import { navigate } from "../router";
import { NotFound } from "./NotFound";

const when = new Intl.DateTimeFormat(undefined, { timeStyle: "short" });

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
    <article className="panel editor">
      <div className="panel-head">
        <Link href="/">← All notes</Link>
        <span className="badge green saved">Saved {when.format(note.updatedAt)}</span>
        <button
          className="btn btn-sm danger"
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
        className="title-input"
        value={note.title}
        placeholder="Untitled"
        onChange={(e) => updateNote(id, { title: e.target.value })}
        aria-label="Title"
        autoFocus={!note.title}
      />
      <textarea value={note.body} placeholder="Write something…" onChange={(e) => updateNote(id, { body: e.target.value })} aria-label="Note" />
    </article>
  );
}
