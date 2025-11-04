import { NextResponse } from "next/server";
import { subscriptionSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = subscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.alertSubscription.upsert({
      where: { userId: session.user.id },
      update: { channels: parsed.data.channels, active: true },
      create: {
        userId: session.user.id,
        channels: parsed.data.channels,
        active: true,
      },
    }),
    prisma.matchRule.deleteMany({ where: { userId: session.user.id } }),
    prisma.matchRule.createMany({
      data: parsed.data.rules.map((rule) => ({
        userId: session.user.id,
        type: rule.type,
        value: rule.value,
      })),
      skipDuplicates: true,
    }),
  ]);

  return NextResponse.json({ success: true });
}
