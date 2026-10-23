import { Html } from "@elysia/html";

// htmx swaps 422 responses too, so a form can show its own error in place.
const HTMX_CONFIG = JSON.stringify({
  responseHandling: [
    { code: "204", swap: false },
    { code: "[23]..", swap: true },
    { code: "422", swap: true },
    { code: "[45]..", swap: false, error: true },
  ],
});

export function Layout({ title, children }: { title: string; children?: JSX.Element | JSX.Element[] }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title safe>{title}</title>
        <meta name="description" content="Server-rendered pages with Elysia, JSX and htmx." />
        <meta name="htmx-config" content={HTMX_CONFIG} />
        <link rel="icon" href="/public/favicon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/public/styles.css" />
        <script src="/htmx.min.js" defer></script>
      </head>
      <body>{children as "safe"}</body>
    </html>
  );
}
