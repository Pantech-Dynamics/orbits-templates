# Waitlist

One page that collects email addresses, served by a small Node.js server with no dependencies. The form
works without JavaScript, ignores bots that fill in a hidden field, and counts each address once.

## Where sign-ups go

Sign-ups are kept in memory, so they're gone after a redeploy. Set `WAITLIST_WEBHOOK_URL` and each new
sign-up is also sent there as JSON, to somewhere that keeps it:

- a Slack incoming webhook (it reads the `text` field),
- a Zapier or Make webhook that adds a row to a sheet,
- your own API.

```json
{ "text": "New sign-up: ada@example.com", "email": "ada@example.com", "joined_at": "2026-10-23T14:18:27.057Z" }
```

## Environment

| Variable | |
| --- | --- |
| `WAITLIST_WEBHOOK_URL` | Optional. Where each sign-up is POSTed. |
| `WAITLIST_ADMIN_TOKEN` | Optional. Lets you download the list from `/export.csv` with `Authorization: Bearer <token>`. |

## Run it locally

```sh
npm run dev
```

## Make it yours

The page is `public/index.html` and its styles are `public/styles.css`. `{{count}}` in the page is
replaced with the number of sign-ups.
