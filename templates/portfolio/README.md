# Portfolio

A designer's or developer's portfolio built with [Next.js](https://nextjs.org): an introduction, a grid of
case studies, a page for each, and a contact form. Every page is static HTML, built ahead of time.

## Make it yours

- **You**: name, role, introduction and links are in `lib/site.ts`.
- **Your work**: each case study is an object in `lib/work.ts` with a summary, facts and a few sections.
  Covers are drawn from two colours, so there's nothing to upload until you have screenshots; then swap
  `app/_components/cover.tsx` for a `next/image`.
- **Styles** are in `app/globals.css`.

## The contact form

The form is a [server action](https://nextjs.org/docs/app/guides/forms) (`app/actions.ts`). It checks every
field on the server, keeps what was typed if something's wrong, and ignores bots that fill in a hidden field.

Set `CONTACT_WEBHOOK_URL` to have each message POSTed as JSON to a Slack incoming webhook, a Zapier or Make
hook, or your own API. Without it, messages are written to the app's logs.

## Run it locally

```sh
npm install
npm run dev
```

Orbit runs `npm run build`, then `npm run start`.
