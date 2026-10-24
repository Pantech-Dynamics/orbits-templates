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

export function Layout({ title, origin, children }: { title: string; origin: string; children?: JSX.Element | JSX.Element[] }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title safe>{title}</title>
        <meta name="description" content="Server-rendered pages with Elysia, JSX and htmx." />
        <meta name="htmx-config" content={HTMX_CONFIG} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Server-rendered pages with Elysia, JSX and htmx." />
        <meta property="og:image" content={`${origin}/public/og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Tasks: server-rendered, swapped in by htmx." />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/public/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <link rel="stylesheet" href="/public/orbit.css" />
        <link rel="stylesheet" href="/public/styles.css" />
        <script src="/htmx.min.js" defer></script>
      </head>
      <body class="ground">{children as "safe"}</body>
    </html>
  );
}
