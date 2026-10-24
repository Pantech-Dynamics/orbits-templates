# Marketing site

A landing page, a pricing page and a blog, built with [Astro](https://astro.build). Every page is plain HTML
at build time, with no JavaScript shipped unless you add some, so it loads fast everywhere.

## Make it yours

- **Words and links** used across the site (name, tagline, navigation) are in `src/site.ts`.
- **Pages** are in `src/pages/`: `index.astro`, `pricing.astro`, the blog, a 404 and an RSS feed.
- **Blog posts** are Markdown files in `src/content/blog/`. Their front matter (`title`, `description`, `date`,
  optional `author` and `draft`) is checked at build time by the schema in `src/content.config.ts`.
- **Styles**: `src/styles/orbit.css` is Orbit's tokens and components (panels, buttons, badges, light and dark),
  shared by every Orbit template; `src/styles/global.css` is this site's layout on top of it.

## Link previews

`public/og.png` is the picture a shared link shows (1200×630); swap in your own. Set `SITE_URL` (`https://your-site.com`) in the project's environment variables and the build writes `og:image` as a full address; without it the address is relative, which some link bots ignore.

## Run it locally

```sh
npm install
npm run dev
```

`npm run build` writes the site to `dist`, which is what Orbit serves. Set `site` in `astro.config.mjs` to
your domain to get canonical links and absolute URLs in the feed.
