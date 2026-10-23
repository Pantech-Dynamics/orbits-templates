import { error } from "@sveltejs/kit";
import { posts, tags } from "#lib/posts.ts";
import type { EntryGenerator, PageLoad } from "./$types";

export const entries: EntryGenerator = () => tags.map((tag) => ({ tag }));

export const load: PageLoad = ({ params }) => {
  const tagged = posts.filter((p) => p.tags.includes(params.tag));
  if (!tagged.length) error(404, "No posts with that tag");
  return { tag: params.tag, posts: tagged };
};
