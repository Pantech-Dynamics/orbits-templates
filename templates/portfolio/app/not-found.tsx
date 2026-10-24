import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <section className="panel hatch missing reveal">
        <span className="badge plain mono">404</span>
        <h1 className="heading">Nothing here</h1>
        <p className="muted">That page doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-primary">
          Go back home
        </Link>
      </section>
    </main>
  );
}
