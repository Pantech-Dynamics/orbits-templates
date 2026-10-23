// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightVersions from "starlight-versions";

export default defineConfig({
  integrations: [
    starlight({
      title: "Acme SDK",
      description: "Docs for the Acme SDK: install it, configure it, and call the API.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/" }],
      editLink: { baseUrl: "https://github.com/your-org/your-repo/edit/main/" },
      lastUpdated: true,
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
