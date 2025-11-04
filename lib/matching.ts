import { prisma } from "@/lib/prisma";
import { sendLaunchEmail } from "@/lib/mailer";
import { sendPushNotification } from "@/lib/push";
import type { Product, MatchRule, Preference, AlertChannel } from "@prisma/client";

function matchesProduct(product: Product, preference?: Preference | null, rules?: MatchRule[]) {
  if (!preference && (!rules || rules.length === 0)) {
    return false;
  }

  const normalized = {
    brand: product.brand?.toLowerCase() ?? "",
    category: product.category?.toLowerCase() ?? "",
    name: product.name?.toLowerCase() ?? "",
    sizeRange: product.sizeRange?.toLowerCase() ?? "",
  };

  const keywords = new Set(
    preference?.keywords.map((keyword) => keyword.toLowerCase()) ??
      rules?.filter((rule) => rule.type === "KEYWORD").map((rule) => rule.value.toLowerCase()) ?? []
  );

  const brands = new Set(
    preference?.brands.map((brand) => brand.toLowerCase()) ??
      rules?.filter((rule) => rule.type === "BRAND").map((rule) => rule.value.toLowerCase()) ?? []
  );
  if (brands.size > 0 && !brands.has(normalized.brand)) {
    return false;
  }

  const categories = new Set(
    preference?.categories.map((category) => category.toLowerCase()) ??
      rules?.filter((rule) => rule.type === "CATEGORY").map((rule) => rule.value.toLowerCase()) ?? []
  );
  if (categories.size > 0 && !categories.has(normalized.category)) {
    return false;
  }

  const sizes = new Set(
    preference?.sizes.map((size) => size.toLowerCase()) ??
      rules?.filter((rule) => rule.type === "SIZE").map((rule) => rule.value.toLowerCase()) ?? []
  );
  if (sizes.size > 0) {
    const hasMatch = Array.from(sizes).some((size) => normalized.sizeRange.includes(size));
    if (!hasMatch) {
      return false;
    }
  }

  if (keywords.size > 0) {
    const hasKeyword = Array.from(keywords).some((keyword) =>
      normalized.name.includes(keyword) || normalized.brand.includes(keyword)
    );
    if (!hasKeyword) {
      return false;
    }
  }

  return true;
}

function buildEmailTemplate(product: Product) {
  return `
    <div style="font-family:Inter,Helvetica,sans-serif;padding:32px;background:#f8f9fb;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;padding:32px;box-shadow:0 20px 40px -24px rgba(31,41,55,0.2);">
        <h1 style="font-size:24px;margin-bottom:8px;color:#111827;">Novo lançamento: ${product.name}</h1>
        <p style="color:#6b7280;margin:0 0 16px;">${product.brand} em ${product.store}</p>
        <img src="${product.imageUrl}" alt="${product.name}" style="width:100%;border-radius:20px;object-fit:cover;margin-bottom:16px;" />
        <p style="font-size:18px;font-weight:600;color:#111827;">
          ${new Intl.NumberFormat("pt-PT", { style: "currency", currency: product.currency ?? "EUR" }).format(product.price ?? 0)}
        </p>
        <a href="${product.productUrl}?utm_source=launchpulse" style="display:inline-block;background:#304FFE;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">Comprar agora</a>
      </div>
    </div>
  `;
}

export async function runMatching() {
  const recentProducts = await prisma.product.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });
  if (recentProducts.length === 0) return;

  const users = await prisma.user.findMany({
    include: {
      preference: true,
      matchRules: true,
      alertSubscription: true,
      pushSubscriptions: true,
    },
  });

  const existingLogs = await prisma.dispatchLog.findMany({
    where: {
      productId: { in: recentProducts.map((product) => product.id) },
      sentAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });
  const sentMap = new Set(existingLogs.map((log) => `${log.userId}-${log.productId}-${log.channel}`));

  for (const product of recentProducts) {
    for (const user of users) {
      if (!user.alertSubscription?.active) continue;
      const shouldNotify = matchesProduct(product, user.preference, user.matchRules);
      if (!shouldNotify) continue;

      for (const channel of user.alertSubscription.channels as AlertChannel[]) {
        if (channel === "SMS") {
          continue; // futuro
        }
        const key = `${user.id}-${product.id}-${channel}`;
        if (sentMap.has(key)) continue;

        try {
          if (channel === "EMAIL" && user.email) {
            await sendLaunchEmail(user.email, buildEmailTemplate(product));
          } else if (channel === "PUSH") {
            const subscriptions = user.pushSubscriptions ?? [];
            await Promise.all(
              subscriptions.map((subscription) =>
                sendPushNotification(
                  { endpoint: subscription.endpoint, keys: subscription.keys as any },
                  {
                    title: `Novo lançamento: ${product.name}`,
                    body: `${product.brand} em ${product.store}`,
                    url: `/releases/${product.slug}`,
                  }
                )
              )
            );
          }

          await prisma.dispatchLog.create({
            data: {
              userId: user.id,
              productId: product.id,
              channel,
              status: "SENT",
              sentAt: new Date(),
            },
          });
          sentMap.add(key);
        } catch (error) {
          await prisma.dispatchLog.create({
            data: {
              userId: user.id,
              productId: product.id,
              channel,
              status: "ERROR",
              sentAt: new Date(),
            },
          });
        }
      }
    }
  }
}
