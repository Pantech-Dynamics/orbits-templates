// Copies kit/orbit.css into every template that carries an orbit.css, so they all share one look.
//   bun run kit           copy it
//   bun run kit --check   fail if any copy differs (CI, through `bun run check`)

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..");
const KIT = join(ROOT, "kit", "orbit.css");
const SKIP = new Set(["node_modules", ".next", ".svelte-kit", ".astro", "dist", "build", ".git"]);

async function copiesIn(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name) || entry.name.startsWith(".")) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await copiesIn(path)));
    else if (entry.name === "orbit.css") out.push(path);
  }
  return out;
}

export async function syncKit(check: boolean) {
  const kit = await readFile(KIT, "utf8");
  const copies = await copiesIn(join(ROOT, "templates"));
  const stale: string[] = [];
  for (const path of copies) {
    if ((await readFile(path, "utf8")) === kit) continue;
    if (check) stale.push(relative(ROOT, path));
    else await writeFile(path, kit);
  }
  return { copies: copies.length, stale };
}

if (import.meta.main) {
  const check = process.argv.includes("--check");
  const { copies, stale } = await syncKit(check);
  if (stale.length) {
    console.error(`✗ orbit.css differs from kit/orbit.css in:\n  ${stale.join("\n  ")}\nRun \`bun run kit\`.`);
    process.exit(1);
  }
  console.log(check ? `✓ ${copies} copies of orbit.css match the kit` : `✓ Copied the kit into ${copies} templates`);
}
