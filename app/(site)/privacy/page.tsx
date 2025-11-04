export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Política de Privacidade</h1>
      <p className="text-neutral-600">
        Respeitamos a tua privacidade. Utilizamos os teus dados apenas para entregar alertas relevantes sobre novos lançamentos e nunca partilhamos a tua informação com terceiros sem consentimento.
      </p>
      <section className="space-y-4 text-neutral-600">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Dados recolhidos</h2>
          <p>Email, preferências de marcas/categorias e subscrições push. Podes atualizar ou apagar a qualquer momento.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Conservação</h2>
          <p>Mantemos os dados enquanto a conta estiver ativa. Podes solicitar eliminação em support@launchpulse.app.</p>
        </div>
      </section>
    </div>
  );
}
