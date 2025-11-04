import { prisma } from "@/lib/prisma";
import type { MatchRule, AlertChannel } from "@prisma/client";

export async function getUserPreferences(userId: string) {
  const preference = await prisma.preference.findUnique({
    where: { userId },
  });
  const rules = await prisma.matchRule.findMany({ where: { userId } });
  const subscription = await prisma.alertSubscription.findFirst({ where: { userId } });

  return {
    preference,
    rules,
    subscription,
  };
}

export async function upsertPreferences({
  userId,
  brands,
  categories,
  sizes,
  keywords,
  channels,
}: {
  userId: string;
  brands: string[];
  categories: string[];
  sizes: string[];
  keywords: string[];
  channels: AlertChannel[];
}) {
  const [preference] = await prisma.$transaction([
    prisma.preference.upsert({
      where: { userId },
      update: { brands, categories, sizes, keywords },
      create: { userId, brands, categories, sizes, keywords },
    }),
    prisma.alertSubscription.upsert({
      where: { userId },
      update: { channels, active: channels.length > 0 },
      create: { userId, channels, active: channels.length > 0 },
    }),
    prisma.matchRule.deleteMany({ where: { userId } }),
    prisma.matchRule.createMany({
      data: [
        ...brands.map((brand) => ({ userId, type: "BRAND" as MatchRule["type"], value: brand })),
        ...categories.map((category) => ({ userId, type: "CATEGORY", value: category })),
        ...keywords.map((keyword) => ({ userId, type: "KEYWORD", value: keyword })),
        ...sizes.map((size) => ({ userId, type: "SIZE", value: size })),
      ],
      skipDuplicates: true,
    }),
  ]);

  return preference;
}
