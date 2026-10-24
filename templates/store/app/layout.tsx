import type { Metadata } from "next";
import Link from "next/link";
import { FONTS } from "@/lib/fonts";
import { OpenGraph } from "@/lib/og";
import { CartLink } from "./_components/cart-link";
import "./orbit.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kola Goods", template: "%s · Kola Goods" },
  description: "Coffee, tea and the things you drink them from, roasted and made in Nigeria.",
  twitter: { card: "summary_large_image" },
  openGraph: {
    title: "Kola Goods",
    description: "Coffee, tea and the things you drink them from, roasted and made in Nigeria.",
    siteName: "Kola Goods",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={FONTS}>
      <head>
        <OpenGraph alt="Kola Goods: coffee, tea and the things you drink them from." />
      </head>
      <body className="ground">
        <header className="top">
          <div className="top-row">
            <Link href="/" className="brand">
              <span className="tile solid">K</span>
              Kola Goods
            </Link>
            <CartLink />
          </div>
        </header>
        {children}
        <footer className="bottom">
          <span className="badge plain">Payments by Paystack</span>
          <span className="badge plain">Delivery across Nigeria in 2–4 days</span>
        </footer>
      </body>
    </html>
  );
}
