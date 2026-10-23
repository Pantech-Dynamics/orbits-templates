"use client";

import Link from "next/link";
import { useActionState } from "react";
import { setQuantity, useCart } from "@/lib/cart";
import { naira, price } from "@/lib/products";
import { checkout, type CheckoutState } from "../actions";
import { Tile } from "../_components/tile";

export function Cart() {
  const lines = useCart();
  const order = price(lines);
  const [state, action, pending] = useActionState<CheckoutState, FormData>(checkout, null);

  if (!order.lines.length) {
    return (
      <p className="empty">
        Nothing here yet. <Link href="/">Have a look around</Link>.
      </p>
    );
  }

  return (
    <div className="cart">
      <ul className="lines">
        {order.lines.map(({ product, quantity }) => (
          <li key={product.slug}>
            <Tile product={product} />
            <div>
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
              <small>{naira(product.price)} each</small>
            </div>
            <div className="qty">
              <button aria-label={`One fewer ${product.name}`} onClick={() => setQuantity(product.slug, quantity - 1)}>
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button aria-label={`One more ${product.name}`} onClick={() => setQuantity(product.slug, quantity + 1)}>
                +
              </button>
            </div>
            <strong>{naira(product.price * quantity)}</strong>
          </li>
        ))}
      </ul>

      <form action={action} className="checkout">
        <p className="total">
          <span>Total</span>
          <strong>{naira(order.total)}</strong>
        </p>
        <input type="hidden" name="lines" value={JSON.stringify(lines)} />
        <label>
          Email for your receipt
          <input name="email" type="email" autoComplete="email" required defaultValue={state?.email} />
        </label>
        {state?.error && (
          <p className="error" role="alert">
            {state.error}
          </p>
        )}
        <button className="button" disabled={pending}>
          {pending ? "Taking you to Paystack…" : `Pay ${naira(order.total)}`}
        </button>
        <small>You&apos;ll pay on Paystack&apos;s secure page, by card, bank transfer or USSD.</small>
      </form>
    </div>
  );
}
