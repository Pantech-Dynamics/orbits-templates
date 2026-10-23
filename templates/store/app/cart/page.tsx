import type { Metadata } from "next";
import { Cart } from "./cart";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <main className="cart-page">
      <h1>Your cart</h1>
      <Cart />
    </main>
  );
}
