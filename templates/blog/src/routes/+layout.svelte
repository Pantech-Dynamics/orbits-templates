<script lang="ts">
  import "../orbit.css";
  import "../app.css";
  import favicon from "#lib/assets/favicon.svg";
  import { page } from "$app/state";
  import { SITE } from "#lib/site.ts";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
  const current = (href: string) => (page.url.pathname === href ? "page" : undefined);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="alternate" type="application/rss+xml" title={SITE.title} href="/rss.xml" />
</svelte:head>

<header class="bar">
  <div class="bar-row">
    <a href="/" class="brand"><span class="tile solid">{SITE.title.slice(0, 1)}</span>{SITE.title}</a>
    <nav>
      <a href="/" aria-current={current("/")}>Writing</a>
      <a href="/about" aria-current={current("/about")}>About</a>
      <a href="/rss.xml">RSS</a>
    </nav>
  </div>
</header>

<main class="page">
  {@render children()}
</main>

<footer class="foot">
  <span class="tile">{SITE.author.split(" ").map((w) => w[0]).join("")}</span>
  © {new Date().getFullYear()} {SITE.author}
</footer>
