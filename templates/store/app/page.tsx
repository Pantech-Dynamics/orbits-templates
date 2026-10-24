import type { CSSProperties } from "react";
import Link from "next/link";
import { naira, PRODUCTS } from "@/lib/products";
import { Tile } from "./_components/tile";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function Shop() {
  return (
    <main className="page">
      <section className="panel intro">
        <p className="eyebrow reveal">
          <span className="badge green">Roasted this Monday</span>
          Made in Nigeria
        </p>
        <h1 className="title reveal" style={delay(40)}>
          Coffee, tea and the things you drink them from.
        </h1>
        <p className="lede reveal" style={delay(80)}>
          Roasted, blended and made in Nigeria. Delivered in two to four days.
        </p>
      </section>
      <section className="products">
        {PRODUCTS.map((p, i) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="panel product reveal" style={delay(120 + i * 40)}>
            <Tile product={p} />
            <div className="product-text">
              <h2>{p.name}</h2>
              <p>{p.blurb}</p>
            </div>
            <strong className="num">{naira(p.price)}</strong>
          </Link>
        ))}
      </section>
    </main>
  );
}
