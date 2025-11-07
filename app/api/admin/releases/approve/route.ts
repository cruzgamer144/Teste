import { NextResponse } from "next/server";
import { adminApproveSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { assertAdmin } from "@/lib/admin-service";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  await assertAdmin(session.user.id);

  const body = await request.json();
  const parsed = adminApproveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: parsed.data.productId },
    data: { visible: parsed.data.visible },
  });

  return NextResponse.json({ product });
}
