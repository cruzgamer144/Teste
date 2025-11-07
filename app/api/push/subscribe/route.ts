import { NextResponse } from "next/server";
import { pushSubscriptionSchema } from "@/lib/validators";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = pushSubscriptionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint: parsed.data.subscription.endpoint },
    update: {
      keys: parsed.data.subscription.keys,
      userId: session.user.id,
    },
    create: {
      userId: session.user.id,
      endpoint: parsed.data.subscription.endpoint,
      keys: parsed.data.subscription.keys,
    },
  });

  return NextResponse.json({ success: true });
}
