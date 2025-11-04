"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { preferenceSchema } from "@/lib/validators";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { updatePreferences } from "@/app/(site)/account/actions";

const availableChannels = [
  { value: "EMAIL", label: "Email" },
  { value: "PUSH", label: "Push" },
  { value: "SMS", label: "SMS (brevemente)" },
] as const;

type PreferenceFormValues = z.infer<typeof preferenceSchema>;

interface PreferencesFormProps {
  defaultValues: PreferenceFormValues;
}

export function PreferencesForm({ defaultValues }: PreferencesFormProps) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PreferenceFormValues>({
    resolver: zodResolver(preferenceSchema),
    defaultValues,
  });

  const onSubmit = async (values: PreferenceFormValues) => {
    setState("saving");
    setError(null);
    try {
      const formData = new FormData();
      formData.set("brands", JSON.stringify(values.brands));
      formData.set("categories", JSON.stringify(values.categories));
      formData.set("sizes", JSON.stringify(values.sizes));
      formData.set("keywords", JSON.stringify(values.keywords));
      formData.set("channels", JSON.stringify(values.channels));
      await updatePreferences(formData);
      setState("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setState("idle");
    }
  };

  const handleCommaFieldChange = (field: keyof PreferenceFormValues, value: string) => {
    const entries = value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    form.setValue(field, entries as any);
  };

  const brands = form.watch("brands") ?? [];
  const categories = form.watch("categories") ?? [];
  const sizes = form.watch("sizes") ?? [];
  const keywords = form.watch("keywords") ?? [];
  const channels = form.watch("channels") ?? [];

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="mb-2 block">Marcas favoritas</Label>
          <Input
            placeholder="Nike, Adidas"
            value={brands.join(", ")}
            onChange={(event) => handleCommaFieldChange("brands", event.target.value)}
          />
          <p className="mt-1 text-xs text-neutral-400">Separa por vírgulas.</p>
        </div>
        <div>
          <Label className="mb-2 block">Categorias preferidas</Label>
          <Input
            placeholder="Ténis, roupa"
            value={categories.join(", ")}
            onChange={(event) => handleCommaFieldChange("categories", event.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2 block">Tamanhos</Label>
          <Input
            placeholder="EU 42, M"
            value={sizes.join(", ")}
            onChange={(event) => handleCommaFieldChange("sizes", event.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2 block">Palavras-chave</Label>
          <Input
            placeholder="Air Max, edição limitada"
            value={keywords.join(", ")}
            onChange={(event) => handleCommaFieldChange("keywords", event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
        <p className="mb-4 text-sm font-medium text-neutral-700">Canais ativos</p>
        <div className="flex flex-col gap-3">
          {availableChannels.map((channel) => {
            const checked = channels.includes(channel.value);
            return (
              <label key={channel.value} className="flex items-center gap-3 text-sm text-neutral-700">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) => {
                    const current = form.getValues("channels");
                    if (value && value !== "indeterminate") {
                      form.setValue("channels", [...new Set([...current, channel.value])]);
                    } else {
                      form.setValue(
                        "channels",
                        current.filter((item) => item !== channel.value)
                      );
                    }
                  }}
                  disabled={channel.value === "SMS"}
                />
                <span>{channel.label}</span>
              </label>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-neutral-400">SMS disponível em breve.</p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={state === "saving"}>
          Guardar preferências
        </Button>
        {state === "saved" && <span className="text-sm text-green-600">Guardado!</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </form>
  );
}
