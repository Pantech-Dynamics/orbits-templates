// What each template's Open Graph image says: its own brand, headline and a few rows of what the site shows.
// Keep in step with the template's copy; `bun run og` draws them all again.

export type Tone = "green" | "amber" | "red" | "accent" | "plain";
export type Row = { tile?: string; label: string; note?: string; badge?: [string, Tone]; value?: string };

export type Card = {
  /** Where the PNG goes, relative to the template, and so where the site serves /og.png from. */
  out: string;
  brand: string;
  mark: string;
  title: string;
  tagline: string;
  panel: string;
  aside?: [string, Tone];
  rows: Row[];
};

export const CARDS: Record<string, Card> = {
  "static-site": {
    out: "og.png",
    brand: "Static site",
    mark: "S",
    title: "No build step. No framework. Just files.",
    tagline: "Plain HTML, CSS and JavaScript, served as they are.",
    panel: "What happens when you push",
    rows: [
      { tile: "1", label: "git push", note: "to main", badge: ["0s", "plain"] },
      { tile: "2", label: "Orbit copies the files", badge: ["Deploying", "amber"] },
      { tile: "3", label: "The new version is live", badge: ["Ready", "green"] },
    ],
  },
  waitlist: {
    out: "public/og.png",
    brand: "Your product",
    mark: "N",
    title: "Something new is on its way.",
    tagline: "Leave your email and we'll tell you the moment it's ready.",
    panel: "Waitlist",
    aside: ["Coming soon", "accent"],
    rows: [
      { label: "One email, on launch day", badge: ["When", "plain"] },
      { label: "Your address, nothing else", badge: ["What", "plain"] },
      { label: "Leave whenever you like", badge: ["After", "plain"] },
    ],
  },
  "web-app": {
    out: "public/og.png",
    brand: "Notes",
    mark: "N",
    title: "Notes, saved as you type.",
    tagline: "A single-page app: every page after the first loads without a trip to the server.",
    panel: "All notes",
    aside: ["3 notes", "plain"],
    rows: [
      { tile: "W", label: "Welcome", value: "2:14 PM" },
      { tile: "L", label: "Launch checklist", value: "1:15 PM" },
      { tile: "I", label: "Ideas", value: "Yesterday" },
    ],
  },
  "admin-dashboard": {
    out: "public/og.png",
    brand: "Dashboard",
    mark: "D",
    title: "Revenue, orders and customers at a glance.",
    tagline: "Tables that sort and search, charts in plain SVG, and a sign-in in front.",
    panel: "Overview",
    aside: ["30 days", "plain"],
    rows: [
      { label: "Revenue", badge: ["▲ 12%", "green"], value: "₦9,891,600" },
      { label: "Orders", badge: ["220 pending", "amber"], value: "900" },
      { label: "Average order", value: "₦79,095" },
      { label: "Customers", badge: ["48 paid", "green"], value: "48" },
    ],
  },
  "elysia-htmx": {
    out: "public/og.png",
    brand: "Tasks",
    mark: "T",
    title: "Server-rendered, swapped in by htmx.",
    tagline: "Elysia and JSX on Bun, with about 16 KB of JavaScript in the browser.",
    panel: "To do",
    aside: ["2 tasks left", "accent"],
    rows: [
      { tile: "✓", label: "Read the README", badge: ["Done", "green"] },
      { tile: " ", label: "Change a component in src/components" },
      { tile: " ", label: "Push and watch it deploy" },
    ],
  },
  "marketing-site": {
    out: "public/og.png",
    brand: "Sahel",
    mark: "S",
    title: "Invoices that get paid on time",
    tagline: "Sahel sends your invoices, chases late payers and reconciles every payment.",
    panel: "Invoices",
    aside: ["₦1.67M paid this week", "green"],
    rows: [
      { tile: "BA", label: "Baobab & Co", badge: ["Paid", "green"], value: "₦420,000" },
      { tile: "SA", label: "Savanna Labs", badge: ["Reminder sent", "accent"], value: "₦185,500" },
      { tile: "NO", label: "Northwind", badge: ["Due in 3 days", "amber"], value: "₦96,000" },
    ],
  },
  "docs-site": {
    out: "public/og.png",
    brand: "Sahel SDK",
    mark: "S",
    title: "Call the Sahel API from JavaScript.",
    tagline: "With types, retries and webhooks built in. Search every page with /.",
    panel: "npm install @sahel/sdk",
    aside: ["v2", "accent"],
    rows: [
      { tile: "01", label: "Getting started" },
      { tile: "02", label: "Configuration" },
      { tile: "03", label: "Webhooks" },
      { tile: "04", label: "Errors" },
    ],
  },
  blog: {
    out: "static/og.png",
    brand: "Field Notes",
    mark: "F",
    title: "Writing about building small, useful things.",
    tagline: "Posts in Markdown, with tags and an RSS feed.",
    panel: "Latest",
    rows: [
      { label: "What I learned writing every week for a year", value: "20 Oct" },
      { label: "In praise of small tools", value: "12 Oct" },
      { label: "Hello, world", value: "1 Oct" },
    ],
  },
  "events-page": {
    out: "static/og.png",
    brand: "Build Africa 2026",
    mark: "B",
    title: "Build Africa 2026",
    tagline: "Two days of talks and workshops for people who build software. 20–21 November, Lagos.",
    panel: "Day 1",
    aside: ["Free places left", "amber"],
    rows: [
      { tile: "AE", label: "Payments at the scale of a continent", value: "09:30" },
      { tile: "KM", label: "Your database is slower than you think", value: "10:30" },
      { tile: "ZB", label: "Offline-first with service workers", badge: ["Workshop", "accent"], value: "11:30" },
    ],
  },
  portfolio: {
    out: "public/og.png",
    brand: "Ada Okafor",
    mark: "AO",
    title: "I design calm software for busy people.",
    tagline: "Product designer in Lagos: banking apps, booking tools and the dashboards behind them.",
    panel: "Selected work",
    aside: ["Available", "green"],
    rows: [
      { tile: "K", label: "Saving made a habit", badge: ["+38% deposits", "green"] },
      { tile: "S", label: "Booking a doctor in one minute", badge: ["12 → 3 screens", "accent"] },
      { tile: "N", label: "A dashboard dispatchers trust", badge: ["400 vans", "plain"] },
    ],
  },
  store: {
    out: "public/og.png",
    brand: "Kola Goods",
    mark: "K",
    title: "Coffee, tea and the things you drink them from.",
    tagline: "Roasted, blended and made in Nigeria. Delivered in two to four days.",
    panel: "In the shop",
    aside: ["Roasted this Monday", "green"],
    rows: [
      { tile: "☕", label: "House blend coffee", value: "₦8,500" },
      { tile: "🌺", label: "Hibiscus tea", value: "₦4,500" },
      { tile: "🍵", label: "Stoneware mug", value: "₦12,000" },
    ],
  },
};
