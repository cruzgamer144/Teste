import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserPreferences } from "@/lib/preferences-service";
import { PreferencesForm } from "@/components/account/preferences-form";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [{ preference, subscription }, history] = await Promise.all([
    getUserPreferences(session.user.id),
    prisma.dispatchLog.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { sentAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-neutral-900">Preferências</h1>
        <p className="text-neutral-600">
          Ajusta os teus filtros para receberes os lançamentos perfeitos.
        </p>
      </div>

      <PreferencesForm
        defaultValues={{
          brands: preference?.brands ?? [],
          categories: preference?.categories ?? [],
          sizes: preference?.sizes ?? [],
          keywords: preference?.keywords ?? [],
          channels: subscription?.channels ?? ["EMAIL"],
        }}
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-900">Histórico recente de alertas</h2>
        {history.length === 0 ? (
          <p className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-500">
            Ainda não recebeste alertas. Assim que aprovamos novos lançamentos compatíveis, vais recebê-los aqui.
          </p>
        ) : (
          <ul className="space-y-3">
            {history.map((log) => (
              <li
                key={log.id}
                className="flex flex-col justify-between gap-2 rounded-2xl border border-neutral-200 bg-white p-4 shadow-soft sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">{log.product?.name}</p>
                  <p className="text-xs text-neutral-500">
                    {log.channel} · {log.status} · {formatDistanceToNow(new Date(log.sentAt), { locale: pt, addSuffix: true })}
                  </p>
                </div>
                {log.product?.slug ? (
                  <Link className="text-sm font-medium text-brand" href={`/releases/${log.product.slug}`}>
                    Ver lançamento
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
