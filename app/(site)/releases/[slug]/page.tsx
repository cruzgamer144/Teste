import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getReleaseBySlug } from "@/lib/release-service";
import { EnablePushButton } from "@/components/enable-push-button";

interface ReleaseDetailPageProps {
  params: { slug: string };
}

export default async function ReleaseDetailPage({ params }: ReleaseDetailPageProps) {
  const product = await getReleaseBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl gap-12 px-6 py-16 lg:grid lg:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft">
        <Image
          src={product.imageUrl ?? "https://placehold.co/800x800"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-neutral-500">{product.brand}</div>
          <h1 className="text-3xl font-semibold text-neutral-900">{product.name}</h1>
          <p className="text-sm text-neutral-600">{product.store}</p>
        </div>
        <p className="text-neutral-600">
          Categoria: {product.category} · Cores: {product.color ?? "-"} · Intervalo de tamanhos: {product.sizeRange ?? "-"}
        </p>
        <div className="text-2xl font-semibold text-neutral-900">
          {new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: product.currency ?? "EUR",
          }).format(product.price ?? 0)}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href={`${product.productUrl}?utm_source=launchpulse`} target="_blank">
              Comprar na loja
            </Link>
          </Button>
          <EnablePushButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
