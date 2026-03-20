import { NextResponse } from "next/server";
import { MARKET_COMPARE } from "@/lib/mock";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/grains/market-compare`, { next: { revalidate: 86400 } });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}
  return NextResponse.json(MARKET_COMPARE);
}
