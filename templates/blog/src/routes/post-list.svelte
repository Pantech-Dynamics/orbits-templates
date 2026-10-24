<script lang="ts">
  import { formatDate, type Post } from "#lib/posts.ts";

  let { posts }: { posts: Post[] } = $props();
</script>

<ul class="panel posts">
  {#each posts as post, i (post.slug)}
    <li class="reveal" style="--delay: {40 + Math.min(i, 8) * 40}ms">
      <a href="/posts/{post.slug}" class="hoverable">
        <time class="mono" datetime={post.date}>{formatDate(post.date)}</time>
        <span class="post-text">
          <strong>{post.title}</strong>
          <span>{post.description}</span>
        </span>
        <span class="badge plain">{post.minutes} min</span>
      </a>
    </li>
  {/each}
</ul>
