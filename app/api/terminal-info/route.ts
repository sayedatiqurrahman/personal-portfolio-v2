import { NextRequest, NextResponse } from "next/server";
import { getTerminalInfo, createTerminalInfo, updateTerminalInfo, deleteTerminalInfo } from "@/lib/db";

export async function GET() {
  const data = await getTerminalInfo();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createTerminalInfo(body);
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateTerminalInfo(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteTerminalInfo(id);
  return NextResponse.json({ ok: true });
}
