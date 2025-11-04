import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@prisma/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export function ReleaseCard({ product }: { product: Product }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl">
        <Image
          src={product.imageUrl ?? "https://placehold.co/600x400"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-neutral-500">{product.brand}</div>
          <h3 className="text-lg font-semibold text-neutral-900">{product.name}</h3>
          <p className="text-sm text-neutral-600">
            {product.store} · {format(new Date(product.releaseDate ?? product.createdAt), "d MMM yyyy", { locale: pt })}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm font-medium text-neutral-900">
          <span>
            {new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: product.currency ?? "EUR",
            }).format(product.price ?? 0)}
          </span>
          <Button asChild size="sm">
            <Link href={`/releases/${product.slug}`}>Ver produto</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
