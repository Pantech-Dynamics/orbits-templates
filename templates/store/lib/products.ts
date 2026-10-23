// The catalogue. Prices are in kobo (₦1 = 100 kobo), which is what Paystack expects, so there's no rounding.
// Checkout reprices every order from this list on the server; prices from the browser are never trusted.

export type Product = {
  slug: string;
  name: string;
  price: number;
  blurb: string;
  description: string;
  /** Two colours and a glyph for the product's tile, so there's nothing to upload to start with. */
  look: { from: string; to: string; glyph: string };
};

export const PRODUCTS: Product[] = [
  {
    slug: "house-blend-coffee",
    name: "House blend coffee",
    price: 850_000,
    blurb: "Medium roast, 500 g",
    description: "Beans from the Mambilla Plateau, roasted in Lagos every Monday. Chocolate, orange peel and a clean finish.",
    look: { from: "#7c2d12", to: "#fdba74", glyph: "☕" },
  },
  {
    slug: "hibiscus-tea",
    name: "Hibiscus tea",
    price: 450_000,
    blurb: "Loose leaf, 200 g",
    description: "Dried zobo petals with ginger and clove. Brew it hot, or cold overnight in the fridge.",
    look: { from: "#9d174d", to: "#f9a8d4", glyph: "🌺" },
  },
  {
    slug: "stoneware-mug",
    name: "Stoneware mug",
    price: 1_200_000,
    blurb: "Hand-thrown, 350 ml",
    description: "Thrown and glazed by hand in Abuja, so no two are quite alike. Dishwasher safe.",
    look: { from: "#334155", to: "#cbd5e1", glyph: "🍵" },
  },
  {
    slug: "canvas-tote",
    name: "Canvas tote",
    price: 650_000,
    blurb: "Heavy cotton, long handles",
    description: "Strong enough for a week of shopping, with an inside pocket for your keys.",
    look: { from: "#3f6212", to: "#d9f99d", glyph: "👜" },
  },
  {
    slug: "pour-over-set",
    name: "Pour-over set",
    price: 2_400_000,
    blurb: "Dripper, carafe and filters",
    description: "Everything you need for a slow, careful cup: a ceramic dripper, a glass carafe and 100 filters.",
    look: { from: "#1e3a8a", to: "#93c5fd", glyph: "⚗️" },
  },
  {
    slug: "gift-card",
    name: "Gift card",
    price: 1_000_000,
    blurb: "₦10,000, emailed",
    description: "Sent by email within the hour, and good for a year on anything in the shop.",
    look: { from: "#6b21a8", to: "#e9d5ff", glyph: "🎁" },
  },
];

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const naira = (kobo: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);

export type Line = { slug: string; quantity: number };

/** The order's lines and total from the catalogue, ignoring anything unknown. */
export function price(lines: Line[]) {
  const priced = lines
    .map((l) => ({ product: productBySlug(l.slug), quantity: Math.min(Math.max(Math.floor(l.quantity), 0), 20) }))
    .filter((l): l is { product: Product; quantity: number } => Boolean(l.product) && l.quantity > 0);
  return { lines: priced, total: priced.reduce((sum, l) => sum + l.product.price * l.quantity, 0) };
}
