import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import type { Source } from "@prisma/client";

interface SourceProduct {
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  store: string;
  releaseDate: Date;
}

const parser = new Parser({ timeout: 5000 });

export async function fetchSourceProducts(source: Source): Promise<SourceProduct[]> {
  try {
    if (source.type === "RSS") {
      const feed = await parser.parseURL(source.url);
      return (feed.items ?? []).slice(0, 5).map((item) => ({
        name: item.title ?? "Produto RSS",
        slug: (item.guid ?? item.link ?? "").split("/").pop() ?? "rss-produto",
        brand: source.name,
        category: "ténis",
        price: 0,
        currency: "EUR",
        imageUrl: item.enclosure?.url ?? "https://placehold.co/600x400",
        productUrl: item.link ?? source.url,
        store: source.name,
        releaseDate: item.isoDate ? new Date(item.isoDate) : new Date(),
      }));
    }

    const response = await fetch(source.url);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map((item: any) => ({
      name: item.name ?? "Produto API",
      slug: item.slug ?? item.name?.toLowerCase().replace(/\s+/g, "-") ?? "produto-api",
      brand: item.brand ?? source.name,
      category: item.category ?? "ténis",
      price: item.price ?? 0,
      currency: item.currency ?? "EUR",
      imageUrl: item.imageUrl ?? "https://placehold.co/600x400",
      productUrl: item.productUrl ?? source.url,
      store: item.store ?? source.name,
      releaseDate: item.releaseDate ? new Date(item.releaseDate) : new Date(),
    }));
  } catch (error) {
    console.error("Erro a testar fonte", error);
    return [];
  }
}

export async function ingestSources() {
  const sources = await prisma.source.findMany({ where: { enabled: true } });
  for (const source of sources) {
    const products = await fetchSourceProducts(source);
    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          currency: product.currency,
          imageUrl: product.imageUrl,
          productUrl: product.productUrl,
          store: product.store,
          releaseDate: product.releaseDate,
        },
        create: {
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          currency: product.currency,
          imageUrl: product.imageUrl,
          productUrl: product.productUrl,
          store: product.store,
          releaseDate: product.releaseDate,
          visible: false,
        },
      });
    }
  }
}
