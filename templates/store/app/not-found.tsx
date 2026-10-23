import Link from "next/link";

export default function NotFound() {
  return (
    <main className="receipt">
      <h1>That isn&apos;t here</h1>
      <p className="muted">
        It may have sold out for good. <Link href="/">See what&apos;s in the shop</Link>.
      </p>
    </main>
  );
}
