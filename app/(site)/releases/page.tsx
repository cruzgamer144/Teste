import { FiltersBar } from "@/components/releases/filters-bar";
import { ReleaseCard } from "@/components/releases/release-card";
import { listReleases, getReleaseFilters } from "@/lib/release-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ReleasesPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function parseNumber(value?: string | string[]) {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildPageHref(searchParams: ReleasesPageProps["searchParams"], page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (!value) continue;
    params.set(key, Array.isArray(value) ? value[0] : value);
  }
  params.set("page", page.toString());
  return `/releases?${params.toString()}`;
}

export default async function ReleasesPage({ searchParams }: ReleasesPageProps) {
  const page = parseNumber(searchParams.page as string | undefined) ?? 1;
  const filters = await getReleaseFilters();
  const releases = await listReleases({
    page,
    q: (searchParams.q as string) ?? undefined,
    brand: (searchParams.brand as string) ?? undefined,
    category: (searchParams.category as string) ?? undefined,
    store: (searchParams.store as string) ?? undefined,
    priceMin: parseNumber(searchParams.priceMin),
    priceMax: parseNumber(searchParams.priceMax),
    recent: searchParams.recent === "true",
  });

  const totalPages = Math.max(1, Math.ceil(releases.total / releases.pageSize));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-neutral-900">Lançamentos recentes</h1>
        <p className="text-neutral-600">
          Explora os lançamentos mais recentes filtrados pelas tuas marcas e lojas favoritas.
        </p>
      </div>

      <FiltersBar {...filters} />

      {releases.data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center text-neutral-500">
          Sem resultados neste momento. Ajusta filtros ou volta mais tarde.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {releases.data.map((product) => (
            <ReleaseCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button asChild variant="outline" disabled={releases.page <= 1}>
          <Link href={buildPageHref(searchParams, Math.max(1, releases.page - 1))}>Anterior</Link>
        </Button>
        <span className="text-sm text-neutral-500">
          Página {releases.page} de {totalPages}
        </span>
        <Button
          asChild
          variant="outline"
          disabled={releases.page >= totalPages}
        >
          <Link href={buildPageHref(searchParams, releases.page + 1)}>Seguinte</Link>
        </Button>
      </div>
    </div>
  );
}
