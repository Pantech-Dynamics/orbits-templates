"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initialize } from "@/lib/paystack";
import { price, type Line } from "@/lib/products";

export type CheckoutState = { error: string; email?: string } | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Prices the cart from the catalogue, starts a Paystack payment and sends the buyer to pay. */
export async function checkout(_: CheckoutState, form: FormData): Promise<CheckoutState> {
  const email = String(form.get("email") ?? "").trim();
  if (!EMAIL.test(email)) return { error: "Enter the email address for your receipt.", email };

  let lines: Line[];
  try {
    lines = JSON.parse(String(form.get("lines") ?? "[]")) as Line[];
  } catch {
    return { error: "Your cart couldn't be read. Refresh and try again.", email };
  }
  const order = price(Array.isArray(lines) ? lines : []);
  if (!order.total) return { error: "Your cart is empty.", email };

  // Where Paystack sends the buyer back: this site's own address, as the browser sees it.
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;

  let url: string;
  try {
    const payment = await initialize({
      email,
      amount: order.total,
      callback_url: `${origin}/checkout/complete`,
      metadata: { lines: order.lines.map((l) => ({ slug: l.product.slug, quantity: l.quantity })) },
    });
    url = payment.authorization_url;
  } catch (error) {
    console.error(error);
    return { error: "Payments aren't working right now. Try again in a minute.", email };
  }
  redirect(url);
}
