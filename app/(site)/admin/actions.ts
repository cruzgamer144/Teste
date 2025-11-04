"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { adminApproveSchema, adminSourceTestSchema } from "@/lib/validators";
import { assertAdmin } from "@/lib/admin-service";
import { prisma } from "@/lib/prisma";
import { fetchSourceProducts } from "@/lib/source-fetcher";

export async function toggleProductVisibility(productId: string, visible: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }
  await assertAdmin(session.user.id);

  const payload = adminApproveSchema.parse({ productId, visible });
  await prisma.product.update({ where: { id: payload.productId }, data: { visible: payload.visible } });
  revalidatePath("/admin");
}

export async function fetchSourceSample(sourceId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }
  await assertAdmin(session.user.id);

  const payload = adminSourceTestSchema.parse({ sourceId });
  const source = await prisma.source.findUnique({ where: { id: payload.sourceId } });
  if (!source) {
    throw new Error("Fonte não encontrada");
  }
  return fetchSourceProducts(source);
}
