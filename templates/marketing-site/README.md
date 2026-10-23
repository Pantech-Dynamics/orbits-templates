# Marketing site

A landing page, a pricing page and a blog, built with [Astro](https://astro.build). Every page is plain HTML
at build time, with no JavaScript shipped unless you add some, so it loads fast everywhere.

## Make it yours

- **Words and links** used across the site (name, tagline, navigation) are in `src/site.ts`.
- **Pages** are in `src/pages/`: `index.astro`, `pricing.astro`, the blog, a 404 and an RSS feed.
- **Blog posts** are Markdown files in `src/content/blog/`. Their front matter (`title`, `description`, `date`,
  optional `author` and `draft`) is checked at build time by the schema in `src/content.config.ts`.
- **Styles** are in `src/styles/global.css`, with light and dark themes from a handful of variables.

## Run it locally

```sh
npm install
npm run dev
```

`npm run build` writes the site to `dist`, which is what Orbit serves. Set `site` in `astro.config.mjs` to
your domain to get canonical links and absolute URLs in the feed.
