# Blog

A blog built with [SvelteKit](https://svelte.dev/docs/kit). Posts are Markdown files; tags, an RSS feed and
reading times come for free.

## Writing a post

Add a Markdown file to `src/posts/`. Its file name is its address (`small-tools.md` is `/posts/small-tools`),
and the front matter describes it:

```md
---
title: In praise of small tools
description: The best software I use does one thing and gets out of the way.
date: 2026-10-12
tags: [craft, tools]
draft: false
---
```

[mdsvex](https://mdsvex.pngwn.io) compiles each post into a Svelte component, so a post can import and use
components when Markdown isn't enough.

## Make it yours

- The blog's name, description and author are in `src/lib/site.ts`.
- Styles: `src/orbit.css` is Orbit's tokens and components (panels, buttons, badges, light and dark), shared by
  every Orbit template; `src/app.css` is this blog's layout on top of it.
- `src/routes/about/+page.md` is a Markdown page outside the blog; add more the same way.

## Run it locally

```sh
npm install
npm run dev
```

Every page is built ahead of time (`prerender` in `src/routes/+layout.ts`), and `@sveltejs/adapter-node` serves
them, so you can still add a server route when you need one. Orbit runs `npm run build`, then `node build`.
The RSS feed is the one route rendered per request, so its links use whatever address the blog is served at.
