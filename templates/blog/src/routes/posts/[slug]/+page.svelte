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

<article>
  <header class="post-head">
    <small><time datetime={data.post.date}>{formatDate(data.post.date)}</time> · {data.post.minutes} min read</small>
    <h1>{data.post.title}</h1>
    <p class="tags">
      {#each data.post.tags as tag (tag)}
        <a href="/tags/{tag}">#{tag}</a>
      {/each}
    </p>
  </header>
  <div class="prose">
    <Content />
  </div>
</article>

<nav class="pager">
  {#if data.older}<a href="/posts/{data.older.slug}">← {data.older.title}</a>{:else}<span></span>{/if}
  {#if data.newer}<a href="/posts/{data.newer.slug}">{data.newer.title} →</a>{/if}
</nav>
