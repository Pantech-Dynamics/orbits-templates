// Draws each template's Open Graph image (og/cards.ts) in Orbit's look and writes it into the template.
//   bun run og            every template
//   bun run og <key>      one
// Renders with the Chrome installed on this machine, so it isn't part of CI; commit the PNGs it writes.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { CARDS, type Card, type Row } from "../og/cards";

const ROOT = join(import.meta.dir, "..");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function row(r: Row) {
  return `<li>
    ${r.tile !== undefined ? `<span class="tile">${esc(r.tile)}</span>` : ""}
    <span class="row-label">${esc(r.label)}${r.note ? ` <span class="muted">${esc(r.note)}</span>` : ""}</span>
    ${r.badge ? `<span class="badge ${r.badge[1]}">${esc(r.badge[0])}</span>` : ""}
    ${r.value ? `<span class="num value">${esc(r.value)}</span>` : ""}
  </li>`;
}

function page(card: Card, kit: string) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=block">
<style>${kit}
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { display: grid; padding: 32px; }
.reveal, .rise { animation: none !important; transition: none !important; }
.card { display: grid; grid-template-columns: 1fr 470px; height: 566px; }
.copy { display: flex; flex-direction: column; padding: 48px 52px; }
.brand { display: flex; align-items: center; gap: 14px; font-size: 26px; font-weight: 600; }
.brand .tile { width: 44px; height: 44px; font-size: ${card.mark.length > 1 ? 16 : 20}px; }
h1 { margin: auto 0 0; font-size: ${card.title.length > 34 ? 58 : 68}px; font-weight: 700; line-height: 1.04; letter-spacing: -0.035em; text-wrap: balance; }
.tagline { margin: 22px 0 0; color: var(--grey-600); font-size: 24px; line-height: 1.4; text-wrap: pretty; }
.art { display: grid; place-items: center; padding: 40px; border-left: 1px solid var(--line); background-color: var(--surface); }
.mini { width: 100%; box-shadow: 0 18px 40px -22px rgb(0 0 0 / 0.3); }
.mini .panel-head { justify-content: space-between; padding: 14px 18px; font-size: 15px; }
.mini .panel-head span:first-child { font-family: ${card.panel.startsWith("npm ") ? "var(--font-code)" : "inherit"}; }
.mini ul { margin: 0; padding: 0; list-style: none; }
.mini li { display: flex; align-items: center; gap: 12px; padding: 15px 18px; border-top: 1px solid var(--line); font-size: 16px; }
.mini li:first-child { border-top: 0; }
.mini .tile { width: 30px; height: 30px; font-size: 12px; }
.row-label { flex: 1; min-width: 0; overflow: hidden; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.row-label .muted { font-weight: 400; }
.badge { font-size: 13px; padding: 3px 9px; }
.badge::before { width: 7px; height: 7px; }
.value { color: var(--grey-600); font-size: 15px; }
</style></head>
<body class="ground hatch">
  <main class="panel card">
    <section class="copy">
      <p class="brand"><span class="tile solid">${esc(card.mark)}</span>${esc(card.brand)}</p>
      <h1>${esc(card.title)}</h1>
      <p class="tagline">${esc(card.tagline)}</p>
    </section>
    <aside class="art hatch">
      <div class="panel mini">
        <div class="panel-head"><span>${esc(card.panel)}</span>${card.aside ? `<span class="badge ${card.aside[1]}">${esc(card.aside[0])}</span>` : ""}</div>
        <ul>${card.rows.map(row).join("")}</ul>
      </div>
    </aside>
  </main>
</body></html>`;
}

const only = process.argv[2];
const keys = only ? [only] : Object.keys(CARDS);
if (only && !CARDS[only]) throw new Error(`No card for ${only}. Cards: ${Object.keys(CARDS).join(", ")}`);

const kit = await readFile(join(ROOT, "kit", "orbit.css"), "utf8");
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, colorScheme: "light" });
const tab = await ctx.newPage();
for (const key of keys) {
  const card = CARDS[key];
  await tab.setContent(page(card, kit), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  const out = join(ROOT, "templates", key, card.out);
  await tab.screenshot({ path: out, type: "png" });
  console.log(`✓ ${key}: ${card.out}`);
}
await browser.close();
