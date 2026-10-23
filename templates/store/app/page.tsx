import Link from "next/link";
import { naira, PRODUCTS } from "@/lib/products";
import { Tile } from "./_components/tile";

export default function Shop() {
  return (
    <main>
      <section className="intro">
        <h1>Coffee, tea and the things you drink them from.</h1>
        <p>Roasted, blended and made in Nigeria. Delivered in two to four days.</p>
      </section>
      <section className="products">
        {PRODUCTS.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="product">
            <Tile product={p} />
            <div className="product-text">
              <h2>{p.name}</h2>
              <p>{p.blurb}</p>
            </div>
            <strong>{naira(p.price)}</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
