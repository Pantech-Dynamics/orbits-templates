"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartLink() {
  const count = useCart().reduce((n, l) => n + l.quantity, 0);
  return (
    <Link href="/cart" className="btn btn-sm cart-link">
      Cart
      {count > 0 && (
        // Keyed by the count, so it pops in again whenever the cart changes.
        <span className="count mono" key={count}>
          {count}
        </span>
      )}
    </Link>
  );
}
