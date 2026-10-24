# Adding a template

A template is a folder under `templates/`. The folder name is its key: lowercase words joined by hyphens,
never changed once it's published, because projects remember which template they came from.

1. **Make the app.** Start from the framework's own scaffolder so its config matches its current version
   (`npm create vite`, `npm create astro`, `npx sv create`, `npx create-next-app`, `bun create elysia`…).
2. **Make it stand alone.** The folder becomes the root of a new repository, so it needs its own
   `README.md`, `.gitignore` and lock file, and nothing that reaches outside the folder.
3. **Add `template.json`.** Your editor completes it from `template.schema.json`:

   ```json
   {
     "$schema": "../../template.schema.json",
     "name": "Elysia API",
     "description": "Typed routes, validation and OpenAPI docs on Bun",
     "category": "apis",
     "framework": "elysia",
     "framework_label": "Elysia",
     "required_env": [{ "key": "DATABASE_URL", "hint": "Your Postgres connection string." }],
     "workload": { "type": "app", "port": 3000, "health_check_path": "/health" }
   }
   ```

   | Field | |
   | --- | --- |
   | `name`, `description` | The card on the New project screen. |
   | `category` | `commerce`, `content`, `apps` or `apis`: the tab it's listed under. |
   | `framework`, `framework_label` | The key Orbit plans the build with (`nextjs`, `astro`, `sveltekit`, `vite`, `node`, `html`, `elysia`…) and how the card names the stack. |
   | `required_env` | Variables the template can't start without. Configure asks for them before the first deploy. |
   | `optional_env` | Variables it reads when they're set. |
   | `workload` | How it runs: `{ "type": "app", "port", "health_check_path" }` for a server, `{ "type": "static", "output_directory", "spa_fallback" }` for files. Leave it out to get the framework's default. |
   | `node_version` | `"24.x"` when the framework needs newer than Node 22. |
   | `order` | Lower comes first within its category. |

4. **Check it.**

   ```sh
   bun install
   bun run catalog           # validates every manifest, writes catalog.json
   bun run verify <key>      # copies it to an empty folder, installs, builds and starts it like Orbit
   ```

   A template that reads `DATABASE_URL` is verified against Postgres in CI; locally, set `DATABASE_URL` before
   `verify`.

5. **Commit `catalog.json`** with the template. CI fails when it's out of date.

## What makes a good template

- **It deploys with nothing set** unless it truly can't (Store needs Paystack). Prefer optional env with a
  sensible fallback, and say what the fallback is.
- **It does something real.** A working app someone could ship after changing the words, not a hello world.
- **It's honest about its limits.** If data lives in memory, the README says it resets on every deploy and how
  to keep it.
- **Orbit's look.** Copy `kit/orbit.css` in as `orbit.css` and build on its tokens and parts (`panel`, `btn`,
  `badge`, `tile`, `segmented`, `reveal`, `rise`): square corners, Hanken Grotesk and JetBrains Mono, light and
  dark, readable at phone width. Keep the template's own CSS to layout.
- **A link preview.** Add the template's card to `og/cards.ts`, run `bun run og`, and point `og:image` at it,
  as a full address when `SITE_URL` is set (or from the request, for a server).
- **Motion that earns its place**: the kit's load reveal staggered 40ms apart, presses and hover tints, nothing
  on what people do all day, and every start state inside `prefers-reduced-motion: no-preference`.
- **No borrowed placeholder brands.** Invent a name (Sahel, Kola Goods, Field Notes) rather than reuse one
  another platform made famous.
- **A README** that says what it is, how to make it yours, its environment, and how Orbit runs it.
