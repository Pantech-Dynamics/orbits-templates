import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { naira, productBySlug, PRODUCTS } from "@/lib/products";
import { AddToCart } from "../../_components/add-to-cart";
import { Tile } from "../../_components/tile";

export function generateStaticParams() {
  return PRODUCTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = productBySlug((await params).slug);
  return product ? { title: product.name, description: product.description, openGraph: { title: product.name, description: product.description } } : {};
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = productBySlug((await params).slug);
  if (!product) notFound();
  return (
    <main className="page detail">
      <div className="panel art reveal">
        <Tile product={product} large />
      </div>
      <div className="panel info reveal" style={{ "--delay": "60ms" } as CSSProperties}>
        <Link href="/" className="back">
          ← All products
        </Link>
        <h1 className="heading">{product.name}</h1>
        <p className="price num">{naira(product.price)}</p>
        <span className="badge plain">{product.blurb}</span>
        <p className="description">{product.description}</p>
        <AddToCart slug={product.slug} />
      </div>
    </main>
  );
}
