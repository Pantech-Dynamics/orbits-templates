"use client";

import { useState } from "react";
import Link from "next/link";
import { add } from "@/lib/cart";

export function AddToCart({ slug }: { slug: string }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="buy">
      <button
        className="button"
        onClick={() => {
          add(slug);
          setAdded(true);
        }}
      >
        Add to cart
      </button>
      {added && (
        <p role="status">
          Added. <Link href="/cart">View your cart</Link>
        </p>
      )}
    </div>
  );
}
