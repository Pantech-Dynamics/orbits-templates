import type { Metadata } from "next";
import { Cart } from "./cart";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <main className="page cart-page">
      <section className="panel page-head reveal">
        <h1 className="heading">Your cart</h1>
      </section>
      <Cart />
    </main>
  );
}
