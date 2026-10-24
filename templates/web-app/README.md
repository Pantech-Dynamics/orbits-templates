# Web app

A single-page app with Vite and React: a small notes app with its own router, saved in the browser.

The server sends `index.html` once. After that React draws every page in the browser, and Orbit's
single-page-app fallback serves `index.html` for any path, so a link straight to `/notes/<id>` works.

## Link previews

`public/og.png` is the picture a shared link shows (1200×630); swap in your own. Set `SITE_URL` (`https://your-site.com`) in the project's environment variables and the build writes `og:image` as a full address; without it the address is relative, which some link bots ignore.

## Run it locally

```sh
npm install
npm run dev
```

`npm run build` writes the site to `dist`, which is what Orbit serves.

## Files

- `src/router.tsx` and `src/link.tsx`: a small history router. Swap in React Router or TanStack Router when you
  need nested layouts or data loading.
- `src/notes.ts`: the notes, in `localStorage`. Replace its functions with calls to your API; the pages don't change.
- `src/pages/`: one component per page.
- `src/orbit.css`: Orbit's tokens and components (panels, buttons, badges, light and dark), shared by every Orbit
  template. `src/index.css` is this app's own layout on top of it.
