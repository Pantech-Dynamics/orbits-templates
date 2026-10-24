import type { Metadata } from "next";
import Link from "next/link";
import { FONTS } from "@/lib/fonts";
import { OpenGraph } from "@/lib/og";
import { SITE } from "@/lib/site";
import "./orbit.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE.name}, ${SITE.role}`, template: `%s · ${SITE.name}` },
  description: SITE.intro,
  twitter: { card: "summary_large_image" },
  openGraph: { title: `${SITE.name}, ${SITE.role}`, description: SITE.intro, siteName: SITE.name },
};

const initials = SITE.name
  .split(" ")
  .map((w) => w[0])
  .join("");

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={FONTS}>
      <head>
        <OpenGraph alt={`${SITE.name}: ${SITE.intro}`} />
      </head>
      <body className="ground">
        <header className="top">
          <div className="top-row">
            <Link href="/" className="name">
              <span className="tile solid">{initials}</span>
              {SITE.name}
            </Link>
            <nav>
              <Link href="/#work">Work</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
          </div>
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
