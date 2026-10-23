import { Link } from "../link";

export function NotFound() {
  return (
    <div className="prose center">
      <h1>Nothing here</h1>
      <p>That page doesn't exist, or the note was deleted.</p>
      <Link href="/">Back to your notes</Link>
    </div>
  );
}
