import type { Product } from "@/lib/products";

/** The product's picture until you have photos: its two colours and a glyph. Swap in next/image later. */
export function Tile({ product, large = false }: { product: Product; large?: boolean }) {
  const { from, to, glyph } = product.look;
  return (
    <div className={large ? "tile large" : "tile"} style={{ background: `linear-gradient(145deg, ${from}, ${to})` }} aria-hidden>
      <span>{glyph}</span>
    </div>
  );
}
