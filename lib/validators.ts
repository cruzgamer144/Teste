import { z } from "zod";

export const subscriptionSchema = z.object({
  channels: z.array(z.enum(["EMAIL", "PUSH", "SMS"])).min(1),
  rules: z.array(
    z.object({
      type: z.enum(["BRAND", "CATEGORY", "KEYWORD", "SIZE"]),
      value: z.string().min(1),
    })
  ),
});

export const pushSubscriptionSchema = z.object({
  subscription: z.object({
    endpoint: z.string(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
  productId: z.string().optional(),
});

export const adminApproveSchema = z.object({
  productId: z.string(),
  visible: z.boolean(),
});

export const adminSourceTestSchema = z.object({
  sourceId: z.string(),
});

export const preferenceSchema = z.object({
  brands: z.array(z.string()),
  categories: z.array(z.string()),
  sizes: z.array(z.string()),
  keywords: z.array(z.string()),
  channels: z.array(z.enum(["EMAIL", "PUSH", "SMS"])),
});
