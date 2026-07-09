import { NextRequest, NextResponse } from "next/server";
import { getSkills, createSkill, updateSkill, deleteSkill } from "@/lib/db";

export async function GET() {
  const data = await getSkills();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createSkill(body);
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateSkill(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteSkill(id);
  return NextResponse.json({ ok: true });
}
