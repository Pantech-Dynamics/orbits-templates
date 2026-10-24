import { useMemo, useState, type CSSProperties } from "react";
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
      <div className="head">
        <div>
          <h1 className="heading">All notes</h1>
          <p className="meta">
            <span className="badge plain">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
            <span className="badge plain">Saved in this browser</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/notes/${createNote().id}`)}>
          New note
        </button>
      </div>

      <section className="panel">
        <div className="panel-head">
          <input className="input search" type="search" placeholder="Search notes" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search notes" />
        </div>
        {shown.length ? (
          <ul className="notes">
            {shown.map((n, i) => (
              <li key={n.id} className="reveal" style={{ "--delay": `${Math.min(i, 8) * 30}ms` } as CSSProperties}>
                <Link href={`/notes/${n.id}`} className="hoverable">
                  <span className="tile">{(n.title || "U").slice(0, 1)}</span>
                  <strong>{n.title || "Untitled"}</strong>
                  <span className="excerpt">{n.body.split("\n")[0] || "No text yet"}</span>
                  <time className="mono" dateTime={new Date(n.updatedAt).toISOString()}>
                    {when.format(n.updatedAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty hatch">
            <p className="subheading">{q ? "No notes match that search" : "No notes yet"}</p>
            <p className="muted">{q ? "Try another word, or clear the search." : "Start one and it's saved as you type."}</p>
          </div>
        )}
      </section>
    </>
  );
}
