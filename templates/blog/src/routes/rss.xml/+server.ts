import { posts } from "#lib/posts.ts";
import { SITE } from "#lib/site.ts";
import type { RequestHandler } from "./$types";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Rendered per request, so links use the address the reader came in on (behind Orbit's proxy, via its headers).
export const prerender = false;

export const GET: RequestHandler = ({ url, request }) => {
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.slice(0, -1);
  const origin = `${proto}://${request.headers.get("x-forwarded-host") ?? url.host}`;
  const items = posts
    .map((p) => {
      const link = `${origin}/posts/${p.slug}`;
      return `<item><title>${escape(p.title)}</title><link>${link}</link><guid>${link}</guid><description>${escape(p.description)}</description><pubDate>${new Date(p.date).toUTCString()}</pubDate></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(SITE.title)}</title><link>${origin}</link><description>${escape(SITE.description)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
