import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} LaunchPulse. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-neutral-900">
            Privacidade
          </Link>
          <Link href="/terms" className="hover:text-neutral-900">
            Termos
          </Link>
          <Link href="/sitemap.xml" className="hover:text-neutral-900">
            Sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
