import { prisma } from "@/lib/prisma";

export interface ReleaseFilters {
  page?: number;
  q?: string;
  brand?: string;
  category?: string;
  store?: string;
  priceMin?: number;
  priceMax?: number;
  recent?: boolean;
}

const PAGE_SIZE = 12;

export async function listReleases(filters: ReleaseFilters) {
  const where = {
    visible: true,
    name: filters.q
      ? {
          contains: filters.q,
          mode: "insensitive" as const,
        }
      : undefined,
    brand: filters.brand ?? undefined,
    category: filters.category ?? undefined,
    store: filters.store ?? undefined,
    price: filters.priceMin || filters.priceMax ? {
      gte: filters.priceMin ?? undefined,
      lte: filters.priceMax ?? undefined,
    } : undefined,
    releaseDate: filters.recent
      ? {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        }
      : undefined,
  };

  const [total, data] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { releaseDate: "desc" },
      take: PAGE_SIZE,
      skip: ((filters.page ?? 1) - 1) * PAGE_SIZE,
    }),
  ]);

  return {
    data,
    total,
    page: filters.page ?? 1,
    pageSize: PAGE_SIZE,
  };
}

export async function getReleaseBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function getReleaseFilters() {
  const [brands, categories, stores] = await Promise.all([
    prisma.product.findMany({
      distinct: ["brand"],
      select: { brand: true },
      where: { visible: true },
      orderBy: { brand: "asc" },
    }),
    prisma.product.findMany({
      distinct: ["category"],
      select: { category: true },
      where: { visible: true },
      orderBy: { category: "asc" },
    }),
    prisma.product.findMany({
      distinct: ["store"],
      select: { store: true },
      where: { visible: true },
      orderBy: { store: "asc" },
    }),
  ]);

  return {
    brands: brands.map((b) => b.brand).filter(Boolean) as string[],
    categories: categories.map((c) => c.category).filter(Boolean) as string[],
    stores: stores.map((s) => s.store).filter(Boolean) as string[],
  };
}
