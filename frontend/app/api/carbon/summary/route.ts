import { NextResponse } from "next/server";
import { CARBON_SUMMARY } from "@/lib/mock";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/carbon/summary`, { next: { revalidate: 60 } });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}
  return NextResponse.json(CARBON_SUMMARY);
}
