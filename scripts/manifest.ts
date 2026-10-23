import { z } from "zod";

// templates/<key>/template.json. The folder name is the template's key; the rest describes its card on
// the New project screen and how Orbit runs it. Fields match the API's Template and Workload schemas.

const EnvVar = z.strictObject({
  key: z.string().regex(/^[A-Z][A-Z0-9_]*$/, "Use UPPER_SNAKE_CASE"),
  hint: z.string().max(120).optional(),
});

const Workload = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("static"),
    output_directory: z.string().optional(),
    // Serve index.html for unknown paths, for apps that route in the browser.
    spa_fallback: z.boolean().optional(),
  }),
  z.strictObject({
    type: z.literal("app"),
    port: z.number().int().min(1).max(65535).default(3000),
    health_check_path: z.string().startsWith("/").default("/"),
  }),
  z.strictObject({ type: z.literal("function") }),
]);

export const Manifest = z.strictObject({
  $schema: z.string().optional(),
  name: z.string().min(1).max(40),
  description: z.string().min(1).max(80),
  category: z.enum(["commerce", "content", "apps", "apis"]),
  /** The framework key the API detects and the builder plans with: nextjs, astro, sveltekit, vite, node, html, elysia… */
  framework: z.string().regex(/^[a-z0-9-]+$/),
  framework_label: z.string().min(1).max(30),
  /** Variables the template can't start without; Configure collects them before the first deploy. */
  required_env: z.array(EnvVar).default([]),
  /** Variables it reads when set. Listed in the README; Configure may offer them. */
  optional_env: z.array(EnvVar).default([]),
  /** How it runs. Left out, the API picks the framework's default (Next.js and SvelteKit as functions, node as an app, the rest static). */
  workload: Workload.optional(),
  /** The project's Node.js version when the framework needs a newer one than the API's default (22.x). */
  node_version: z.enum(["22.x", "24.x"]).optional(),
  /** Lower comes first on the New project screen. */
  order: z.number().int().default(100),
});

export type Manifest = z.infer<typeof Manifest>;
