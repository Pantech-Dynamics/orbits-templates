# Docs site

Documentation built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build): search,
versions, dark mode, and pages that are plain Markdown.

## Writing

Pages are Markdown (or MDX) in `src/content/docs/`. The file's path is its URL: `guides/webhooks.md` is
`/guides/webhooks/`. The sidebar is set in `astro.config.mjs`; the Guides and Reference groups list their
folders on their own.

## Search

Built in. Starlight indexes every page with [Pagefind](https://pagefind.app) at build time, so search works
with no server and no account. Press <kbd>/</kbd> or <kbd>⌘K</kbd>.

## Versions

The current docs are v2; v1 is kept as a snapshot in `src/content/docs/1.0/`, and the menu in the header
switches between them ([starlight-versions](https://starlight-versions.vercel.app)). To release a new version,
add it to `versions` in `astro.config.mjs` and run a build: the plugin copies today's docs into a snapshot,
and you carry on editing the current ones.

## Look

`src/styles/orbit.css` is Orbit's tokens and components, shared by every Orbit template, and
`src/styles/custom.css` maps them onto Starlight's variables: square corners, Hanken Grotesk, zinc greys and one
blue accent, in light and dark. Change the accent there and the whole site follows.

## Link previews

`public/og.png` is the picture a shared link shows (1200×630); swap in your own. Set `SITE_URL` (`https://your-site.com`) in the project's environment variables and the build writes `og:image` as a full address; without it the address is relative, which some link bots ignore.

## Run it locally

```sh
npm install
npm run dev
```

`npm run build` writes the site to `dist`, which is what Orbit serves. Set `site` in `astro.config.mjs` and the
`editLink` base to your repository to get "Edit page" links.
