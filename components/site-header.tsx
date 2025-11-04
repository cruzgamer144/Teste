import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/utils";
import { auth } from "@/lib/auth";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-neutral-900">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-3 text-sm text-neutral-600">
          <Link href="/releases" className="hover:text-neutral-900">
            Lançamentos
          </Link>
          <Link href="/account" className="hover:text-neutral-900">
            Preferências
          </Link>
          <Link href="/admin" className="hover:text-neutral-900">
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <Button asChild variant="outline">
              <Link href="/account">Olá, {session.user.name ?? "utilizador"}</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">Criar conta</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
