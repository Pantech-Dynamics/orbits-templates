<script lang="ts">
  import { SITE } from "#lib/site.ts";
  import PostList from "./post-list.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{SITE.title}</title>
  <meta name="description" content={SITE.description} />
</svelte:head>

<section class="intro">
  <h1>{SITE.description}</h1>
</section>

<PostList posts={data.posts} />

<aside class="tags">
  {#each data.tags as tag (tag)}
    <a href="/tags/{tag}">#{tag}</a>
  {/each}
</aside>
