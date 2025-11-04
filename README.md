# LaunchPulse

MVP completo para deteção de lançamentos de produtos com alertas instantâneos. Construído com Next.js 14, Prisma e PostgreSQL.

## Funcionalidades
- Landing page minimalista com explicação do serviço.
- Catálogo com filtros persistentes, pesquisa e paginação.
- Detalhe de produto com CTA e ativação de notificações push.
- Gestão de preferências com canais (email/push) e histórico de alertas.
- Painel admin para aprovar lançamentos, gerir fontes e reenviar alertas.
- API pública (`/api/releases`, `/api/subscribe`, `/api/push/subscribe`, rotas admin).
- Ingestão de fontes (RSS/JSON mock) via cron e matching de regras.
- Email via Resend/Nodemailer e Web Push com VAPID.

## Requisitos
- Node.js 18+
- PostgreSQL 14+

## Setup local
```bash
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```
Acede a `http://localhost:3000`.

### Contas demo
- Admin: `admin@launchpulse.app` (faz login via link mágico e o seed atribui perfil admin).

## Variáveis de ambiente
- `DATABASE_URL` – ligação PostgreSQL.
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` – NextAuth.
- `EMAIL_*` ou `RESEND_API_KEY` – envio de emails.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – login Google (opcional).
- `WEB_PUSH_PUBLIC_KEY` / `WEB_PUSH_PRIVATE_KEY` / `NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY` – chaves VAPID (`npx web-push generate-vapid-keys`).

## Deploy
- **Frontend/API**: Vercel. Configura as variáveis acima e o cron job (ex.: `*/15 * * * *` chamando `/api/cron/ingest`).
- **Base de dados**: Neon ou Railway com PostgreSQL. Ajusta `DATABASE_URL`.
- `npm run build` gera versão de produção. Usa `npx prisma migrate deploy` no build step.

## Service Worker & Push
- O ficheiro `public/sw.js` lida com eventos push e `EnablePushButton` regista a subscrição.
- Guardamos os endpoints em `PushSubscription` para reutilização.

## Estrutura principal
```
app/
  (site)/
    page.tsx             # Landing
    releases/            # Catálogo e detalhe
    account/             # Preferências
    admin/               # Painel admin
    auth/signin/         # Login NextAuth
    privacy/, terms/     # Páginas estáticas
  api/                   # Route handlers REST
components/              # UI, filtros, formulários
lib/                     # Prisma, matching, fetchers, utilitários
prisma/                  # Schema, migrations, seeds
public/                  # service worker
```

## Matching & Alertas
- `app/api/cron/ingest` invoca `ingestSources` (RSS/API demo) e `runMatching`.
- Matching compara `Preference` + `MatchRule` com novos produtos e envia canais ativos.
- `DispatchLog` regista envios e evita duplicados em 24h.

## Segurança
- Rate limit simples (60 req/min) em `/api/releases`.
- Validação com Zod em inputs críticos.
- Dark mode opcional via `next-themes` (auto).

## Roadmap futuro
- SMS (Twilio) ativável quando chave estiver disponível.
- Webhooks (Discord/Telegram) e deteção de restock.
