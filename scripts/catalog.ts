// Builds catalog.json from templates/*/template.json, the list the API serves as GET /v1/templates.
//   bun run catalog          write it
//   bun run catalog --check  fail if a manifest is invalid or catalog.json is out of date (CI)

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { Manifest } from "./manifest";

const ROOT = join(import.meta.dir, "..");
const TEMPLATES = join(ROOT, "templates");
const OUT = join(ROOT, "catalog.json");
const SCHEMA = join(ROOT, "template.schema.json");
const CATEGORY_ORDER = ["commerce", "content", "apps", "apis"];
const KEY = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const exists = (path: string) => stat(path).then(() => true, () => false);

const problems: string[] = [];
const items = [];

for (const key of (await readdir(TEMPLATES)).sort()) {
  const dir = join(TEMPLATES, key);
  if (!(await stat(dir)).isDirectory()) continue;
  const where = `templates/${key}`;
  if (!KEY.test(key)) problems.push(`${where}: the folder name is the key; use lowercase words joined by hyphens`);

  let manifest;
  try {
    manifest = Manifest.parse(JSON.parse(await readFile(join(dir, "template.json"), "utf8")));
  } catch (error) {
    const detail = error instanceof z.ZodError ? z.prettifyError(error) : (error as Error).message;
    problems.push(`${where}/template.json: ${detail}`);
    continue;
  }

  // The folder becomes the root of a new repository, so it has to stand on its own.
  for (const file of ["README.md", ".gitignore"]) {
    if (!(await exists(join(dir, file)))) problems.push(`${where}: add a ${file}`);
  }
  const pkg = join(dir, "package.json");
  if (manifest.framework === "html") {
    if (!(await exists(join(dir, "index.html"))) && !(await exists(pkg))) problems.push(`${where}: a plain HTML template needs an index.html`);
  } else if (!(await exists(pkg))) {
    problems.push(`${where}: add a package.json`);
  } else {
    const locks = ["package-lock.json", "bun.lock", "pnpm-lock.yaml", "yarn.lock"];
    const deps = JSON.parse(await readFile(pkg, "utf8")).dependencies ?? {};
    const hasLock = (await Promise.all(locks.map((l) => exists(join(dir, l))))).some(Boolean);
    if (Object.keys(deps).length && !hasLock) problems.push(`${where}: commit a lock file so every deploy installs the same versions`);
  }

  const { $schema: _, ...rest } = manifest;
  items.push({ key, path: where, ...rest });
}

items.sort(
  (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || a.order - b.order || a.name.localeCompare(b.name),
);

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n"));
  process.exit(1);
}

// Editors read the schema for autocomplete in template.json.
const outputs = {
  [OUT]: JSON.stringify({ version: 1, items }, null, 2) + "\n",
  [SCHEMA]: JSON.stringify(z.toJSONSchema(Manifest, { io: "input" }), null, 2) + "\n",
};

if (process.argv.includes("--check")) {
  for (const [path, json] of Object.entries(outputs)) {
    if ((await readFile(path, "utf8").catch(() => "")) !== json) {
      console.error(`✗ ${path.slice(ROOT.length + 1)} is out of date. Run \`bun run catalog\` and commit it.`);
      process.exit(1);
    }
  }
  console.log(`✓ ${items.length} templates, catalog.json is up to date`);
} else {
  for (const [path, json] of Object.entries(outputs)) await writeFile(path, json);
  console.log(`✓ Wrote catalog.json with ${items.length} templates`);
}
