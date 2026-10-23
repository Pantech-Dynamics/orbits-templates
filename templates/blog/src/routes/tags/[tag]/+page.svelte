<script lang="ts">
  import { SITE } from "#lib/site.ts";
  import PostList from "../../post-list.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>#{data.tag} · {SITE.title}</title>
</svelte:head>

<section class="intro">
  <h1>Posts tagged #{data.tag}</h1>
  <p><a href="/">All writing</a></p>
</section>

<PostList posts={data.posts} />
