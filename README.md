# Orbits templates

The starters on Orbit's New project screen. Picking one creates a repository in your GitHub account from its
folder here, and deploys it.

| | Template | Stack |
| --- | --- | --- |
| Commerce | [Store](templates/store) | Next.js + Paystack |
| | [Events page](templates/events-page) | SvelteKit |
| Content | [Marketing site](templates/marketing-site) | Astro |
| | [Docs site](templates/docs-site) | Astro + Starlight |
| | [Blog](templates/blog) | SvelteKit |
| | [Portfolio](templates/portfolio) | Next.js |
| Apps | [Web app](templates/web-app) | Vite + React |
| | [Admin dashboard](templates/admin-dashboard) | Vite + React |
| | [Elysia + htmx](templates/elysia-htmx) | Elysia on Bun |
| | [Static site](templates/static-site) | HTML |
| APIs | [Elysia API](templates/elysia-api) | Elysia on Bun |
| | [API](templates/api) | Node.js + Postgres |
| | [Webhook receiver](templates/webhook-receiver) | Node.js |
| | [Waitlist](templates/waitlist) | Node.js |

## How it fits together

- Each template has a `template.json` manifest: its card, the env it needs and how it runs.
- `bun run catalog` validates every manifest and writes `catalog.json`, which the Orbit API serves as
  `GET /v1/templates`. Adding a template is adding a folder; nothing else changes.
- `bun run verify` copies each template to an empty folder and installs, builds and starts it the way Orbit's
  builder does. CI runs it for every template on every change.

See [CONTRIBUTING.md](CONTRIBUTING.md) to add one.
