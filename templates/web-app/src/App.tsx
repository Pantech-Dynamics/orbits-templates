import { Link } from "./link";
import { match, usePath } from "./router";
import { NoteList } from "./pages/NoteList";
import { NotePage } from "./pages/NotePage";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";

function Page() {
  const path = usePath();
  if (path === "/") return <NoteList />;
  if (path === "/about") return <About />;
  const note = match("/notes/:id", path);
  if (note) return <NotePage key={note.id} id={note.id} />;
  return <NotFound />;
}

export default function App() {
  const path = usePath();
  return (
    <>
      <header className="bar">
        <div className="wrap bar-row">
          <Link href="/" className="brand">
            <span className="tile solid">N</span>
            Notes
          </Link>
          <nav className="segmented">
            <Link href="/" aria-current={path === "/" || path.startsWith("/notes/") ? "page" : undefined}>
              All notes
            </Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
      </header>
      {/* Keyed by path so each page enters with the reveal, like a fresh load. */}
      <main className="wrap page reveal" key={path}>
        <Page />
      </main>
    </>
  );
}
