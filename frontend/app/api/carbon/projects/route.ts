import { NextResponse } from "next/server";
import { CARBON_PROJECTS } from "@/lib/mock";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/carbon/projects`, { next: { revalidate: 86400 } });
    if (res.ok) return NextResponse.json(await res.json());
  } catch {}
  return NextResponse.json(CARBON_PROJECTS);
}
