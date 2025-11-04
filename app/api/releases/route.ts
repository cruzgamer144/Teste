import { NextResponse } from "next/server";
import { listReleases } from "@/lib/release-service";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const limited = rateLimit(`releases:${ip}`);
  if (!limited.success) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const q = url.searchParams.get("q") ?? undefined;
  const brand = url.searchParams.get("brand") ?? undefined;
  const category = url.searchParams.get("category") ?? undefined;
  const store = url.searchParams.get("store") ?? undefined;
  const priceMin = url.searchParams.get("priceMin");
  const priceMax = url.searchParams.get("priceMax");
  const recent = url.searchParams.get("recent") === "true";

  const releases = await listReleases({
    page: Number.isFinite(page) ? page : 1,
    q,
    brand,
    category,
    store,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    recent,
  });

  return NextResponse.json(releases);
}
