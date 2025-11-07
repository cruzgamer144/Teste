export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Termos de Serviço</h1>
      <p className="text-neutral-600">
        Ao utilizar o LaunchPulse aceitas receber comunicações relacionadas com novos lançamentos de produtos e concordas em usar o serviço de forma responsável.
      </p>
      <section className="space-y-4 text-neutral-600">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Utilização justa</h2>
          <p>Não abuses dos alertas nem partilhes conteúdos maliciosos. Reservamo-nos o direito de suspender contas em caso de abuso.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Responsabilidade</h2>
          <p>Os links podem apontar para lojas de terceiros. Não garantimos disponibilidade ou preços e não somos responsáveis por transações externas.</p>
        </div>
      </section>
    </div>
  );
}
