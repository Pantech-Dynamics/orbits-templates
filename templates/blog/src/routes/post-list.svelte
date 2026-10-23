<script lang="ts">
  import { formatDate, type Post } from "#lib/posts.ts";

  let { posts }: { posts: Post[] } = $props();
</script>

<ul class="posts">
  {#each posts as post (post.slug)}
    <li>
      <a href="/posts/{post.slug}">
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <small><time datetime={post.date}>{formatDate(post.date)}</time> · {post.minutes} min read</small>
      </a>
    </li>
  {/each}
</ul>
