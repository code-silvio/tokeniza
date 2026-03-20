import { NextResponse } from "next/server";
import { ALL_TVL } from "@/lib/mock";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/tokens/tvl`, { next: { revalidate: 1800 } });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}
  return NextResponse.json(ALL_TVL);
}
