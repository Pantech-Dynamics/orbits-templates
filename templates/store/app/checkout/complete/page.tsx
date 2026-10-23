import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { verify } from "@/lib/paystack";
import { naira, price } from "@/lib/products";
import { ClearCart } from "./clear-cart";

export const metadata: Metadata = { title: "Your order" };

export default function Complete({ searchParams }: PageProps<"/checkout/complete">) {
  return (
    <main className="receipt">
      <Suspense fallback={<p className="muted">Checking your payment with Paystack…</p>}>
        <Outcome searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

/** Paystack sends the buyer here with a reference. Ask Paystack what happened; the redirect alone proves nothing. */
async function Outcome({ searchParams }: Pick<PageProps<"/checkout/complete">, "searchParams">) {
  const { reference } = await searchParams;
  if (typeof reference !== "string" || !reference) return <Problem message="There's no payment to check here." />;

  let payment;
  try {
    payment = await verify(reference);
  } catch (error) {
    console.error(error);
    return <Problem message="We couldn't check your payment just now. Refresh this page in a minute." />;
  }
  const order = price(payment.metadata?.lines ?? []);
  // Paid, in naira, and the full price of what was ordered.
  if (payment.status !== "success" || payment.currency !== "NGN" || payment.amount < order.total || !order.lines.length) {
    return <Problem message={payment.status === "success" ? "That payment doesn't match an order. Contact us with its reference." : "The payment didn't go through. Your cart is still here."} reference={reference} />;
  }

  return (
    <>
      <ClearCart />
      <p className="tick" aria-hidden>
        ✓
      </p>
      <h1>Thank you, your order is in.</h1>
      <p className="muted">
        A receipt is on its way to {payment.customer.email}. Reference <code>{payment.reference}</code>.
      </p>
      <ul className="summary">
        {order.lines.map(({ product, quantity }) => (
          <li key={product.slug}>
            <span>
              {quantity} × {product.name}
            </span>
            <span>{naira(product.price * quantity)}</span>
          </li>
        ))}
        <li className="sum">
          <span>Paid</span>
          <strong>{naira(payment.amount)}</strong>
        </li>
      </ul>
      <Link href="/" className="button">
        Keep shopping
      </Link>
    </>
  );
}

function Problem({ message, reference }: { message: string; reference?: string }) {
  return (
    <>
      <h1>Something&apos;s not right</h1>
      <p className="muted">
        {message}
        {reference && (
          <>
            {" "}
            Reference <code>{reference}</code>.
          </>
        )}
      </p>
      <Link href="/cart" className="button">
        Back to your cart
      </Link>
    </>
  );
}
