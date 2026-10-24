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
      <div className="panel hatch empty">
        <p className="subheading">Nothing here yet</p>
        <Link href="/" className="btn btn-primary">
          Have a look around
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <ul className="panel lines">
        {order.lines.map(({ product, quantity }) => (
          <li key={product.slug}>
            <Tile product={product} />
            <div className="line-name">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
              <small className="num">{naira(product.price)} each</small>
            </div>
            <div className="qty">
              <button className="btn btn-sm" aria-label={`One fewer ${product.name}`} onClick={() => setQuantity(product.slug, quantity - 1)}>
                −
              </button>
              <span className="mono" aria-live="polite">
                {quantity}
              </span>
              <button className="btn btn-sm" aria-label={`One more ${product.name}`} onClick={() => setQuantity(product.slug, quantity + 1)}>
                +
              </button>
            </div>
            <strong className="num">{naira(product.price * quantity)}</strong>
          </li>
        ))}
      </ul>

      <form action={action} className="panel checkout">
        <p className="total">
          <span>Total</span>
          <strong className="num">{naira(order.total)}</strong>
        </p>
        <input type="hidden" name="lines" value={JSON.stringify(lines)} />
        <label className="field">
          Email for your receipt
          <input className="input" name="email" type="email" autoComplete="email" required defaultValue={state?.email} />
        </label>
        {state?.error && (
          <p className="error" role="alert">
            {state.error}
          </p>
        )}
        <button className="btn btn-primary btn-lg" disabled={pending}>
          {pending ? "Taking you to Paystack…" : `Pay ${naira(order.total)}`}
        </button>
        <small>You&apos;ll pay on Paystack&apos;s secure page, by card, bank transfer or USSD.</small>
      </form>
    </div>
  );
}
