import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* @ts-expect-error Async Server Component */}
      <SiteHeader />
      <div className="flex-1 bg-white">{children}</div>
      <SiteFooter />
    </div>
  );
}
