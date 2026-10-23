# Store

A shop built with [Next.js](https://nextjs.org) that takes payment through [Paystack](https://paystack.com):
product pages, a cart, checkout on Paystack's secure page, and a receipt once the payment is confirmed.

## How checkout stays honest

1. The cart lives in the browser and holds only product slugs and quantities.
2. **Pay** calls a server action (`app/actions.ts`) that prices the order from `lib/products.ts`, so a price
   changed in the browser changes nothing, and starts a Paystack transaction with your secret key.
3. The buyer pays on Paystack's page, by card, bank transfer or USSD, and comes back to `/checkout/complete`.
4. That page asks Paystack what happened (`lib/paystack.ts`) and shows the receipt only if the payment
   succeeded, in naira, for the full price of what was ordered.

The secret key is only ever used on the server.

## Environment

| Variable | |
| --- | --- |
| `PAYSTACK_SECRET_KEY` | Required. From **Settings → API Keys** in your Paystack dashboard. Use the test key (`sk_test_…`) until you're ready to take real payments; Paystack's test cards work with it. |

## Make it yours

- **Products** are in `lib/products.ts`, priced in kobo. Each has two colours and a glyph for its picture
  until you have photos; then swap `app/_components/tile.tsx` for a `next/image`.
- **Styles** are in `app/globals.css`.

## Before you sell for real

- Fulfil orders from Paystack's [`charge.success` webhook](https://paystack.com/docs/payments/webhooks/), not
  from the receipt page: the buyer might close the tab before they get there.
- Keep orders somewhere: a database, or the webhook forwarding them to your inventory tool.

## Run it locally

```sh
cp .env.example .env.local   # add your test secret key
npm install
npm run dev
```

Orbit runs `npm run build`, then `npm run start`.
