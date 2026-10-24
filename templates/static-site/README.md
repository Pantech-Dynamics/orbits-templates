# Static site

Plain HTML, CSS and JavaScript. There's no `package.json`, so Orbit has nothing to install or build: it serves
the folder as it is, every file at its own path.

## Link previews

`og.png` is the picture a shared link shows (1200×630), and the pages point at it with `og:image`. Swap in your own. With no build step there's nothing to fill in the address, so once the site has one, make `og:image` in each page a full URL: `https://your-site.com/og.png`. Some link bots ignore a relative one.

## Run it locally

Any static file server works:

```sh
npx serve .
```

## Files

- `index.html`, `about.html`: the pages. Add more by adding `.html` files.
- `orbit.css`: Orbit's tokens and components (panels, buttons, badges, the theme), shared by every Orbit template.
- `styles.css`: this site's own layout on top of it.
- `main.js`: the theme switch and a click counter.
- `404.html`: shown for paths that don't exist.

## Going further

Add a `package.json` with a `build` script when you want a bundler or TypeScript. Orbit runs the build and
serves what it writes to `dist`.
