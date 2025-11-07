"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { preferenceSchema } from "@/lib/validators";
import { upsertPreferences } from "@/lib/preferences-service";
import type { AlertChannel } from "@prisma/client";

export async function updatePreferences(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const payload = {
    brands: JSON.parse((formData.get("brands") as string) ?? "[]"),
    categories: JSON.parse((formData.get("categories") as string) ?? "[]"),
    sizes: JSON.parse((formData.get("sizes") as string) ?? "[]"),
    keywords: JSON.parse((formData.get("keywords") as string) ?? "[]"),
    channels: JSON.parse((formData.get("channels") as string) ?? "[]") as AlertChannel[],
  };

  const parsed = preferenceSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Dados inválidos");
  }

  await upsertPreferences({ userId: session.user.id, ...parsed.data });
  revalidatePath("/account");
}
