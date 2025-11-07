import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { SITE_NAME } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} · Alertas instantâneos de lançamentos`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Deteta novos lançamentos de ténis, roupa, acessórios e tecnologia e recebe alertas instantâneos.",
  metadataBase: new URL("https://launchpulse.app"),
  openGraph: {
    title: SITE_NAME,
    description:
      "Deteta novos lançamentos de ténis, roupa, acessórios e tecnologia e recebe alertas instantâneos.",
    type: "website",
    url: "https://launchpulse.app",
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: "https://launchpulse.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${inter.variable} bg-white text-neutral-900 antialiased`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
