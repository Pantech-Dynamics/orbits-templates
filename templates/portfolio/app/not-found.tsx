import Link from "next/link";

export default function NotFound() {
  return (
    <main className="study">
      <h1>Nothing here</h1>
      <p className="summary">
        That page doesn&apos;t exist. <Link href="/">Go back home</Link>.
      </p>
    </main>
  );
}
