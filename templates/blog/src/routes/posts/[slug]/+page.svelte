<script lang="ts">
  import { formatDate } from "#lib/posts.ts";
  import { SITE } from "#lib/site.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const Content = $derived(data.content);
</script>

<svelte:head>
  <title>{data.post.title} · {SITE.title}</title>
  <meta name="description" content={data.post.description} />
  <meta property="og:title" content={data.post.title} />
  <meta property="og:type" content="article" />
</svelte:head>

<article class="panel post reveal">
  <header class="post-head">
    <p class="meta mono"><time datetime={data.post.date}>{formatDate(data.post.date)}</time> · {data.post.minutes} min read</p>
    <h1 class="title">{data.post.title}</h1>
    <p class="post-tags">
      {#each data.post.tags as tag (tag)}
        <a href="/tags/{tag}" class="badge plain">#{tag}</a>
      {/each}
    </p>
  </header>
  <div class="prose">
    <Content />
  </div>
</article>

<nav class="pager reveal" style="--delay: 80ms" aria-label="More posts">
  {#if data.older}
    <a href="/posts/{data.older.slug}" class="panel hoverable"><span class="label">← Older</span>{data.older.title}</a>
  {:else}<span></span>{/if}
  {#if data.newer}
    <a href="/posts/{data.newer.slug}" class="panel hoverable newer"><span class="label">Newer →</span>{data.newer.title}</a>
  {/if}
</nav>
