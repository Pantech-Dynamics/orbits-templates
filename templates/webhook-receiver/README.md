# Webhook receiver

Receives webhooks, refuses any whose signature doesn't match, and keeps the newest 500 for you to read
back. Plain Node.js, no dependencies.

## How a sender signs an event

The sender computes an HMAC-SHA256 of the raw request body with the shared secret and sends it as
`sha256=<hex>` in one of these headers:

- `X-Hub-Signature-256`: what GitHub sends, so GitHub webhooks work as they are.
- `X-Signature-256`: for any other sender.

An event repeated with the same delivery id (`X-GitHub-Delivery` or `X-Delivery-Id`) is answered as a
duplicate and handled once.

## Endpoints

| Method | Path | |
| --- | --- | --- |
| POST | `/webhooks` | Receive an event: 202, or 200 for a duplicate, 401 for a bad signature |
| GET | `/events?limit=20` | The newest events. Send the secret as `Authorization: Bearer <secret>` |
| GET | `/` | Status |

## Environment

| Variable | |
| --- | --- |
| `WEBHOOK_SECRET` | The shared secret. Without it every event is refused. Generate one with `openssl rand -hex 32`. |

## Your logic

Put what should happen for each event in `handle()` in `src/server.js`. Keep it quick: senders retry a
slow response. Events live in memory (`src/store.js`), so they're gone after a redeploy; replace that
file with a database when you need to keep them.

## Try it

```sh
cp .env.example .env   # set WEBHOOK_SECRET
npm run dev
npm run send            # sends a signed test event to localhost:3000
npm run send -- https://your-app.orbit.space
```
