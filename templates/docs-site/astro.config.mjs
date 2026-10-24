// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightVersions from "starlight-versions";

const SITE_URL = process.env.SITE_URL?.replace(/\/$/, "");

export default defineConfig({
  // The site's address, for canonical links and link previews. Set SITE_URL in Orbit's environment variables.
  site: SITE_URL,
  integrations: [
    starlight({
      title: "Sahel SDK",
      logo: { src: "./src/assets/logo.svg" },
      description: "Docs for the Sahel SDK: install it, configure it, and call the API.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/" }],
      editLink: { baseUrl: "https://github.com/your-org/your-repo/edit/main/" },
      lastUpdated: true,
      customCss: ["./src/styles/custom.css"],
      head: [
        { tag: "meta", attrs: { property: "og:image", content: `${SITE_URL ?? ""}/og.png` } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "Sahel SDK: call the Sahel API from JavaScript." } },
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true } },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
          },
        },
      ],
      expressiveCode: { styleOverrides: { borderRadius: "0" } },
      plugins: [
        // Each entry is an older version, kept as a snapshot under src/content/docs/<slug>/. To release a new
        // one, add its slug here: the next build copies the current docs into it.
        starlightVersions({ current: { label: "v2" }, versions: [{ slug: "1.0", label: "v1" }] }),
      ],
      sidebar: [
        { label: "Start here", items: ["index", "getting-started"] },
        { label: "Guides", items: [{ autogenerate: { directory: "guides" } }] },
        { label: "Reference", items: [{ autogenerate: { directory: "reference" } }] },
      ],
    }),
  ],
});
