import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE.name}, ${SITE.role}`, template: `%s · ${SITE.name}` },
  description: SITE.intro,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <Link href="/" className="name">
            {SITE.name}
          </Link>
          <nav>
            <Link href="/#work">Work</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
        </header>
        {children}
        <footer className="bottom">
          <span>{SITE.location}</span>
          <nav>
            {SITE.links.map((l) => (
              <a key={l.href} href={l.href} rel="me noopener" target="_blank">
                {l.label}
              </a>
            ))}
          </nav>
        </footer>
      </body>
    </html>
  );
}
