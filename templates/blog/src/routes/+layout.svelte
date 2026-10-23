<script lang="ts">
  import "../app.css";
  import favicon from "#lib/assets/favicon.svg";
  import { SITE } from "#lib/site.ts";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="alternate" type="application/rss+xml" title={SITE.title} href="/rss.xml" />
</svelte:head>

<div class="page">
  <header>
    <a href="/" class="title">{SITE.title}</a>
    <nav>
      <a href="/">Writing</a>
      <a href="/about">About</a>
      <a href="/rss.xml">RSS</a>
    </nav>
  </header>

  <main>
    {@render children()}
  </main>

  <footer>© {new Date().getFullYear()} {SITE.author}</footer>
</div>
