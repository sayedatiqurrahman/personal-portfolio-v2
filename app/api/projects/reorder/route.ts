import { NextRequest, NextResponse } from "next/server";
import { reorderProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ ok: false, error: "items must be an array" }, { status: 400 });
    }
    const ok = await reorderProjects(items);
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
