import { prisma } from "@/lib/prisma";

export async function assertAdmin(userId: string) {
  const admin = await prisma.adminUser.findUnique({ where: { userId } });
  if (!admin) {
    throw new Error("Acesso negado");
  }
  return admin;
}

export async function listPendingProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function listSources() {
  return prisma.source.findMany({ orderBy: { createdAt: "desc" } });
}
