import { NextResponse } from "next/server";
import { ingestSources } from "@/lib/source-fetcher";
import { runMatching } from "@/lib/matching";

export async function GET() {
  await ingestSources();
  await runMatching();
  return NextResponse.json({ success: true });
}
