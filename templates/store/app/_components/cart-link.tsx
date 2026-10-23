"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartLink() {
  const count = useCart().reduce((n, l) => n + l.quantity, 0);
  return (
    <Link href="/cart" className="cart-link">
      Cart{count > 0 && <span className="count">{count}</span>}
    </Link>
  );
}
