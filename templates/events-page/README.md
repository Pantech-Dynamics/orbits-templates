# Events page

One page for a conference or meetup, built with [SvelteKit](https://svelte.dev/docs/kit): the schedule by day
with what's happening now, the speakers, ticket tiers, a free RSVP that works without JavaScript, and an
"Add to calendar" file.

## Make it yours

Everything about the event is in `src/lib/event.ts`: name, dates, venue, speakers, sessions and tickets.
Times carry their UTC offset and are shown in the event's time zone, so they're right for everyone.

- **Paid tickets** link to wherever you sell them: a Paystack payment page, Flutterwave, a ticketing site.
  Set each tier's `href`.
- **Free RSVPs** go through the form, a SvelteKit form action in `src/routes/+page.server.ts`. They're kept in
  memory and reset on every deploy, so set `RSVP_WEBHOOK_URL` to also send each one somewhere that keeps it.
- **Styles**: `src/orbit.css` is Orbit's tokens and components (panels, buttons, badges, light and dark), shared
  by every Orbit template; `src/app.css` is this page's layout on top of it.

## Environment

| Variable | |
| --- | --- |
| `RSVP_WEBHOOK_URL` | Optional. Each RSVP is POSTed here as JSON. Declared and checked in `src/env.ts`. |

## Run it locally

```sh
npm install
npm run dev
```

Orbit runs `npm run build`, then `node build`, and serves the site over HTTPS. The Node adapter assumes HTTPS,
so the built app run locally over plain HTTP refuses form posts as cross-site; use `npm run dev` locally.
