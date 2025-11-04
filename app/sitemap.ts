import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { visible: true },
    select: { slug: true, updatedAt: true },
    take: 200,
  });

  return [
    {
      url: "https://launchpulse.app/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://launchpulse.app/releases",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    ...products.map((product) => ({
      url: `https://launchpulse.app/releases/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
