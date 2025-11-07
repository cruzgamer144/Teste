import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/utils";
import Image from "next/image";

const steps = [
  {
    title: "Seleciona preferências",
    description: "Escolhe marcas, categorias, tamanhos e palavras-chave que adoras.",
  },
  {
    title: "Detectamos lançamentos",
    description: "Monitorizamos dezenas de lojas e fontes em tempo real com integrações flexíveis.",
  },
  {
    title: "Recebe alertas instantâneos",
    description: "Email, push e (em breve) SMS para comprares antes de esgotar.",
  },
];

const brands = ["Nike", "Adidas", "New Balance", "Supreme", "Apple", "Patagonia"];

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-16 text-center">
        <span className="mx-auto inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-xs uppercase tracking-widest text-neutral-500">
          MVP Disponível
        </span>
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold text-neutral-900 sm:text-5xl">
            Recebe alertas instantâneos de lançamentos.
          </h1>
          <p className="text-lg text-neutral-600">
            {SITE_NAME} monitoriza ténis, roupa, acessórios e tech. Filtra por preferências e compra antes de esgotar.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/auth/signin">Criar conta</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/releases">Explorar lançamentos</Link>
          </Button>
        </div>
        <div className="mx-auto flex w-full max-w-4xl justify-center rounded-3xl border border-neutral-200 bg-white p-10 shadow-soft">
          <Image
            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"
            alt="Sneakers em destaque"
            width={1200}
            height={800}
            className="rounded-3xl object-cover shadow-soft"
            priority
          />
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-3 text-sm text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-2xl font-semibold text-neutral-900">
          Confiado por fãs das principais marcas
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-neutral-400">
          {brands.map((brand) => (
            <span key={brand} className="text-lg font-medium uppercase tracking-wide">
              {brand}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-4xl space-y-8 px-6 text-center">
          <h2 className="text-3xl font-semibold text-neutral-900">Perguntas frequentes</h2>
          <div className="space-y-6 text-left text-sm text-neutral-600">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-medium text-neutral-900">Como são obtidos os lançamentos?</h3>
              <p className="mt-2">
                Ligamo-nos a feeds RSS, APIs oficiais e integrações personalizadas com scraping quando necessário. O MVP inclui duas fontes demo.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-medium text-neutral-900">Posso personalizar os alertas?</h3>
              <p className="mt-2">
                Sim. Define as tuas preferências por marca, categoria, tamanho e palavras-chave. Escolhe email ou push como canal principal.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft">
              <h3 className="text-lg font-medium text-neutral-900">Há versão gratuita?</h3>
              <p className="mt-2">
                O MVP oferece plano gratuito com alertas essenciais e um plano Pro (brevemente) com prioridade e SMS.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
