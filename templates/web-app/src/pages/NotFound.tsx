import { Link } from "../link";

export function NotFound() {
  return (
    <div className="panel hatch missing">
      <span className="badge plain mono">404</span>
      <h1 className="heading">Nothing here</h1>
      <p className="muted">That page doesn't exist, or the note was deleted.</p>
      <Link href="/" className="btn btn-primary">
        Back to your notes
      </Link>
    </div>
  );
}
