import { NextResponse } from "next/server";
import { GRAINS_SUMMARY } from "@/lib/mock";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/grains/summary`, { next: { revalidate: 3600 } });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}
  return NextResponse.json(GRAINS_SUMMARY);
}
