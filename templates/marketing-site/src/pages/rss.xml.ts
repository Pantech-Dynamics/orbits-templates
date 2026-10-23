import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE } from "../site";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET({ site, url }: APIContext) {
  const base = site ?? url.origin;
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const items = posts
    .map((p) => {
      const link = new URL(`/blog/${p.id}`, base).href;
      return `<item><title>${escape(p.data.title)}</title><link>${link}</link><guid>${link}</guid><description>${escape(p.data.description)}</description><pubDate>${p.data.date.toUTCString()}</pubDate></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(SITE.name)}</title><link>${new URL("/", base).href}</link><description>${escape(SITE.description)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
