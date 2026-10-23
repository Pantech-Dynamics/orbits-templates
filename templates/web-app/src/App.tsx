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
  return (
    <div className="shell">
      <header className="bar">
        <Link href="/" className="brand">
          Notes
        </Link>
        <nav>
          <Link href="/">All notes</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>
      <main>
        <Page />
      </main>
    </div>
  );
}
