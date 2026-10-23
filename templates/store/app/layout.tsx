import type { Metadata } from "next";
import Link from "next/link";
import { CartLink } from "./_components/cart-link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kola Goods", template: "%s · Kola Goods" },
  description: "Coffee, tea and the things you drink them from, roasted and made in Nigeria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <Link href="/" className="brand">
            Kola Goods
          </Link>
          <CartLink />
        </header>
        {children}
        <footer className="bottom">Payments by Paystack · Delivery across Nigeria in 2–4 days</footer>
      </body>
    </html>
  );
}
