"use client";

import { useState, useTransition } from "react";
import type { Product, Source } from "@prisma/client";
import { Button } from "@/components/ui/button";

export function AdminTable({ products, onToggleVisibility }: {
  products: Product[];
  onToggleVisibility: (productId: string, visible: boolean) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Produto</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Marca</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Loja</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Visível</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {products.map((product) => (
            <tr key={product.id} className="bg-white text-sm text-neutral-700">
              <td className="px-4 py-3 font-medium text-neutral-900">{product.name}</td>
              <td className="px-4 py-3">{product.brand}</td>
              <td className="px-4 py-3">{product.store}</td>
              <td className="px-4 py-3">{product.visible ? "Sim" : "Não"}</td>
              <td className="px-4 py-3 text-right">
                <Button
                  size="sm"
                  variant={product.visible ? "outline" : "default"}
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => onToggleVisibility(product.id, !product.visible))
                  }
                >
                  {product.visible ? "Ocultar" : "Aprovar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SourcesTable({
  sources,
  onTestSource,
}: {
  sources: Source[];
  onTestSource?: (sourceId: string) => Promise<any[]>;
}) {
  const [pendingSource, setPendingSource] = useState<string | null>(null);
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft">
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Fonte</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Tipo</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">URL</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Ativa</th>
            {onTestSource ? <th className="px-4 py-3" /> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {sources.map((source) => (
            <tr key={source.id} className="bg-white text-sm text-neutral-700">
              <td className="px-4 py-3 font-medium text-neutral-900">{source.name}</td>
              <td className="px-4 py-3">{source.type}</td>
              <td className="px-4 py-3">
                <a href={source.url} className="text-brand" target="_blank" rel="noreferrer">
                  {source.url}
                </a>
              </td>
              <td className="px-4 py-3">{source.enabled ? "Sim" : "Não"}</td>
              {onTestSource ? (
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pendingSource === source.id}
                    onClick={async () => {
                      try {
                        setPendingSource(source.id);
                        const sample = await onTestSource(source.id);
                        if (sample?.length) {
                          alert(`Pré-visualização: ${sample[0].name ?? "Produto"} (+${Math.max(0, sample.length - 1)} mais)`);
                        } else {
                          alert("Sem resultados de teste para esta fonte.");
                        }
                      } finally {
                        setPendingSource(null);
                      }
                    }}
                  >
                    Testar
                  </Button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
