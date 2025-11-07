import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { assertAdmin, listPendingProducts, listSources } from "@/lib/admin-service";
import { AdminTable, SourcesTable } from "@/components/admin/admin-table";
import { toggleProductVisibility, fetchSourceSample } from "@/app/(site)/admin/actions";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    await assertAdmin(session.user.id);
  } catch (error) {
    redirect("/");
  }

  const [products, sources] = await Promise.all([listPendingProducts(), listSources()]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-neutral-900">Painel administrativo</h1>
        <p className="text-neutral-600">Aprova lançamentos, gere fontes e acompanha alertas.</p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Lançamentos recentes</h2>
          <p className="text-sm text-neutral-600">Ativa ou pausa a visibilidade dos lançamentos ingestados.</p>
        </div>
        <AdminTable products={products} onToggleVisibility={toggleProductVisibility} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Fontes conectadas</h2>
          <p className="text-sm text-neutral-600">Adiciona integrações RSS, APIs ou scrapers personalizadas.</p>
        </div>
        <SourcesTable sources={sources} onTestSource={fetchSourceSample} />
      </section>
    </div>
  );
}
