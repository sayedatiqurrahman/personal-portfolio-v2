import { NextRequest, NextResponse } from "next/server";
import { getSkills, createSkill, updateSkill, deleteSkill } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSkills();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await createSkill(body);
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();
    await updateSkill(id, data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await deleteSkill(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
