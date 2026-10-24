"use client";

import { useState } from "react";
import Link from "next/link";
import { add } from "@/lib/cart";

export function AddToCart({ slug }: { slug: string }) {
  const [added, setAdded] = useState(0);
  return (
    <div className="buy">
      <button
        className="btn btn-primary btn-lg"
        onClick={() => {
          add(slug);
          setAdded((n) => n + 1);
        }}
      >
        Add to cart
      </button>
      {added > 0 && (
        // Keyed by the count, so a second add says so again.
        <p role="status" className="added" key={added}>
          Added{added > 1 ? ` ${added} times` : ""}. <Link href="/cart">View your cart</Link>
        </p>
      )}
    </div>
  );
}
