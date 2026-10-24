<script lang="ts">
  import { SITE } from "#lib/site.ts";
  import PostList from "../../post-list.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>#{data.tag} · {SITE.title}</title>
</svelte:head>

<section class="panel intro tagged reveal">
  <h1 class="heading">Posts tagged <span class="badge accent">#{data.tag}</span></h1>
  <a href="/">All writing</a>
</section>

<PostList posts={data.posts} />
