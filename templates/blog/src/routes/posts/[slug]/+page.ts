import { error } from "@sveltejs/kit";
import { component, posts } from "#lib/posts.ts";
import type { EntryGenerator, PageLoad } from "./$types";

export const entries: EntryGenerator = () => posts.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
  const index = posts.findIndex((p) => p.slug === params.slug);
  const content = component(params.slug);
  if (index === -1 || !content) error(404, "No post here");
  return { post: posts[index], content, newer: posts[index - 1] ?? null, older: posts[index + 1] ?? null };
};
