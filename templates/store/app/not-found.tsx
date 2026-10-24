import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <section className="panel hatch receipt reveal">
        <span className="badge plain mono">404</span>
        <h1 className="heading">That isn&apos;t here</h1>
        <p className="muted">It may have sold out for good.</p>
        <Link href="/" className="btn btn-primary">
          See what&apos;s in the shop
        </Link>
      </section>
    </main>
  );
}
