import { useMemo, useState } from "react";
import { createNote, useNotes } from "../notes";
import { Link } from "../link";
import { navigate } from "../router";

const when = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export function NoteList() {
  const notes = useNotes();
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
    return needle ? sorted.filter((n) => (n.title + "\n" + n.body).toLowerCase().includes(needle)) : sorted;
  }, [notes, q]);

  return (
    <>
      <div className="toolbar">
        <h1>All notes</h1>
        <button className="primary" onClick={() => navigate(`/notes/${createNote().id}`)}>
          New note
        </button>
      </div>
      <input className="search" type="search" placeholder="Search notes" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search notes" />
      {shown.length ? (
        <ul className="notes">
          {shown.map((n) => (
            <li key={n.id}>
              <Link href={`/notes/${n.id}`}>
                <strong>{n.title || "Untitled"}</strong>
                <span className="excerpt">{n.body.split("\n")[0] || "No text yet"}</span>
                <time dateTime={new Date(n.updatedAt).toISOString()}>{when.format(n.updatedAt)}</time>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">{q ? "No notes match that search." : "No notes yet. Start one."}</p>
      )}
    </>
  );
}
