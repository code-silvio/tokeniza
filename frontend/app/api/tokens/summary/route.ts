import { NextResponse } from "next/server";
import { TOKENS_SUMMARY } from "@/lib/mock";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/tokens/summary`, { next: { revalidate: 300 } });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}
  return NextResponse.json(TOKENS_SUMMARY);
}
