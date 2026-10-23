import type { Component } from "svelte";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  minutes: number;
};

type Module = { default: Component; metadata: Omit<Post, "slug" | "minutes"> & { draft?: boolean } };

// Every Markdown file in src/posts is a post; its file name is its address. mdsvex turns each into a component.
const modules = import.meta.glob<Module>("/src/posts/*.md", { eager: true });
const sources = import.meta.glob<string>("/src/posts/*.md", { eager: true, query: "?raw", import: "default" });

const slugOf = (path: string) => path.split("/").at(-1)!.replace(/\.md$/, "");

export const posts: Post[] = Object.entries(modules)
  .filter(([, m]) => !m.metadata.draft)
  .map(([path, m]) => ({
    slug: slugOf(path),
    title: m.metadata.title,
    description: m.metadata.description,
    date: new Date(m.metadata.date).toISOString(),
    tags: m.metadata.tags ?? [],
    minutes: Math.max(1, Math.round(sources[path].split(/\s+/).length / 230)),
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export const component = (slug: string) => modules[`/src/posts/${slug}.md`]?.default;

export const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();

export const formatDate = (iso: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(iso));
