# Admin dashboard

A dashboard built with Vite and React: sign-in, an overview with figures and charts, and tables you can
search, sort, filter and page through. No UI or chart library; the charts are plain SVG that follow the
page's colours in light and dark.

Sign in with the demo account: `admin@example.com` / `orbit`.

## Make it yours

- **Data** comes from `src/data.ts`, which makes up a consistent set of orders and customers. Replace its
  exports with calls to your API; the pages only use what it returns.
- **Sign-in** is checked in the browser (`src/auth.ts`), which is fine for a demo and not for real data: a
  static site can't keep a secret. Point `signIn` at your auth server and rely on its session cookie before
  putting anything private behind it.
- **Pages** live in `src/pages/` and are listed in `src/App.tsx`.

## Run it locally

```sh
npm install
npm run dev
```

`npm run build` writes the site to `dist`. Orbit serves it with the single-page-app fallback on, so a link
straight to `/orders` works.
