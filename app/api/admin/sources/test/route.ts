import { NextResponse } from "next/server";
import { adminSourceTestSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { assertAdmin } from "@/lib/admin-service";
import { prisma } from "@/lib/prisma";
import { fetchSourceProducts } from "@/lib/source-fetcher";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  await assertAdmin(session.user.id);

  const body = await request.json();
  const parsed = adminSourceTestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const source = await prisma.source.findUnique({ where: { id: parsed.data.sourceId } });
  if (!source) {
    return NextResponse.json({ error: "Fonte não encontrada" }, { status: 404 });
  }

  const sample = await fetchSourceProducts(source);
  return NextResponse.json({ sample });
}
