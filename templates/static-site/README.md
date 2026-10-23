# Static site

Plain HTML, CSS and JavaScript. There's no `package.json`, so Orbit has nothing to install or build: it serves
the folder as it is, every file at its own path.

## Run it locally

Any static file server works:

```sh
npx serve .
```

## Files

- `index.html`, `about.html`: the pages. Add more by adding `.html` files.
- `styles.css`: shared styles, with light and dark themes.
- `main.js`: the theme switch and a click counter.
- `404.html`: shown for paths that don't exist.

## Going further

Add a `package.json` with a `build` script when you want a bundler or TypeScript. Orbit runs the build and
serves what it writes to `dist`.
