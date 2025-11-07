"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FiltersBarProps {
  brands: string[];
  categories: string[];
  stores: string[];
}

export function FiltersBar({ brands, categories, stores }: FiltersBarProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialMin = useMemo(() => Number(params.get("priceMin") ?? "0"), [params]);
  const initialMax = useMemo(() => Number(params.get("priceMax") ?? "400"), [params]);
  const [priceMin, setPriceMin] = useState(initialMin);
  const [priceMax, setPriceMax] = useState(initialMax);

  useEffect(() => {
    setPriceMin(initialMin);
  }, [initialMin]);

  useEffect(() => {
    setPriceMax(initialMax);
  }, [initialMax]);

  const setParam = (key: string, value: string) => {
    const current = new URLSearchParams(params.toString());
    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    current.delete("page");
    startTransition(() => {
      router.push(`/releases?${current.toString()}`);
    });
  };

  const resetFilters = () => {
    startTransition(() => router.push("/releases"));
  };

  const applyPriceFilter = () => {
    const current = new URLSearchParams(params.toString());
    current.set("priceMin", priceMin.toString());
    current.set("priceMax", priceMax.toString());
    current.delete("page");
    startTransition(() => router.push(`/releases?${current.toString()}`));
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Input
          placeholder="Pesquisar por palavra-chave"
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setParam("q", (event.target as HTMLInputElement).value);
            }
          }}
        />
        <Select
          defaultValue={params.get("brand") ?? ""}
          onChange={(event) => setParam("brand", event.target.value)}
        >
          <option value="">Todas as marcas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Select>
        <Select
          defaultValue={params.get("category") ?? ""}
          onChange={(event) => setParam("category", event.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Select
          defaultValue={params.get("store") ?? ""}
          onChange={(event) => setParam("store", event.target.value)}
        >
          <option value="">Todas as lojas</option>
          {stores.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </Select>
        <Select
          defaultValue={params.get("recent") ?? ""}
          onChange={(event) => setParam("recent", event.target.value)}
        >
          <option value="">Qualquer data</option>
          <option value="true">Últimos 7 dias</option>
        </Select>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
            <span>Preço mínimo</span>
            <span>{priceMin}€</span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            step={5}
            value={priceMin}
            onChange={(event) => setPriceMin(Math.min(Number(event.target.value), priceMax))}
            className="accent-brand"
          />
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
            <span>Preço máximo</span>
            <span>{priceMax}€</span>
          </div>
          <input
            type="range"
            min={0}
            max={800}
            step={5}
            value={priceMax}
            onChange={(event) => setPriceMax(Math.max(Number(event.target.value), priceMin))}
            className="accent-brand"
          />
          <Button type="button" size="sm" variant="subtle" onClick={applyPriceFilter} disabled={isPending}>
            Aplicar preço
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="subtle"
          onClick={resetFilters}
          disabled={isPending}
        >
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
