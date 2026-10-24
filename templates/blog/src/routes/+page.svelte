<script lang="ts">
  import { SITE } from "#lib/site.ts";
  import PostList from "./post-list.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{SITE.title}</title>
  <meta name="description" content={SITE.description} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={SITE.title} />
  <meta property="og:description" content={SITE.description} />
</svelte:head>

<section class="panel intro reveal">
  <p class="eyebrow">{SITE.title} · by {SITE.author}</p>
  <h1 class="title">{SITE.description}</h1>
</section>

<PostList posts={data.posts} />

<aside class="panel tags reveal" style="--delay: 200ms" aria-label="Tags">
  <span class="label">Tags</span>
  {#each data.tags as tag (tag)}
    <a href="/tags/{tag}" class="badge plain">#{tag}</a>
  {/each}
</aside>
