import { NextResponse } from "next/server";
import { GRAIN_HISTORY } from "@/lib/mock";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  try {
    const res = await fetch(`${BACKEND}/api/grains/price-history/${symbol}`, { next: { revalidate: 3600 } });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}
  return NextResponse.json(GRAIN_HISTORY[symbol.toUpperCase()] ?? []);
}
