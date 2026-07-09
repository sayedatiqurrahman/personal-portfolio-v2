import { NextRequest, NextResponse } from "next/server";
import { getRoles, createRole, updateRole, deleteRole } from "@/lib/db";

export async function GET() {
  const data = await getRoles();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createRole(body);
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateRole(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteRole(id);
  return NextResponse.json({ ok: true });
}
