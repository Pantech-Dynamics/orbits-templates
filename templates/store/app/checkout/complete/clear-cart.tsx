"use client";

import { useEffect } from "react";
import { clear } from "@/lib/cart";

/** Empties the cart once the payment is confirmed. */
export function ClearCart() {
  useEffect(() => clear(), []);
  return null;
}
