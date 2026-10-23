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
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = productBySlug((await params).slug);
  if (!product) notFound();
  return (
    <main className="detail">
      <Tile product={product} large />
      <div>
        <Link href="/" className="back">
          ← All products
        </Link>
        <h1>{product.name}</h1>
        <p className="price">{naira(product.price)}</p>
        <p className="muted">{product.blurb}</p>
        <p>{product.description}</p>
        <AddToCart slug={product.slug} />
      </div>
    </main>
  );
}
