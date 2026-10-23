// Checks that a template deploys the way Orbit's builder will run it, from a copy that stands alone:
//   bun run verify <key>     one template
//   bun run verify           every template
// Install with the lock file's package manager (frozen), run the build script, then start an app and wait for
// its health check, or look for index.html in a static site's output directory.

import { cp, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Manifest } from "./manifest";

const ROOT = join(import.meta.dir, "..");
const exists = (p: string) => stat(p).then(() => true, () => false);
const STATIC_OUTPUTS: Record<string, string> = { vite: "dist", astro: "dist" };
const FUNCTION_FRAMEWORKS = new Set(["nextjs", "sveltekit"]);

async function run(cmd: string, cwd: string, env: Record<string, string> = {}) {
  const proc = Bun.spawn(["sh", "-c", cmd], { cwd, env: { ...process.env, ...env }, stdout: "pipe", stderr: "pipe" });
  const [out, err, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
  if (code !== 0) throw new Error(`\`${cmd}\` failed (${code})\n${(out + err).trim().split("\n").slice(-25).join("\n")}`);
}

async function installCommand(dir: string) {
  if (await exists(join(dir, "bun.lock"))) return "bun install --frozen-lockfile";
  if (await exists(join(dir, "pnpm-lock.yaml"))) return "pnpm install --frozen-lockfile";
  if (await exists(join(dir, "package-lock.json"))) return "npm ci";
  return "npm install";
}

async function verify(key: string, port: number) {
  const source = join(ROOT, "templates", key);
  const manifest = Manifest.parse(JSON.parse(await readFile(join(source, "template.json"), "utf8")));
  const dir = await mkdtemp(join(tmpdir(), `template-${key}-`));
  const started = performance.now();
  try {
    await cp(source, dir, { recursive: true, filter: (p) => !/\/(node_modules|dist|build|\.next|\.svelte-kit|\.astro)(\/|$)/.test(p) });
    const pkgPath = join(dir, "package.json");
    const pkg = (await exists(pkgPath)) ? JSON.parse(await readFile(pkgPath, "utf8")) : null;
    const runner = (await exists(join(dir, "bun.lock"))) ? "bun" : "npm";

    if (pkg) {
      await run(await installCommand(dir), dir);
      if (pkg.scripts?.build) await run(`${runner} run build`, dir, { NODE_ENV: "production" });
    }

    const workload = manifest.workload ?? (manifest.framework === "node" ? { type: "app" as const } : FUNCTION_FRAMEWORKS.has(manifest.framework) ? { type: "function" as const } : { type: "static" as const });
    if (workload.type === "static") {
      const out = workload.output_directory ?? (pkg?.scripts?.build ? (STATIC_OUTPUTS[manifest.framework] ?? "dist") : ".");
      if (!(await exists(join(dir, out, "index.html")))) throw new Error(`No index.html in ${out} after the build`);
      return `static, ${out}/index.html`;
    }

    // An app or a function: started with its start script, on PORT, with what the builder sets.
    const health = "health_check_path" in workload ? workload.health_check_path : "/";
    const env: Record<string, string | undefined> = { ...process.env, NODE_ENV: "production", PORT: String(port), HOST: "0.0.0.0", HOSTNAME: "0.0.0.0" };
    // A real value from the environment when there is one (CI runs Postgres for DATABASE_URL), else a stand-in.
    for (const v of manifest.required_env) env[v.key] ??= `verify-${v.key.toLowerCase()}`;
    const app = Bun.spawn(["sh", "-c", "exec npm run start"], { cwd: dir, env, stdout: "pipe", stderr: "pipe" });
    try {
      for (let i = 0; i < 60; i++) {
        if (app.exitCode !== null) throw new Error(`The app exited with code ${app.exitCode} before answering`);
        const res = await fetch(`http://127.0.0.1:${port}${health}`).catch(() => null);
        if (res?.ok) return `${workload.type}, ${health} answered ${res.status}`;
        if (res && res.status >= 500) throw new Error(`${health} answered ${res.status}`);
        await Bun.sleep(500);
      }
      throw new Error(`${health} didn't answer within 30s`);
    } catch (error) {
      app.kill();
      const log = (await Promise.all([new Response(app.stdout).text(), new Response(app.stderr).text()]).catch(() => [])).join("\n");
      throw new Error(`${(error as Error).message}\n${log.trim().split("\n").slice(-15).join("\n")}`);
    } finally {
      app.kill();
      await app.exited;
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
    console.log(`  ${key}: ${Math.round((performance.now() - started) / 1000)}s`);
  }
}

const catalog = JSON.parse(await readFile(join(ROOT, "catalog.json"), "utf8")) as { items: { key: string }[] };
const keys = process.argv.slice(2).length ? process.argv.slice(2) : catalog.items.map((i) => i.key);
let failed = 0;
for (const [i, key] of keys.entries()) {
  try {
    console.log(`✓ ${key}: ${await verify(key, 4100 + i)}`);
  } catch (error) {
    failed++;
    console.error(`✗ ${key}: ${(error as Error).message}`);
  }
}
process.exit(failed ? 1 : 0);
