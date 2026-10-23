import { createHmac, timingSafeEqual } from "node:crypto";

/** Whether `header` ("sha256=<hex>") is the HMAC-SHA256 of `body` under `secret`, compared in constant time. */
export function verify(body, header, secret) {
  if (typeof header !== "string" || !header.startsWith("sha256=")) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
  return verify.equal(header, expected);
}

verify.equal = (a, b) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** The header a sender would set, for tests and for signing your own events. */
export const sign = (body, secret) => "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
